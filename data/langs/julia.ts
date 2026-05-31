import { lang, section, card } from '../helpers';

export default lang({
  id: "julia", name: "Julia", ext: ".jl", year: 2012, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "Julia was designed to solve the 'two language problem' — scientists write prototypes in Python or MATLAB but then have to rewrite them in C++ for speed. Julia is as fast as C but as easy as Python. It's used in scientific computing, machine learning, and finance. Like Python, Julia is dynamically typed but it can run as fast as compiled languages.",
          code: `# hash is the comment character

# variables — no type needed, Julia infers it
name = "Alice"
age  = 25
pi_approx = 3.14159

# print
println("Hello, World!")
println("Hello, $name!")   # string interpolation with $
println("Age: $(age + 1)") # expressions in $()

# types
typeof(42)       # Int64
typeof(3.14)     # Float64
typeof("hello")  # String
typeof(true)     # Bool

# explicit types (optional)
x::Int64 = 42
y::Float64 = 3.14

# integers have ARBITRARY PRECISION
big_num = big(2)^200   # 2^200, exact!
factorial(big(100))    # exact 100!

# basic math
2^10          # 1024 (integer exponentiation)
sqrt(16.0)    # 4.0
abs(-42)      # 42
mod(17, 5)    # 2 (remainder)`,
          examples: [
            { input: `2^10`, output: `1024` },
            { input: `sqrt(2)`, output: `1.4142135623730951` },
            { input: `"hello" * 3`, output: `"hellohellohello"  # * = repeat for strings` },
          ],
          note: "Julia's * for string repetition and ^ for exponentiation are different from Python (* = repeat, ** = exponent). Julia uses Unicode operators too — you can write π instead of pi, ≤ instead of <=",
        },
        intermediate: {
          explanation: "Julia's multiple dispatch is its most important feature — the same function name can have many implementations for different argument types, and the most specific one is automatically called. This is what makes Julia extensible without modification.",
          code: `# multiple dispatch — define same function for different types
function area(r::Float64)    # for circles (radius)
    π * r^2
end

function area(w::Float64, h::Float64)   # for rectangles
    w * h
end

function area(a::Float64, b::Float64, c::Float64)  # for triangles
    s = (a + b + c) / 2
    sqrt(s * (s-a) * (s-b) * (s-c))
end

area(5.0)           # π * 25 ≈ 78.54 (circle)
area(4.0, 3.0)      # 12.0 (rectangle)
area(3.0, 4.0, 5.0) # 6.0 (triangle)

# broadcast — apply function element-wise with .
v = [1.0, 2.0, 3.0, 4.0, 5.0]
v .^ 2        # [1, 4, 9, 16, 25] — broadcast power
sqrt.(v)      # [1, 1.414, 1.732, 2, 2.236] — broadcast sqrt
v .* 2        # [2, 4, 6, 8, 10] — broadcast multiply

# array comprehension
squares = [x^2 for x in 1:10]
evens   = [x for x in 1:20 if x % 2 == 0]`,
          examples: [
            { input: `[1,2,3,4,5] .^ 2`, output: `5-element Vector{Int64}:\n 1\n 4\n 9\n 16\n 25` },
            { input: `sin.([0, π/2, π])`, output: `[0.0, 1.0, 0.0] (approx)` },
          ],
        },
        advanced: {
          explanation: "Julia's @simd, @inbounds, and @views macros let you write fast inner loops. The @benchmark macro from BenchmarkTools measures performance accurately. Julia compiles to native code via LLVM — you can see the assembly with @code_native.",
          code: `using BenchmarkTools

# @simd — hint for auto-vectorization
function dot_product(a::Vector{Float64}, b::Vector{Float64})
    result = 0.0
    @simd for i in eachindex(a)
        @inbounds result += a[i] * b[i]  # @inbounds = skip bounds check
    end
    result
end

# @views — avoid array copies when slicing
function process(data::Matrix{Float64})
    row = @view data[1, :]   # slice WITHOUT copy
    sum(row)                  # operates on original data
end

# benchmark
a = rand(1000)
b = rand(1000)
@benchmark dot_product($a, $b)   # $ = interpolate into benchmark

# see what Julia compiles to
@code_native dot_product(a, b)   # shows assembly
@code_llvm   dot_product(a, b)   # shows LLVM IR

# parametric types — generics
struct Point{T<:Number}
    x::T
    y::T
end

p1 = Point{Int}(3, 4)
p2 = Point{Float64}(3.0, 4.0)
# T is inferred: Point(3, 4) = Point{Int64}(3, 4)`,
          examples: [
            { input: `@benchmark sum(rand(1000))`, output: `BenchmarkTools.Trial: 10000 samples\n  mean time: 1.2 μs  (nanosecond precision)` },
          ],
          note: "@inbounds removes bounds checking on array access — it's faster but if you go out of bounds you get a segfault instead of a nice error. only use it in inner loops where you've verified the indices are correct",
        },
      }),
    ]),
  ],
});
