import { lang, section, card } from '../helpers';

export default lang({
  id: "lua", name: "Lua", ext: ".lua", year: 1993, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "Lua is a small, fast scripting language used in games (Roblox, World of Warcraft addons), embedded systems, and as a config language. It has only 8 types and very simple syntax. Variables are global by default — always use 'local'.",
          code: `-- comments start with --
--[[ multi-line
     comment ]]

-- basic types
local name    = "Alice"   -- string
local age     = 25        -- number (Lua has ONE number type)
local pi      = 3.14      -- also number
local isAdmin = true      -- boolean
local nothing = nil       -- nil (like null)

-- ALWAYS use local — global variables are slow and pollute namespace
local x = 10  -- good
y = 20        -- bad — global, slow

-- print
print("Hello, " .. name)    -- .. is string concatenation
print(age + 5)               -- 30

-- string formatting
print(string.format("%.2f", pi))  -- 3.14

-- type checking
print(type(name))    -- string
print(type(age))     -- number
print(type(nil))     -- nil
print(type(true))    -- boolean`,
          examples: [
            { input: `print("hello" .. " " .. "world")`, output: `hello world` },
            { input: `print(type(42))`, output: `number` },
          ],
          note: "Lua arrays start at 1, not 0. This is conventional in Lua — you CAN start at 0 but it breaks many built-in functions. Always start at 1 in Lua",
        },
        intermediate: {
          explanation: "Lua's table is the one data structure that does everything — arrays, dictionaries, objects, modules, namespaces. Metatables let you customize how tables behave (operator overloading, inheritance).",
          code: `-- table as array (1-indexed!)
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])       -- apple (1-indexed!)
print(#fruits)         -- 3 (# = length)
table.insert(fruits, "mango")    -- append
table.remove(fruits, 2)          -- remove at index 2

-- table as dictionary
local user = {
    name  = "Alice",
    age   = 25,
    email = "alice@example.com",
}
print(user.name)          -- Alice
print(user["age"])        -- 25 — bracket notation
user.city = "Boston"      -- add field

-- iterate arrays
for i, v in ipairs(fruits) do
    print(i, v)   -- 1 apple, 2 banana, ...
end

-- iterate dictionaries
for key, value in pairs(user) do
    print(key, value)
end

-- mixed table
local mixed = {10, 20, x = 100, y = 200, 30}
-- mixed[1]=10, mixed[2]=20, mixed[3]=30
-- mixed.x=100, mixed.y=200`,
          examples: [
            { input: `local t = {10, 20, 30}\nprint(#t, t[1], t[#t])`, output: `3  10  30` },
          ],
          note: "#table gives the length of the array part. it's undefined for tables with holes (missing indices) or for the dictionary part. use a counter variable for dictionaries",
        },
        advanced: {
          explanation: "Metatables let you customize how tables behave — overload operators, create class hierarchies, add default values. The __index metamethod is how Lua's OOP works.",
          code: `-- metatable — customize table behavior
local Vector = {}
Vector.__index = Vector   -- look up methods in Vector table

-- 'constructor'
function Vector.new(x, y)
    return setmetatable({x=x, y=y}, Vector)
end

-- methods (accessed via __index)
function Vector:length()
    return math.sqrt(self.x^2 + self.y^2)
end

function Vector:__add(other)  -- operator overloading
    return Vector.new(self.x + other.x, self.y + other.y)
end

function Vector:__tostring()
    return string.format("(%g, %g)", self.x, self.y)
end

local v1 = Vector.new(3, 4)
local v2 = Vector.new(1, 2)
print(v1:length())       -- 5.0
print(tostring(v1))      -- (3, 4)
local v3 = v1 + v2      -- uses __add
print(tostring(v3))      -- (4, 6)

-- __index as function — proxy/fallback
local defaults = {color="red", size=10}
local obj = setmetatable({}, {
    __index = function(t, k)
        return defaults[k]   -- look up in defaults if not in obj
    end
})
print(obj.color)   -- "red" (from defaults)`,
          examples: [
            { input: `v1:length()  -- v1 = Vector(3,4)`, output: `5.0` },
          ],
          note: "the colon syntax v:method() is shorthand for v.method(v) — it passes the table as the first argument (self). you can also call methods with a dot but must pass self manually",
        },
      }),

      card("functions + closures", {
        beginner: {
          explanation: "Functions in Lua are first-class values — you can store them in variables, tables, and pass them around. Lua functions can return multiple values, which is used everywhere in Lua APIs.",
          code: `-- basic function
local function add(a, b)
    return a + b
end

-- same thing — functions are just values
local multiply = function(a, b)
    return a * b
end

print(add(3, 4))       -- 7
print(multiply(3, 4))  -- 12

-- multiple return values!
local function divmod(a, b)
    return math.floor(a / b), a % b
end

local q, r = divmod(17, 5)
print(q, r)   -- 3  2

-- variadic functions
local function sum(...)
    local args = {...}   -- pack into table
    local total = 0
    for _, n in ipairs(args) do
        total = total + n
    end
    return total
end
print(sum(1, 2, 3, 4, 5))  -- 15

-- functions in tables (like methods)
local math_utils = {
    square = function(n) return n * n end,
    cube   = function(n) return n * n * n end,
}
print(math_utils.square(5))  -- 25`,
          examples: [
            { input: `local function swap(a,b) return b,a end\nlocal x,y = swap(1,2)\nprint(x,y)`, output: `2  1` },
          ],
          note: "multiple return values are used extensively in Lua. pcall returns (status, result) — status is true on success, false on error. string.find returns (start, end) or nil",
        },
        intermediate: {
          explanation: "Closures capture variables from their surrounding scope. This is how Lua implements private state and iterators. Coroutines are like generators — they can pause and resume.",
          code: `-- closure — captures surrounding variables
local function make_counter(start)
    local count = start or 0   -- or = default value
    return {
        increment = function() count = count + 1 end,
        decrement = function() count = count - 1 end,
        get       = function() return count end,
    }
end

local c = make_counter(10)
c.increment()
c.increment()
print(c.get())   -- 12 (count is private to the closure)

-- coroutine — cooperative multitasking
local co = coroutine.create(function()
    print("start")
    coroutine.yield("first")    -- pause here
    print("middle")
    coroutine.yield("second")   -- pause here
    print("end")
end)

print(coroutine.resume(co))    -- start,  true  first
print(coroutine.resume(co))    -- middle, true  second
print(coroutine.resume(co))    -- end,    true

-- coroutine as iterator
local function range(from, to)
    return coroutine.wrap(function()
        for i = from, to do
            coroutine.yield(i)
        end
    end)
end

for n in range(1, 5) do
    print(n)   -- 1, 2, 3, 4, 5
end`,
          examples: [
            { input: `for n in range(1,3) do print(n) end`, output: `1\n2\n3` },
          ],
        },
        advanced: {
          explanation: "Lua's pcall catches errors without crashing. xpcall adds a message handler. The debug library gives you stack traces and can inspect/modify running code.",
          code: `-- pcall — protected call, catches errors
local ok, result = pcall(function()
    error("something went wrong")
end)
print(ok)      -- false
print(result)  -- ...something went wrong

-- pcall with a function and arguments
local ok, val = pcall(tonumber, "42")
print(ok, val)  -- true  42

local ok, err = pcall(tonumber, {})  -- table can't be a number
print(ok, err)  -- false  (error message)

-- xpcall — error handler gets stack trace
local function errorHandler(err)
    return debug.traceback(err, 2)
end

local ok, msg = xpcall(riskyFunction, errorHandler)
if not ok then
    print("Error with traceback:", msg)
end

-- custom error with table (structured error)
local function failWithInfo(code, message)
    error({ code = code, message = message })
end

local ok, err = pcall(failWithInfo, 404, "not found")
if not ok and type(err) == "table" then
    print(err.code, err.message)  -- 404  not found
end`,
          examples: [
            { input: `local ok, val = pcall(function() return 42 end)\nprint(ok, val)`, output: `true  42` },
            { input: `local ok, err = pcall(error, "oops")\nprint(ok, err)`, output: `false  ...oops` },
          ],
          note: "always use pcall for any code that might fail in production — unprotected errors in Lua crash the coroutine (or the whole program in some environments). pcall is the Lua equivalent of try/catch",
        },
      }),
    ]),
  ],
});
