import { lang, section, card } from '../helpers';

export default lang({
  id: "ocaml", name: "OCaml", ext: ".ml", year: 1996, common: false,
  sections: [
    section("basics", "basics", [
      card("types + functions", {
        beginner: {
          explanation: "OCaml is a functional language from France that influenced Rust, F#, and Haskell. It's used at Jane Street (a trading firm that uses it for billions in trades daily), Facebook (parts of Hack and Flow), and in academic research. OCaml has an extremely powerful type system that catches bugs at compile time while remaining fast.",
          code: `(* OCaml uses (* *) for comments *)

(* let binds a name to a value *)
let name = "Alice"
let age  = 25
let pi   = 3.14159

(* function definition — just let with arguments *)
let add a b = a + b
let square x = x * x
let greet name = "Hello, " ^ name ^ "!"  (* ^ = string concat *)

(* call functions — no parentheses for simple args *)
let result = add 3 5        (* 8 *)
let greeting = greet "Alice" (* "Hello, Alice!" *)

(* print *)
print_string (greet "Alice");
print_newline ()

(* or use Printf *)
Printf.printf "Name: %s, Age: %d\n" name age

(* type inference — OCaml figures out types *)
(* but you can annotate: *)
let add (a : int) (b : int) : int = a + b`,
          examples: [
            { input: `add 3 5`, output: `- : int = 8  (* : int = is the type)` },
            { input: `String.length "hello"`, output: `- : int = 5` },
          ],
          note: "OCaml's type inference is one of the best — it figures out the types of everything without you writing them. but the error messages can be cryptic. when confused, add type annotations to narrow down where the mismatch is",
        },
        intermediate: {
          explanation: "OCaml's variant types (algebraic data types) and pattern matching are extremely expressive. The option type replaces null. Everything is an expression that returns a value.",
          code: `(* variant type — like discriminated union *)
type shape =
    | Circle    of float
    | Rectangle of float * float   (* tuple of two floats *)
    | Triangle  of float * float * float

(* pattern matching — must cover all cases *)
let area = function
    | Circle r         -> Float.pi *. r *. r   (* *. = float multiply *)
    | Rectangle (w, h) -> w *. h
    | Triangle (a,b,c) ->
        let s = (a +. b +. c) /. 2.0 in
        sqrt (s *. (s-.a) *. (s-.b) *. (s-.c))

(* option type — replaces null *)
let safe_divide a b =
    if b = 0.0 then None
    else Some (a /. b)

(* using option with pattern match *)
match safe_divide 10.0 2.0 with
| Some v -> Printf.printf "Result: %f\n" v
| None   -> print_string "Division by zero\n"

(* let expressions — scope bindings *)
let result =
    let x = 10 in
    let y = 20 in
    x + y   (* result = 30, x and y not visible outside *)`,
          examples: [
            { input: `area (Circle 5.0)`, output: `- : float = 78.5398...` },
            { input: `safe_divide 10.0 0.0`, output: `- : float option = None` },
          ],
        },
        advanced: {
          explanation: "OCaml's module system is more powerful than most languages. Functors are modules parameterized by other modules — like generics but for entire module structures. First-class modules can be passed around as values.",
          code: `(* module — namespace + abstraction *)
module StringSet = Set.Make(String)

let words = StringSet.of_list ["apple"; "banana"; "apple"; "cherry"]
let count = StringSet.cardinal words   (* 3 — duplicates removed *)

(* functor — module parameterized by another module *)
module type Comparable = sig
    type t
    val compare : t -> t -> int
end

module MakeSet(Ord : Comparable) = struct
    (* implementation using Ord.compare *)
    type elt = Ord.t
    type t = Empty | Node of t * elt * t
    (* ... tree operations using Ord.compare ... *)
end

(* first-class modules *)
let make_set (type a) (cmp : a -> a -> int) =
    let module M = struct
        type t = a
        let compare = cmp
    end in
    (module MakeSet(M) : SET with type elt = a)

(* GADTs — generalized algebraic data types *)
type _ expr =
    | Int  : int  -> int  expr
    | Bool : bool -> bool expr
    | Add  : int expr * int expr -> int expr
    | If   : bool expr * 'a expr * 'a expr -> 'a expr

let rec eval : type a. a expr -> a = function
    | Int  n     -> n
    | Bool b     -> b
    | Add (a, b) -> eval a + eval b
    | If (c,t,f) -> if eval c then eval t else eval f`,
          examples: [
            { input: `eval (Add (Int 3, Int 4))`, output: `- : int = 7` },
            { input: `eval (If (Bool true, Int 1, Int 2))`, output: `- : int = 1` },
          ],
          note: "GADTs (Generalized Algebraic Data Types) let you encode more precise type information in the type system — like expressing that an 'int expr' can only evaluate to an int. Rust's type system was heavily influenced by OCaml GADTs",
        },
      }),
    ]),
  ],
});
