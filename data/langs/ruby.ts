import { lang, section, card } from '../helpers';

export default lang({
  id: "ruby", name: "Ruby", ext: ".rb", year: 1995, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + syntax", {
        beginner: {
          explanation: "Ruby is designed to be pleasant to read and write. Unlike most languages, you don't need semicolons or parentheses in most cases. Everything is an object — even numbers and nil. Ruby has different variable types based on their prefix.",
          code: `# local variable — starts lowercase or _
name = "Alice"
age  = 25

# puts prints with newline, print doesn't
puts "Hello, #{name}!"   # Hello, Alice! — string interpolation
puts "You are #{age} years old"
puts 1 + 2               # 3

# everything is an expression
result = if age > 18
           "adult"
         else
           "minor"
         end
puts result  # adult

# methods without () when unambiguous
puts "hello".upcase      # HELLO
puts "hello".length      # 5
puts 42.to_s             # "42" (to_s = to string)
puts "42".to_i           # 42   (to_i = to integer)

# nil = null
nothing = nil
puts nothing.nil?        # true (? is part of the method name!)`,
          examples: [
            { input: `puts "hello".reverse`, output: `olleh` },
            { input: `puts 42.even?`, output: `true` },
          ],
          note: "in Ruby, method names can end in ? (returns boolean) or ! (modifies in place or does something dangerous). sort returns a new array, sort! modifies the original",
        },
        intermediate: {
          explanation: "Ruby has four kinds of variables: local (lowercase), instance (@name, belongs to an object), class (@@name, shared by all instances), and global ($name, everywhere). Constants are UPPERCASE.",
          code: `# instance variable — @name (belongs to this object)
class Dog
    def initialize(name, age)
        @name = name   # @ makes it instance variable
        @age  = age
    end

    def bark
        puts "#{@name} says: Woof!"
    end

    # attr_accessor generates getter AND setter methods
    # attr_reader — getter only
    # attr_writer — setter only
    attr_accessor :name, :age
end

rex = Dog.new("Rex", 3)
rex.bark         # Rex says: Woof!
rex.name         # "Rex" — getter
rex.age = 4      # setter

# class variable — @@name (shared by ALL instances)
class Counter
    @@count = 0
    def initialize
        @@count += 1
    end
    def self.count   # class method (like static)
        @@count
    end
end

Counter.new; Counter.new
Counter.count  # 2`,
          examples: [
            { input: `class Cat\n  attr_accessor :name\n  def initialize(n) = @name = n\nend\nc = Cat.new("Luna")\nc.name`, output: `"Luna"` },
          ],
        },
        advanced: {
          explanation: "Ruby's open classes let you add methods to ANY class, even built-in ones. Modules are mixins that add methods to classes. method_missing intercepts calls to undefined methods.",
          code: `# open class — add methods to existing classes
class Integer
    def factorial
        return 1 if self <= 1
        self * (self - 1).factorial
    end

    def times_do(&block)
        i = 0
        while i < self
            block.call(i)
            i += 1
        end
    end
end

5.factorial   # 120 — added to Integer!

# module as mixin — add behavior to classes
module Serializable
    def to_json
        vars = instance_variables.map do |var|
            key = var.to_s.delete('@')
            "\\\"#{key}\\\": \\\"#{instance_variable_get(var)}\\\""
        end
        "{ #{vars.join(', ')} }"
    end
end

class User
    include Serializable   # mix in the module
    attr_reader :name, :email
    def initialize(name, email)
        @name  = name
        @email = email
    end
end

User.new("Alice", "a@b.com").to_json
# { "name": "Alice", "email": "a@b.com" }

# method_missing — intercept unknown method calls
class DynamicProxy
    def method_missing(name, *args)
        puts "called: #{name} with #{args}"
    end
    def respond_to_missing?(name, include_private = false)
        true
    end
end`,
          examples: [
            { input: `5.factorial`, output: `120  // added to Integer class!` },
          ],
          note: "open classes (monkey patching) is powerful but dangerous — avoid modifying built-in classes in libraries, it can cause conflicts with other code. use refinements instead for scoped modifications",
        },
      }),

      card("blocks + iterators", {
        beginner: {
          explanation: "Blocks are chunks of code you pass to a method, like a callback. They go in curly braces {} or do...end. Ruby's array methods all take blocks. This is one of Ruby's most distinctive features.",
          code: `numbers = [1, 2, 3, 4, 5]

# each — iterate over elements
numbers.each do |n|
    puts n * 2
end

# or with curly braces (convention: {} for one-liners, do/end for multi-line)
numbers.each { |n| puts n }

# map — transform each element into new array
doubled = numbers.map { |n| n * 2 }    # [2, 4, 6, 8, 10]

# select — keep matching elements (like filter)
evens = numbers.select { |n| n.even? } # [2, 4]

# reject — opposite of select
odds = numbers.reject { |n| n.even? }  # [1, 3, 5]

# reduce — fold to single value
sum = numbers.reduce(0) { |acc, n| acc + n }  # 15
# or shorter:
sum = numbers.reduce(:+)  # 15

# find — first matching element
first_big = numbers.find { |n| n > 3 }  # 4`,
          examples: [
            { input: `[1,2,3,4,5].select(&:odd?).map { |n| n ** 2 }`, output: `[1, 9, 25]` },
            { input: `["hello","world"].map(&:upcase)`, output: `["HELLO", "WORLD"]` },
          ],
          note: "&:method_name is shorthand for { |x| x.method_name }. [1,2,3].map(&:to_s) is the same as [1,2,3].map { |n| n.to_s }. very common in Ruby",
        },
        intermediate: {
          explanation: "Ruby methods can yield to a block with the yield keyword. Proc and Lambda store blocks as objects. The difference: lambdas check argument count and return from the lambda, procs don't.",
          code: `# define a method that takes a block
def measure
    start = Time.now
    yield               # run whatever block was passed
    puts "took: #{Time.now - start}s"
end

measure { sleep(0.1) }   # took: 0.101s

# block_given? — check if block was passed
def maybe_yield
    if block_given?
        yield
    else
        puts "no block"
    end
end

# explicitly capture block with &
def store_block(&block)
    @callback = block
end
store_block { puts "called!" }
@callback.call   # called!

# lambda — like a function object
double = lambda { |n| n * 2 }
double.call(5)   # 10
double.(5)       # 10 — shorthand
double = ->(n) { n * 2 }  # stabby lambda syntax

# proc
triple = Proc.new { |n| n * 3 }
triple.call(5)   # 15`,
          examples: [
            { input: `square = ->(n) { n * n }\n[1,2,3,4].map(&square)`, output: `[1, 4, 9, 16]` },
          ],
        },
        advanced: {
          explanation: "Enumerator::Lazy creates lazy enumerators — they compute values on demand instead of all at once. This lets you work with infinite sequences. Fibers enable cooperative multitasking.",
          code: `# lazy enumerator — compute on demand
naturals = (1..Float::INFINITY).lazy
first_five_squares = naturals.map { |n| n * n }.first(5)
# [1, 4, 9, 16, 25] — computed without generating infinity numbers

# chain lazy operations
result = (1..Float::INFINITY)
    .lazy
    .select { |n| n.odd? }
    .map    { |n| n ** 2 }
    .first(5)
# [1, 9, 25, 49, 81]

# Fiber — coroutine (like generator)
fib = Fiber.new do
    a, b = 0, 1
    loop do
        Fiber.yield a   # pause here and return a
        a, b = b, a + b
    end
end

10.times { print "#{fib.resume} " }
# 0 1 1 2 3 5 8 13 21 34

# Enumerator — custom iterator
counter = Enumerator.new do |yielder|
    i = 0
    loop { yielder << i; i += 1 }
end

counter.take(5)   # [0, 1, 2, 3, 4]`,
          examples: [
            { input: `(1..Float::INFINITY).lazy.select(&:odd?).first(5)`, output: `[1, 3, 5, 7, 9]` },
          ],
          note: "without lazy, (1..Float::INFINITY).select would try to compute an infinite array and hang forever. lazy makes the chain evaluate one element at a time until first() stops it",
        },
      }),
    ]),
  ],
});
