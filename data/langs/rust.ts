import { lang, section, card } from '../helpers';

export default lang({
  id: "rust", name: "Rust", ext: ".rs", year: 2010, common: true,
  sections: [
    section("basics", "basics", [
      card("ownership — the big idea", {
        beginner: {
          explanation: "Rust's most unique feature is ownership. Every value has exactly ONE owner. When the owner goes away, the value is automatically cleaned up — no garbage collector needed, no manual free(). This prevents memory bugs at compile time. If you try to break the rules, the code simply won't compile.",
          code: `// every value has ONE owner
let s1 = String::from("hello");
let s2 = s1;    // ownership MOVED from s1 to s2
                // s1 is no longer valid!

// println!("{}", s1);  // ERROR: value borrowed after move

// clone — explicit deep copy (both s2 and s3 are valid)
let s2 = String::from("hello");
let s3 = s2.clone();   // s2 still works
println!("{} {}", s2, s3);  // hello hello

// types that are "copy" (simple values) are automatically copied
let x = 5;
let y = x;    // x is COPIED (not moved) because int is Copy
println!("{} {}", x, y);  // 5 5 — both work`,
          examples: [
            { input: `let s = String::from("hi");\nlet t = s;\nprintln!("{}", s);`, output: `ERROR: value borrowed after move` },
            { input: `let x = 42;\nlet y = x;\nprintln!("{} {}", x, y);`, output: `42 42  // integers are Copy` },
          ],
          note: "the Copy trait means a type is cheap to copy (like int, float, bool). String is NOT Copy because it allocates memory on the heap — moving avoids duplicating that allocation",
        },
        intermediate: {
          explanation: "Borrowing lets you use a value without taking ownership. & creates a shared reference (read-only, many allowed). &mut creates a mutable reference (read-write, only one allowed at a time). The borrow checker enforces this at compile time.",
          code: `// borrowing — use without taking ownership
fn length(s: &String) -> usize {
    s.len()   // s is borrowed, not owned
}

let s = String::from("hello");
let len = length(&s);   // & means "borrow"
println!("{} has length {}", s, len);  // s still valid!

// mutable borrow — one at a time
fn push_world(s: &mut String) {
    s.push_str(", world");
}

let mut s = String::from("hello");
push_world(&mut s);
println!("{}", s);  // hello, world

// THE RULE: either ONE &mut reference, or any number of & references
// never both at the same time — this prevents data races
let s = String::from("hello");
let r1 = &s;    // ok
let r2 = &s;    // ok — multiple shared borrows allowed
// let r3 = &mut s;  // ERROR — can't have &mut while & exists`,
          examples: [
            { input: `fn add_one(n: &mut i32) { *n += 1; }\nlet mut x = 5;\nadd_one(&mut x);\nprintln!("{}", x);`, output: `6` },
          ],
          note: "the borrow checker rule: ONE writer OR many readers, never both. this is the same rule databases use for concurrent access — Rust enforces it at compile time for all memory",
        },
        advanced: {
          explanation: "Lifetimes tell the compiler how long a reference is valid. Most of the time Rust infers them. You only need to write them explicitly when the compiler can't figure it out — usually when a function returns a reference.",
          code: `// lifetime annotation — 'a means "this reference lives at least as long as 'a"
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() >= s2.len() { s1 } else { s2 }
    // return value lives as long as the shorter of s1 or s2
}

// struct holding a reference needs lifetime
struct Excerpt<'a> {
    text: &'a str,   // text must outlive the Excerpt
}

let text = String::from("first sentence. second.");
let exc = Excerpt {
    text: text.split('.').next().unwrap()
};
// exc can't outlive text

// static lifetime — lives for the entire program
let s: &'static str = "I live forever";  // string literals are 'static

// lifetime elision — Rust infers common patterns
fn first_word(s: &str) -> &str {  // Rust fills in 'a for you
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' { return &s[..i]; }
    }
    &s[..]
}`,
          examples: [
            { input: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {\n    if a.len()>=b.len(){a}else{b}\n}\nprintln!("{}", longest("hello","hi"));`, output: `hello` },
          ],
          note: "most Rust code doesn't need explicit lifetime annotations because of lifetime elision rules. if the compiler asks for lifetimes, it's telling you about a real potential dangling reference",
        },
      }),

      card("enums + pattern matching", {
        beginner: {
          explanation: "Enums in Rust are much more powerful than in other languages — each variant can hold different data. Option<T> replaces null (Some(value) or None). Result<T,E> replaces exceptions (Ok(value) or Err(error)).",
          code: `// Option — a value that might not exist (replaces null)
let maybe: Option<i32> = Some(42);
let nothing: Option<i32> = None;

// safely get the value
match maybe {
    Some(n) => println!("got: {}", n),
    None    => println!("nothing"),
}

// shorthand
maybe.unwrap_or(0)          // 42 (or 0 if None)
maybe.map(|n| n * 2)        // Some(84)

// Result — success or failure (replaces exceptions)
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}

match divide(10.0, 2.0) {
    Ok(result)  => println!("result: {}", result),
    Err(e)      => println!("error: {}", e),
}

// ? operator — propagate errors up
fn run() -> Result<(), String> {
    let result = divide(10.0, 0.0)?;  // returns Err immediately if Error
    println!("{}", result);
    Ok(())
}`,
          examples: [
            { input: `Some(42).unwrap_or(0)`, output: `42` },
            { input: `None::<i32>.unwrap_or(0)`, output: `0` },
            { input: `"abc".parse::<i32>()`, output: `Err(invalid digit found in string)` },
          ],
          note: "the ? operator is shorthand for 'if this is an Err, return it immediately'. it makes error propagation clean without lots of match statements",
        },
        intermediate: {
          explanation: "Pattern matching in Rust is exhaustive — you must handle every case. The compiler tells you if you forgot one. Patterns can destructure complex types, bind variables, and have guards.",
          code: `// enum with data
enum Shape {
    Circle(f64),
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),  // three sides
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r)                         => std::f64::consts::PI * r * r,
        Shape::Rectangle { width: w, height: h } => w * h,
        Shape::Triangle(a, b, c)                 => {
            let s = (a + b + c) / 2.0;
            (s * (s-a) * (s-b) * (s-c)).sqrt()  // Heron's formula
        }
    }
    // compiler ERROR if any variant is missing from match
}

// if let — match one pattern
if let Shape::Circle(r) = shape {
    println!("it's a circle with radius {}", r);
}

// while let — keep looping while pattern matches
let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{}", top);  // 3, 2, 1
}`,
          examples: [
            { input: `let s = Shape::Circle(5.0);\narea(&s)`, output: `78.539...` },
          ],
        },
        advanced: {
          explanation: "Traits are Rust's interfaces. You can implement traits for any type — even types from other crates. impl Trait syntax in function signatures avoids naming types explicitly.",
          code: `// trait — defines shared behavior
trait Serialize {
    fn to_json(&self) -> String;
    fn to_bytes(&self) -> Vec<u8> {
        self.to_json().into_bytes()  // default implementation
    }
}

struct Point { x: f64, y: f64 }
impl Serialize for Point {
    fn to_json(&self) -> String {
        format!(r#"{{"x":{},"y":{}}}"#, self.x, self.y)
    }
}

// impl Trait — anonymous type that implements trait
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n   // closure that captures n
}
let add5 = make_adder(5);
add5(3)   // 8

// dyn Trait — dynamic dispatch (runtime polymorphism)
fn process(items: &[Box<dyn Serialize>]) {
    for item in items {
        println!("{}", item.to_json());
    }
}

// trait bounds — constrain generics
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest { largest = item; }
    }
    largest
}`,
          examples: [
            { input: `let p = Point { x: 3.0, y: 4.0 };\np.to_json()`, output: `{"x":3,"y":4}` },
          ],
          note: "impl Trait (static dispatch, faster) vs dyn Trait (dynamic dispatch, flexible). use impl Trait when the concrete type is known at compile time, dyn Trait when you need a collection of different types",
        },
      }),
    ]),
  ],
});
