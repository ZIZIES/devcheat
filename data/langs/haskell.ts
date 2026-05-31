import { lang, section, card } from '../helpers';

export default lang({
  id: "haskell", name: "Haskell", ext: ".hs", year: 1990, common: false,
  sections: [
    section("basics", "basics", [
      card("pure functions + types", {
        beginner: {
          explanation: "Haskell is a purely functional language — functions have no side effects and always return the same output for the same input. There are no variables that change, no loops, and no null. Instead you transform data through functions. It's very different from Python or JavaScript but the ideas in Haskell influence every modern language.",
          code: `-- double dashes are comments in Haskell

-- function definition: name arguments = expression
-- type signature (optional but strongly recommended)
add :: Int -> Int -> Int    -- takes two Ints, returns Int
add a b = a + b

square :: Int -> Int
square x = x * x

-- no return keyword — the expression IS the return value
greet :: String -> String
greet name = "Hello, " ++ name ++ "!"   -- ++ = string concat

-- call functions (no parentheses for simple args)
add 3 5        -- 8
square 7       -- 49
greet "Alice"  -- "Hello, Alice!"

-- lists — homogeneous, linked list
nums = [1, 2, 3, 4, 5]
head nums   -- 1 (first element)
tail nums   -- [2,3,4,5] (everything but first)
length nums -- 5
sum nums    -- 15`,
          examples: [
            { input: `add 3 5`, output: `8` },
            { input: `sum [1..10]`, output: `55` },
            { input: `filter even [1..10]`, output: `[2,4,6,8,10]` },
          ],
          note: "in Haskell, if a function seems to take multiple arguments, it's actually a chain of single-argument functions. add 3 5 is really (add 3) 5 — add 3 returns a new function that adds 3 to its argument. this is called currying",
        },
        intermediate: {
          explanation: "Haskell's type system is incredibly powerful. Algebraic data types (ADTs) are like discriminated unions. The Maybe type replaces null. Typeclasses define behavior that many types can share.",
          code: `-- algebraic data type — like discriminated union
data Shape
    = Circle    Double
    | Rectangle Double Double
    | Triangle  Double Double Double

-- function with pattern matching
area :: Shape -> Double
area (Circle r)         = pi * r * r
area (Rectangle w h)    = w * h
area (Triangle a b c)   = let s = (a + b + c) / 2
                           in sqrt(s*(s-a)*(s-b)*(s-c))

-- Maybe — replaces null
safeDivide :: Double -> Double -> Maybe Double
safeDivide _ 0 = Nothing    -- _ means "don't care about this value"
safeDivide a b = Just (a / b)

safeDivide 10 2   -- Just 5.0
safeDivide 10 0   -- Nothing

-- typeclass — like interface
class Describable a where
    describe :: a -> String

instance Describable Shape where
    describe (Circle r)      = "Circle with radius " ++ show r
    describe (Rectangle w h) = "Rectangle " ++ show w ++ "x" ++ show h
    describe (Triangle _ _ _)= "A triangle"`,
          examples: [
            { input: `area (Circle 5.0)`, output: `78.539...` },
            { input: `safeDivide 10 2`, output: `Just 5.0` },
            { input: `safeDivide 10 0`, output: `Nothing` },
          ],
        },
        advanced: {
          explanation: "Monads are a design pattern for chaining operations that might fail or have effects. IO monad handles input/output. The do notation makes monadic code look sequential even though nothing is really sequential.",
          code: `-- IO monad — all side effects wrapped in IO
main :: IO ()
main = do
    putStrLn "What's your name?"   -- print
    name <- getLine                -- read input, bind to name
    putStrLn ("Hello, " ++ name ++ "!")

-- do notation is syntactic sugar for >>= (bind)
-- equivalent without do:
main2 :: IO ()
main2 =
    putStrLn "What's your name?" >>
    getLine >>= \name ->
    putStrLn ("Hello, " ++ name ++ "!")

-- function composition with .
-- (f . g) x = f (g x)
doubleAndAdd1 :: Int -> Int
doubleAndAdd1 = (+1) . (*2)    -- first *2, then +1
doubleAndAdd1 5    -- 11

-- point-free style — define functions without mentioning arguments
sumSquares :: [Int] -> Int
sumSquares = sum . map (^2)   -- no argument mentioned
sumSquares [1,2,3,4]   -- 30

-- lazy evaluation — Haskell only computes what's needed
naturals :: [Int]
naturals = [1..]              -- infinite list! (not computed yet)
take 5 naturals               -- [1,2,3,4,5] (only computes 5 elements)`,
          examples: [
            { input: `take 5 (filter even [1..])`, output: `[2,4,6,8,10]  (from infinite list)` },
            { input: `(sum . map (^2)) [1..5]`, output: `55` },
          ],
          note: "Haskell is lazy — it never computes a value until it's actually needed. this allows infinite data structures and can save computation, but makes reasoning about performance tricky",
        },
      }),
    ]),
  ],
});
