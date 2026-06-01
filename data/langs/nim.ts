import { lang, section, card } from '../helpers';

export default lang({
  id: "nim", name: "Nim", ext: ".nim", year: 2008, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + syntax", {
        beginner: {
          explanation: "Nim is a statically typed language that compiles to C (making it as fast as C), but has Python-like syntax and powerful metaprogramming. It's used for game development, systems programming, and scripts. Nim uses indentation like Python but generates extremely efficient code.",
          code: `# hash is the comment character in Nim

# variables
let name = "Alice"    # immutable
var age  = 25         # mutable
const PI = 3.14159    # compile-time constant

# type inference — Nim figures it out
let x = 42           # int
let y = 3.14         # float
let s = "hello"      # string

# explicit types
let count: int    = 0
let ratio: float  = 0.75
let flag:  bool   = true

# print
echo "Hello, " & name & "!"   # & = string concat
echo "Age: ", age              # echo takes multiple args

# string interpolation with fmt
import std/strformat
echo fmt"Hello, {name}! You are {age} years old."

# age can be changed since it's var
age = 26
echo "Now age: ", age`,
          examples: [
            { input: `nim compile --run hello.nim`, output: `Hello, Alice!\nAge: 25` },
            { input: `echo 2 ^ 10`, output: `1024` },
          ],
          note: "Nim compiles to C first, then uses a C compiler. so Nim programs can be as fast as hand-written C, but with a much nicer syntax and powerful features like garbage collection",
        },
        intermediate: {
          explanation: "Nim's procedures work like functions. Nim has a unique feature — you can define operators on any type and call methods with method call syntax (value.method()) even if method is a regular procedure.",
          code: `# procedure — Nim's word for function
proc add(a, b: int): int =
    a + b    # last expression is the return value

proc greet(name: string, loud = false): string =
    let msg = "Hello, " & name & "!"
    if loud: msg.toUpper()   # toUpper from strutils
    else:    msg

echo add(3, 5)         # 8
echo greet("Alice")    # Hello, Alice!
echo greet("Alice", loud = true)  # HELLO, ALICE!

# method call syntax — x.proc(args) = proc(x, args)
echo "hello".toUpper()           # HELLO
echo [1,2,3,4,5].len             # 5
echo add(3, 5)                   # 8
echo 3.add(5)                    # 8 — same thing!

# sequences — like dynamic arrays
var nums = @[1, 2, 3, 4, 5]   # @ prefix = sequence
nums.add(6)                     # add to end
echo nums.len                   # 6
echo nums[0]                    # 1

# iterate
for n in nums:
    echo n * 2`,
          examples: [
            { input: `@[1,2,3,4,5].filterIt(it mod 2 == 0)`, output: `@[2, 4]` },
            { input: `@[1,2,3].mapIt(it * it)`, output: `@[1, 4, 9]` },
          ],
        },
        advanced: {
          explanation: "Nim's macros and templates are compile-time code transformations. Templates are like inline functions. Macros have access to the AST and can generate arbitrary code. This is used to build DSLs (Domain Specific Languages).",
          code: `import macros

# template — simple code substitution (like inline function)
template repeat(n: int, body: untyped) =
    for i in 0..<n:
        body

repeat(3):
    echo "hello"   # prints hello 3 times

# macro — transforms the AST at compile time
macro debug(x: typed): untyped =
    result = quote do:
        echo astToStr(\`x\`) & " = " & $\`x\`

let answer = 42
debug(answer)   # prints: answer = 42

# effect system — track side effects in types
proc pureFunc(x: int): int {.noSideEffect.} =
    x * x   # can't do IO, can't modify globals

# async/await
import asyncdispatch, asyncnet

proc fetchPage(url: string): Future[string] {.async.} =
    let client = newAsyncHttpClient()
    result = await client.getContent(url)

proc main() {.async.} =
    let content = await fetchPage("http://example.com")
    echo content.len

waitFor main()`,
          examples: [
            { input: `repeat(3): echo "hi"`, output: `hi\nhi\nhi` },
            { input: `debug(1 + 2)`, output: `1 + 2 = 3` },
          ],
          note: "Nim's effect system tracks which functions have side effects, raise exceptions, or allocate memory. this allows the compiler to enforce purity and give optimizations similar to Haskell's pure functions",
        },
      }),
    ]),
  ],
});
