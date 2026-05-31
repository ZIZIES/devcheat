import { lang, section, card } from '../helpers';

export default lang({
  id: "fsharp", name: "F#", ext: ".fs", year: 2005, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "F# is a functional-first language on .NET (so it works alongside C#). The biggest difference from C# or Python: in F# values are immutable by default — once you set x = 5, x stays 5. You can't accidentally change it later. F# uses indentation like Python, not curly braces.",
          code: `// let binds a name to a value — immutable by default
let name = "Alice"
let age  = 25
let pi   = 3.14159

// F# infers types — you rarely need to write them
// but you can:
let score : int = 100

// to allow mutation, use mutable
let mutable counter = 0
counter <- counter + 1    // <- is the assignment operator for mutables
// counter = counter + 1  // this would be a comparison, not assignment!

// print
printfn "Hello, %s!" name        // %s = string, like printf
printfn "Age: %d" age            // %d = integer
printfn "Pi: %.2f" pi            // %.2f = 2 decimal places

// string interpolation (F# 5+)
printfn $"Hello, {name}! You are {age} years old."`,
          examples: [
            { input: `let x = 5\nlet y = x + 3\nprintfn "%d" y`, output: `8` },
            { input: `let s = "hello"\nprintfn "%d" s.Length`, output: `5` },
          ],
          note: "in F#, = means equality comparison, not assignment. <- is used for assignment to mutable values. let x = 5 is a binding (like a definition), not an assignment",
        },
        intermediate: {
          explanation: "F# has discriminated unions — a type that can be one of several different cases, each with different data. This is like a supercharged enum. Pattern matching handles all the cases exhaustively.",
          code: `// discriminated union — type that is one of several cases
type Shape =
    | Circle    of float           // has a radius
    | Rectangle of float * float   // has width AND height
    | Triangle  of float * float * float

// pattern matching — handles every case
let area shape =
    match shape with
    | Circle r          -> System.Math.PI * r * r
    | Rectangle(w, h)   -> w * h
    | Triangle(a, b, c) ->
        let s = (a + b + c) / 2.0
        sqrt(s * (s-a) * (s-b) * (s-c))  // Heron's formula

// compiler error if you forget a case!

// Option type — like nullable but type-safe
let safeDivide a b =
    if b = 0.0 then None    // nothing to return
    else Some(a / b)         // wrapped value

let result = safeDivide 10.0 2.0
match result with
| Some v -> printfn "Result: %f" v
| None   -> printfn "Division by zero"`,
          examples: [
            { input: `area (Circle 5.0)`, output: `78.539...` },
            { input: `area (Rectangle(4.0, 3.0))`, output: `12.0` },
            { input: `safeDivide 10.0 0.0`, output: `None` },
          ],
          note: "discriminated unions + pattern matching is the core of functional programming. the compiler tells you if you forgot to handle a case — you can't accidentally miss one like in a switch statement",
        },
        advanced: {
          explanation: "F# computation expressions (like async {} and seq {}) are syntactic sugar for monadic operations. They let you write async or lazy code that looks like regular imperative code.",
          code: `// async workflows — like async/await but more powerful
open System.Net.Http

let fetchAsync (url: string) = async {
    use client = new HttpClient()
    let! response = client.GetStringAsync(url) |> Async.AwaitTask
    return response.Length
}

// run multiple async operations in parallel
let fetchAll urls = async {
    let! results =
        urls
        |> List.map fetchAsync
        |> Async.Parallel   // run all at the same time
    return results
}

// sequence expressions — lazy infinite sequences
let naturals =
    seq {
        let mutable i = 0
        while true do
            yield i
            i <- i + 1
    }

naturals |> Seq.take 5 |> Seq.toList  // [0;1;2;3;4]

// computation expressions for custom effects
// Result computation expression (Railway Oriented Programming)
let validateAge age =
    if age < 0  then Error "age can't be negative"
    elif age > 150 then Error "age too large"
    else Ok age`,
          examples: [
            { input: `seq { 1..5 } |> Seq.map (fun x -> x*x) |> Seq.toList`, output: `[1; 4; 9; 16; 25]` },
          ],
          note: "the pipe operator |> passes the result of the left expression as the last argument to the right function. it's like method chaining but works with any function. very common in F#",
        },
      }),

      card("functions + pipelines", {
        beginner: {
          explanation: "Functions in F# are first-class values. The pipe operator |> chains operations together so you can read left-to-right instead of inside-out. This is one of F#'s most loved features.",
          code: `// function definition
let add a b = a + b
let square x = x * x
let isEven n = n % 2 = 0

// call functions
add 3 5      // 8 — no parentheses needed
square 7     // 49

// pipe operator |> — chain operations
// instead of: square(add 3 5) — hard to read inside-out
// write:
3 |> add 5 |> square   // 64 — reads left to right!

// with lists
[1; 2; 3; 4; 5; 6]     // F# list uses ; separator
|> List.filter isEven   // [2; 4; 6]
|> List.map square      // [4; 16; 36]
|> List.sum             // 56

// lambda — fun keyword
let doubled = List.map (fun x -> x * 2) [1;2;3;4]  // [2;4;6;8]

// partial application — fix some arguments
let add10 = add 10    // add10 is now a function that adds 10
add10 5               // 15
add10 20              // 30`,
          examples: [
            { input: `[1..10] |> List.filter (fun x -> x%2=0) |> List.sum`, output: `30  (2+4+6+8+10)` },
            { input: `"hello" |> String.length`, output: `5` },
          ],
          note: "partial application means calling a function with fewer arguments than it needs — you get back a new function waiting for the rest. add 10 returns a function that adds 10 to its argument",
        },
        intermediate: {
          explanation: "F# records are like C# records — immutable data types with automatic equality. The 'with' keyword creates a copy with some fields changed. This is the standard way to 'update' immutable data.",
          code: `// record type — immutable data with named fields
type Person = {
    Name  : string
    Age   : int
    Email : string
}

let alice = { Name = "Alice"; Age = 25; Email = "a@b.com" }

// access fields
alice.Name    // "Alice"

// 'with' — create a copy with changes (original unchanged)
let olderAlice = { alice with Age = 26 }
alice.Age       // still 25
olderAlice.Age  // 26

// pattern matching on records
let greet person =
    match person with
    | { Name = "Alice" } -> "Hey Alice!"
    | { Age = age } when age < 18 -> "Hey kid"
    | { Name = name } -> $"Hello, {name}"

// record update in pipeline
let birthday person = { person with Age = person.Age + 1 }

alice
|> birthday
|> birthday    // age = 27 now`,
          examples: [
            { input: `let p = { Name="Alice"; Age=25; Email="a@b.com" }\nlet p2 = { p with Age = 26 }\np.Age, p2.Age`, output: `25, 26` },
          ],
        },
      }),
    ]),
  ],
});
