import { lang, section, card } from '../helpers';

export default lang({
  id: "python", name: "Python", ext: ".py", year: 1991, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "A variable is a named container that holds a value. In Python you just write the name, an equals sign, and the value — no need to declare a type first. Python figures out the type automatically.",
          code: `name = "Alice"      # text, called a string
age  = 25           # whole number, called an int
height = 1.75       # decimal number, called a float
is_cool = True      # yes/no value, called a bool
nothing = None      # represents "no value"

print(name)         # Alice
print(age + 5)      # 30
print(type(age))    # <class 'int'>`,
          examples: [
            { input: `x = 10\ny = 3\nprint(x + y, x - y, x * y, x / y)`, output: `13 7 30 3.3333...` },
            { input: `name = "Alice"\nprint("Hello " + name)`, output: `Hello Alice` },
          ],
          note: "you can always check what type something is with type(). Python won't stop you from changing a variable's type — x = 5 then x = 'hello' is fine",
        },
        intermediate: {
          explanation: "Python is dynamically typed — variables are just names pointing at objects in memory. Type hints (added in Python 3.5) are optional labels that help editors and tools catch mistakes, but Python itself ignores them at runtime.",
          code: `# type hints — optional but recommended
name: str  = "Alice"
count: int = 0
ratio: float = 0.75
items: list[str] = []

# f-strings — the best way to format strings
msg = f"Hello {name}, you are {age} years old"
debug = f"{count = }"   # prints: count = 0

# multiple assignment at once
a, b, c = 1, 2, 3
x = y = z = 0       # all three set to 0

# swap without a temp variable
a, b = b, a`,
          examples: [
            { input: `f"{3.14159:.2f}"`, output: `"3.14"  # 2 decimal places` },
            { input: `a, b = 10, 20\na, b = b, a\nprint(a, b)`, output: `20 10` },
          ],
          note: "type hints are checked by tools like mypy and pyright, not by Python itself. use them in any code you'll share or maintain long-term",
        },
        advanced: {
          explanation: "In Python, variables are references to objects — not boxes containing values. Two variables can point to the same object. This causes bugs when you mutate a shared mutable object (like a list) without realizing it. Understanding this is key to avoiding a whole class of subtle bugs.",
          code: `# variables are references, not boxes
a = [1, 2, 3]
b = a           # b points to the SAME list
b.append(4)
print(a)        # [1, 2, 3, 4] — a changed!

# fix: make an explicit copy
b = a.copy()    # shallow copy — safe for flat lists
b = a[:]        # also shallow copy
import copy
b = copy.deepcopy(a)  # deep copy — safe for nested

# identity vs equality
x = [1, 2, 3]
y = [1, 2, 3]
x == y    # True  — same values
x is y    # False — different objects in memory

# small integers are cached (interned)
a = 256; b = 256; a is b  # True  (cached)
a = 257; b = 257; a is b  # False (not cached)`,
          examples: [
            { input: `a = [1,2,3]; b = a; b.append(4); print(a)`, output: `[1, 2, 3, 4]  # gotcha!` },
            { input: `a = [1,2,3]; b = a[:]; b.append(4); print(a)`, output: `[1, 2, 3]  # safe copy` },
          ],
          note: "mutable default arguments are a classic Python trap: def foo(x=[]) — that list is shared across ALL calls to foo. always use def foo(x=None): x = x or [] instead",
        },
      }),

      card("lists", {
        beginner: {
          explanation: "A list is an ordered collection of items. You can put anything in a list — numbers, text, even other lists. Lists are created with square brackets and items are separated by commas. Counting starts at 0, not 1.",
          code: `fruits = ["apple", "banana", "cherry"]

# get items — counting starts at 0!
print(fruits[0])    # apple (first)
print(fruits[1])    # banana (second)
print(fruits[-1])   # cherry (last — negative counts from end)

# add and remove
fruits.append("mango")      # add to end
fruits.insert(1, "grape")   # add at position 1
fruits.remove("banana")     # remove by value
fruits.pop()                # remove and return last item

# useful info
print(len(fruits))           # how many items
print("apple" in fruits)     # True or False`,
          examples: [
            { input: `nums = [10, 20, 30]\nprint(nums[0], nums[-1])`, output: `10 30` },
            { input: `nums = [1, 2, 3]\nnums.append(4)\nprint(nums)`, output: `[1, 2, 3, 4]` },
          ],
          note: "fruits[-1] is always the last item, fruits[-2] is second to last. this works for any list",
        },
        intermediate: {
          explanation: "Lists are Python's dynamic arrays. Key patterns: slicing to get sub-lists, list comprehensions to transform data, and knowing when to use sort() (changes in place) vs sorted() (makes a new list).",
          code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]

# slicing: list[start:stop:step]
nums[2:5]       # [4, 1, 5] — index 2,3,4
nums[:3]        # [3, 1, 4] — first 3
nums[::2]       # [3, 4, 5, 2] — every other
nums[::-1]      # reversed copy

# list comprehension — build a new list from an old one
squares = [x**2 for x in range(10)]
evens   = [x for x in nums if x % 2 == 0]
flat    = [x for row in matrix for x in row]

# sort
nums.sort()                          # changes nums in place
s = sorted(nums)                     # new sorted list, nums unchanged
sorted(nums, reverse=True)           # descending
sorted(words, key=len)               # sort strings by length
sorted(people, key=lambda p: p.age)  # sort objects by attribute`,
          examples: [
            { input: `[x**2 for x in range(6)]`, output: `[0, 1, 4, 9, 16, 25]` },
            { input: `sorted(["banana", "fig", "apple"], key=len)`, output: `["fig", "apple", "banana"]` },
          ],
        },
        advanced: {
          explanation: "Lists are O(1) for append and index access but O(n) for insert at beginning and search. For code where performance matters, know when to use collections.deque (fast front/back), array.array (typed, less memory), or numpy arrays instead.",
          code: `from collections import deque
import array, itertools

# deque — fast insertion/removal from BOTH ends
d = deque([1, 2, 3])
d.appendleft(0)   # O(1) — list.insert(0,x) is O(n)!
d.popleft()       # O(1) — list.pop(0) is O(n)!
d.rotate(1)       # rotate right by 1

# typed array — less memory than list for numbers
arr = array.array('i', [1, 2, 3, 4, 5])  # signed int array

# flatten nested lists
nested = [[1,2], [3,4], [5,6]]
flat = list(itertools.chain.from_iterable(nested))

# use as stack (LIFO) — both ops are O(1)
stack = []
stack.append(x)  # push
stack.pop()      # pop

# list as queue — DON'T, use deque instead
# list.pop(0) shifts every element = O(n)`,
          examples: [
            { input: `from collections import deque\nd = deque([1,2,3])\nd.appendleft(0)\nlist(d)`, output: `[0, 1, 2, 3]` },
            { input: `list(itertools.chain.from_iterable([[1,2],[3,4]]))`, output: `[1, 2, 3, 4]` },
          ],
          note: "list.insert(0, x) has to shift every element right — it's O(n). if you frequently add to the front, use deque which keeps a pointer to both ends",
        },
      }),

      card("dictionaries", {
        beginner: {
          explanation: "A dictionary stores pairs of things — a key and a value. Like a real dictionary where you look up a word (key) to find its definition (value). Keys must be unique. You look things up by key, not by position.",
          code: `person = {
    "name": "Alice",
    "age":  25,
    "city": "Boston"
}

# get a value by its key
print(person["name"])    # Alice

# safe get — won't crash if key missing
print(person.get("phone", "not found"))  # not found

# add or update
person["email"] = "alice@example.com"
person["age"] = 26       # update existing

# check if key exists
print("name" in person)  # True
print("phone" in person) # False

# remove a key
del person["city"]`,
          examples: [
            { input: `d = {"x": 10, "y": 20}\nprint(d["x"])`, output: `10` },
            { input: `d = {"a": 1}\nprint(d.get("b", 0))`, output: `0  # safe, no crash` },
          ],
          note: `person["phone"] crashes with KeyError if "phone" doesn't exist. person.get("phone") returns None instead. always use .get() when the key might not be there`,
        },
        intermediate: {
          explanation: "Dicts are hash maps — getting, setting, and deleting by key is O(1) on average. Since Python 3.7 dicts remember insertion order. The .items(), .keys(), .values() methods return live views, not copies.",
          code: `scores = {"alice": 95, "bob": 87, "carol": 92}

# iterate key-value pairs
for name, score in scores.items():
    print(f"{name}: {score}")

# dict comprehension — build dict from existing data
doubled  = {k: v * 2 for k, v in scores.items()}
passing  = {k: v for k, v in scores.items() if v >= 90}
by_score = {v: k for k, v in scores.items()}  # flip keys/values

# merge dicts
a = {"x": 1}; b = {"y": 2}
merged = {**a, **b}        # works everywhere
merged = a | b             # Python 3.9+ syntax

# get all keys / values / pairs
scores.keys()    # dict_keys(["alice", "bob", "carol"])
scores.values()  # dict_values([95, 87, 92])`,
          examples: [
            { input: `{k: v**2 for k, v in {"a":2,"b":3}.items()}`, output: `{"a": 4, "b": 9}` },
            { input: `{"a":1} | {"b":2}`, output: `{"a": 1, "b": 2}` },
          ],
        },
        advanced: {
          explanation: "collections.defaultdict avoids KeyError on missing keys by auto-creating a default. collections.Counter is a dict built for counting things. Use these instead of manually handling missing keys.",
          code: `from collections import defaultdict, Counter

# defaultdict — auto-creates missing keys
# useful for grouping or building adjacency lists
graph = defaultdict(list)
graph["a"].append("b")   # no KeyError even though "a" didn't exist
graph["a"].append("c")
# graph is now {"a": ["b", "c"]}

# group items by a property
words = ["apple", "ant", "banana", "bear", "cherry"]
by_letter = defaultdict(list)
for word in words:
    by_letter[word[0]].append(word)
# {"a": ["apple","ant"], "b": ["banana","bear"], "c": ["cherry"]}

# Counter — count occurrences of anything
items = ["apple","banana","apple","cherry","apple"]
c = Counter(items)
c["apple"]          # 3
c.most_common(2)    # [("apple",3), ("banana",1)]
c + Counter(["apple", "cherry"])  # add two counters`,
          examples: [
            { input: `from collections import Counter\nCounter("mississippi")`, output: `Counter({'s':4,'i':4,'p':2,'m':1})` },
            { input: `Counter([1,1,2,3,3,3]).most_common(1)`, output: `[(3, 3)]  # 3 appears 3 times` },
          ],
          note: "dict lookup is O(1) average but can degrade to O(n) with hash collisions. Python randomizes hash seeds at startup to prevent algorithmic complexity attacks",
        },
      }),

      card("functions", {
        beginner: {
          explanation: "A function is a reusable block of code. You define it once with def, give it a name, and call it whenever you need it. Functions can take inputs (called parameters) and return an output.",
          code: `# define a function
def greet(name):
    print("Hello, " + name + "!")

# call it as many times as you want
greet("Alice")   # Hello, Alice!
greet("Bob")     # Hello, Bob!

# function that gives back a value
def add(a, b):
    return a + b

result = add(3, 5)
print(result)    # 8

# optional parameters with defaults
def greet(name, loud=False):
    msg = "Hello, " + name
    if loud:
        print(msg.upper())
    else:
        print(msg)

greet("Alice")           # Hello, Alice
greet("Alice", loud=True) # HELLO, ALICE`,
          examples: [
            { input: `def square(x):\n    return x * x\nprint(square(7))`, output: `49` },
            { input: `def add(a, b=10):\n    return a + b\nprint(add(5))`, output: `15  # uses default b=10` },
          ],
          note: "a function without a return statement returns None. that's why doing x = print('hello') gives x the value None",
        },
        intermediate: {
          explanation: "Functions in Python are first-class objects — you can store them in variables, pass them to other functions, and return them. This unlocks powerful patterns like callbacks and higher-order functions.",
          code: `# *args — accept any number of positional arguments
def total(*nums):
    return sum(nums)
total(1, 2, 3, 4)   # 10

# **kwargs — accept any number of keyword arguments
def log(**info):
    for key, val in info.items():
        print(f"{key}: {val}")
log(user="alice", level="info")

# functions as values — store and pass around
double = lambda x: x * 2          # short anonymous function
ops = {"double": double, "square": lambda x: x**2}
ops["double"](5)    # 10

# map, filter — apply a function to a sequence
list(map(lambda x: x**2, [1,2,3,4]))    # [1,4,9,16]
list(filter(lambda x: x > 2, [1,2,3,4])) # [3,4]

# type hints
def divide(a: float, b: float) -> float | None:
    return a / b if b != 0 else None`,
          examples: [
            { input: `list(map(str.upper, ["hello", "world"]))`, output: `["HELLO", "WORLD"]` },
            { input: `sorted(["banana","fig","apple"], key=lambda w: len(w))`, output: `["fig","apple","banana"]` },
          ],
        },
        advanced: {
          explanation: "Decorators wrap a function to add behavior around it without changing its code. functools.wraps preserves the original function's name and docs. lru_cache adds memoization (caching results) automatically.",
          code: `import functools, time

# decorator — a function that wraps another function
def timer(fn):
    @functools.wraps(fn)    # keep fn's name and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        print(f"{fn.__name__} took {time.perf_counter()-start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

slow_add(2, 3)   # slow_add took 0.1001s  →  5

# lru_cache — automatically cache function results
@functools.lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

fib(100)  # instant — previously computed values are cached

# generator function — produces values one at a time
def countdown(n):
    while n > 0:
        yield n    # pause here, return n, resume next call
        n -= 1

list(countdown(5))  # [5, 4, 3, 2, 1]`,
          examples: [
            { input: `@functools.lru_cache(maxsize=None)\ndef fib(n): return n if n<2 else fib(n-1)+fib(n-2)\nfib(50)`, output: `12586269025  # instant with caching` },
          ],
          note: "without @functools.wraps, the decorated function loses its __name__ and __doc__. this breaks introspection tools and makes debugging harder",
        },
      }),

      card("classes", {
        beginner: {
          explanation: "A class is a blueprint for creating objects. You define what data an object holds (attributes) and what it can do (methods). Think of a class like a cookie cutter — the class is the cutter, each object you create is a cookie.",
          code: `class Dog:
    # __init__ runs automatically when you create a Dog
    # self refers to the specific dog being created
    def __init__(self, name, breed):
        self.name  = name    # store name on this dog
        self.breed = breed

    def bark(self):
        print(self.name + " says: Woof!")

    def describe(self):
        print(f"{self.name} is a {self.breed}")

# create dogs from the blueprint
rex   = Dog("Rex", "German Shepherd")
buddy = Dog("Buddy", "Golden Retriever")

rex.bark()       # Rex says: Woof!
buddy.describe() # Buddy is a Golden Retriever`,
          examples: [
            { input: `class Cat:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} says meow"\n\nCat("Luna").speak()`, output: `"Luna says meow"` },
          ],
          note: "self is always the first parameter — it represents the object itself. when you call rex.bark(), Python automatically passes rex as the self argument",
        },
        intermediate: {
          explanation: "Classes support inheritance (one class built on top of another), special dunder methods (__repr__, __eq__ etc) that control how objects behave with built-in operations, and class vs instance variables.",
          code: `class Animal:
    count = 0   # class variable — shared by ALL Animals

    def __init__(self, name: str):
        self.name = name        # instance variable — unique per animal
        Animal.count += 1

    def speak(self) -> str:
        raise NotImplementedError  # subclasses must implement this

    def __repr__(self):   # shown in debugger / repr()
        return f"{type(self).__name__}({self.name!r})"

    def __str__(self):    # shown by print()
        return self.name

class Dog(Animal):        # Dog inherits from Animal
    def speak(self):
        return f"{self.name}: woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: meow!"

animals = [Dog("Rex"), Cat("Luna"), Dog("Buddy")]
for a in animals:
    print(a.speak())      # polymorphism — right method called automatically`,
          examples: [
            { input: `class Point:\n    def __init__(self,x,y): self.x,self.y=x,y\n    def __add__(self,o): return Point(self.x+o.x,self.y+o.y)\n    def __repr__(self): return f"Point({self.x},{self.y})"\nPoint(1,2)+Point(3,4)`, output: `Point(4,6)` },
          ],
        },
        advanced: {
          explanation: "dataclasses automatically generate __init__, __repr__, __eq__ and more from your class fields. __slots__ restricts which attributes exist and saves memory for classes with many instances.",
          code: `from dataclasses import dataclass, field
from abc import ABC, abstractmethod

# dataclass — compiler generates boilerplate for you
@dataclass
class Point:
    x: float
    y: float
    label: str = ""
    tags: list = field(default_factory=list)  # mutable default

    def distance(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

p = Point(3.0, 4.0)
p.distance()             # 5.0
Point(3,4) == Point(3,4) # True — __eq__ auto-generated
repr(p)                  # Point(x=3.0, y=4.0, label='', tags=[])

# __slots__ — restrict attributes, save ~40% memory
class FastPoint:
    __slots__ = ("x", "y")  # ONLY x and y allowed
    def __init__(self, x, y):
        self.x, self.y = x, y
# FastPoint(1,2).z = 3  # AttributeError — z not in slots

# abstract base class — enforce interface on subclasses
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...
    @abstractmethod
    def perimeter(self) -> float: ...`,
          examples: [
            { input: `@dataclass\nclass Point:\n    x: float; y: float\nPoint(3,4) == Point(3,4)`, output: `True  # __eq__ generated automatically` },
          ],
          note: "__slots__ prevents adding arbitrary attributes to an instance and removes the per-instance __dict__, saving significant memory when you create millions of objects",
        },
      }),
    ]),

    section("errors", "errors + files", [
      card("error handling", {
        beginner: {
          explanation: "When something goes wrong in Python (dividing by zero, file not found, wrong type), it raises an error and stops. You can catch these errors with try/except so your program handles them gracefully instead of crashing.",
          code: `# try to run code, catch the error if it fails
try:
    result = 10 / 0
except ZeroDivisionError:
    print("can't divide by zero!")

# catch the error message too
try:
    number = int("not a number")
except ValueError as e:
    print("conversion failed:", e)

# finally — runs no matter what
try:
    risky_operation()
except Exception as e:
    print("something went wrong:", e)
finally:
    print("this always runs — good for cleanup")

# catch multiple error types
try:
    do_something()
except (ValueError, TypeError):
    print("wrong type or value")`,
          examples: [
            { input: `try:\n    x = int("abc")\nexcept ValueError:\n    x = 0\nprint(x)`, output: `0` },
          ],
          note: "avoid bare except: without specifying an error type — it catches EVERYTHING including keyboard interrupts, making it hard to stop the program",
        },
        intermediate: {
          explanation: "Python exceptions are classes arranged in a hierarchy. You can create your own by inheriting from Exception. Use 'raise from' to chain exceptions so the original cause isn't lost.",
          code: `# custom exception — inherit from Exception
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        self.amount  = amount
        self.balance = balance
        super().__init__(f"need {amount}, only have {balance}")

def withdraw(amount, balance):
    if amount > balance:
        raise InsufficientFundsError(amount, balance)
    return balance - amount

# exception chaining — preserve the original cause
try:
    int("abc")
except ValueError as e:
    raise RuntimeError("failed to parse config") from e

# else clause — runs only if no exception was raised
try:
    result = risky()
except ValueError:
    print("value error")
else:
    print("success:", result)  # only if no exception
finally:
    cleanup()`,
          examples: [
            { input: `try:\n    {}["missing"]\nexcept KeyError as e:\n    print(f"missing key: {e}")`, output: `missing key: 'missing'` },
          ],
        },
        advanced: {
          explanation: "Context managers (with statements) use __enter__ and __exit__ to guarantee cleanup code runs. contextlib makes writing them easy. Use contextlib.suppress to silently ignore specific errors.",
          code: `import contextlib, os

# context manager via decorator — simpler than a class
@contextlib.contextmanager
def managed_resource():
    resource = acquire()
    try:
        yield resource       # the code inside 'with' runs here
    finally:
        release(resource)    # always runs, even on exception

with managed_resource() as r:
    use(r)  # resource is cleaned up automatically after this block

# suppress — silently ignore specific exceptions
with contextlib.suppress(FileNotFoundError):
    os.remove("might_not_exist.txt")

# redirect output
with contextlib.redirect_stdout(open("log.txt", "w")):
    print("this goes to log.txt, not the terminal")

# ExceptionGroup — handle multiple exceptions at once (Python 3.11+)
try:
    raise ExceptionGroup("batch errors", [
        ValueError("bad value"),
        TypeError("wrong type"),
    ])
except* ValueError as eg:
    print("caught value errors:", eg.exceptions)`,
          examples: [
            { input: `import contextlib\nwith contextlib.suppress(ZeroDivisionError):\n    x = 1/0\nprint("no crash")`, output: `no crash` },
          ],
        },
      }),
    ]),
  ],
});
