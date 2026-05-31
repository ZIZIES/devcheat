import { lang, section, card } from '../helpers';

export default lang({
  id: "swift", name: "Swift", ext: ".swift", year: 2014, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + optionals", {
        beginner: {
          explanation: "Swift uses let for constants (values that never change) and var for variables (values that can change). The most important concept in Swift is optionals — a way to say 'this might have a value or might be empty'. This prevents the most common crash in iOS apps.",
          code: `// let = constant, var = variable
let name = "Alice"     // can never change
var age  = 25          // can change
age = 26               // ok
// name = "Bob"        // ERROR

// type annotation (optional — Swift usually infers the type)
let score: Int    = 100
let pi:    Double = 3.14159
let flag:  Bool   = true

// optional — might have a value or might be nil
var email: String? = nil      // can be nil
var city:  String  = "Boston" // can NEVER be nil

// string interpolation
print("Hello, \\(name)! You are \\(age) years old.")

// safely unwrap an optional with if let
if let e = email {
    print("Email: \\(e)")  // only runs if email is not nil
} else {
    print("No email")      // runs since email is nil
}`,
          examples: [
            { input: `let s: String? = "hello"\nprint(s?.count ?? 0)`, output: `5` },
            { input: `let s: String? = nil\nprint(s?.count ?? 0)`, output: `0` },
          ],
          note: "optionals are one of Swift's best features — they force you to handle the 'what if there's no value' case explicitly. the ? means 'might be nil'. without ?, the value is guaranteed non-nil",
        },
        intermediate: {
          explanation: "guard let is the preferred way to unwrap optionals when you want to exit early if something is nil. It keeps the happy path un-indented. The ?? operator provides a default value for optionals.",
          code: `// guard let — exit early if nil, non-nil after guard
func processUser(_ user: User?) {
    guard let user = user else {
        print("no user")
        return   // must exit here
    }
    // user is guaranteed non-nil past this point
    print(user.name)
}

// optional chaining — safely access properties
struct Address { var city: String }
struct User    { var address: Address? }

let user: User? = nil
let city = user?.address?.city  // nil — short circuits safely

// nil coalescing — provide a default
let displayCity = city ?? "Unknown"

// force unwrap — use ONLY when you're certain it's not nil
let count = email!.count  // crashes if email is nil

// optional map — transform if non-nil
let upper = email.map { $0.uppercased() }  // nil if email is nil`,
          examples: [
            { input: `let x: Int? = 42\nlet result = x.map { $0 * 2 }\n// result`, output: `Optional(84)` },
            { input: `let x: Int? = nil\nlet result = x.map { $0 * 2 }\n// result`, output: `nil` },
          ],
        },
        advanced: {
          explanation: "Swift's type system has property wrappers that transform a stored property — @Published in SwiftUI, @AppStorage, @State. You can build custom ones. Result type is the functional alternative to throwing errors.",
          code: `// Result type — success or failure without throwing
func divide(_ a: Double, by b: Double) -> Result<Double, DivisionError> {
    guard b != 0 else { return .failure(.divisionByZero) }
    return .success(a / b)
}

switch divide(10, by: 2) {
case .success(let value): print(value)  // 5.0
case .failure(let error): print(error)
}

// custom property wrapper
@propertyWrapper
struct Clamped {
    private var value: Int
    let range: ClosedRange<Int>
    var wrappedValue: Int {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }
    init(wrappedValue: Int, _ range: ClosedRange<Int>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
}

struct Settings {
    @Clamped(0...100) var volume: Int = 50
}
var s = Settings()
s.volume = 150   // automatically clamped to 100`,
          examples: [
            { input: `var s = Settings()\ns.volume = 200\nprint(s.volume)`, output: `100  // clamped automatically` },
          ],
          note: "Result is great for functions that can fail in expected ways. throws is better when failure is unexpected/exceptional. async throws combines both for async operations that can fail",
        },
      }),

      card("structs vs classes", {
        beginner: {
          explanation: "Swift has structs and classes. The key difference: structs are copied when assigned (value type), classes are shared (reference type). Prefer structs — they're safer because changes in one place don't accidentally affect another.",
          code: `// struct — VALUE type (each variable gets its own copy)
struct Point {
    var x: Double
    var y: Double
}

var p1 = Point(x: 3, y: 4)
var p2 = p1        // p2 is a COPY of p1
p2.x = 99
print(p1.x)        // 3 — p1 unchanged

// class — REFERENCE type (variables share the same object)
class Counter {
    var count = 0
    func increment() { count += 1 }
}

let c1 = Counter()
let c2 = c1       // c2 POINTS TO the same Counter
c2.increment()
print(c1.count)   // 1 — c1 also changed!

// struct with method that modifies self needs mutating
struct Circle {
    var radius: Double
    mutating func scale(by factor: Double) {
        radius *= factor   // mutating lets us change self
    }
}`,
          examples: [
            { input: `struct S { var x = 0 }\nvar a = S(); var b = a\nb.x = 99\nprint(a.x)`, output: `0  // structs are copied` },
            { input: `class C { var x = 0 }\nlet a = C(); let b = a\nb.x = 99\nprint(a.x)`, output: `99  // classes are shared` },
          ],
          note: "use structs for data (Point, Color, User, Message) and classes for things with identity or that need inheritance (ViewControllers, services, objects that manage shared state)",
        },
        intermediate: {
          explanation: "Protocols define a set of requirements that types must implement. This is Swift's version of interfaces. Protocol extensions add default implementations so conforming types get them for free.",
          code: `// protocol — defines what a type must do
protocol Drawable {
    var color: String { get }
    func draw()
    func area() -> Double
}

// protocol extension — add default implementation
extension Drawable {
    func describe() -> String {
        "A \\(color) shape with area \\(String(format: "%.2f", area()))"
    }
}

// struct conforming to protocol
struct Circle: Drawable {
    var color = "red"
    let radius: Double
    func draw() { print("Drawing circle") }
    func area() -> Double { .pi * radius * radius }
}

// now Circle gets describe() for free from the extension
let c = Circle(radius: 5)
c.describe()  // "A red shape with area 78.54"

// protocols as types
func render(_ shape: any Drawable) {
    shape.draw()
}

// Equatable and Comparable protocols
struct Player: Comparable {
    var name: String
    var score: Int
    static func < (lhs: Player, rhs: Player) -> Bool {
        lhs.score < rhs.score
    }
}`,
          examples: [
            { input: `Circle(color:"blue",radius:5).describe()`, output: `"A blue shape with area 78.54"` },
          ],
        },
        advanced: {
          explanation: "Sendable, actors, and Swift concurrency make multithreaded code safe. Actors protect their mutable state from concurrent access automatically — only one task accesses actor state at a time.",
          code: `// actor — safe shared mutable state across tasks
actor BankAccount {
    private var balance: Double = 0

    func deposit(_ amount: Double) {
        balance += amount   // safe — only one task at a time
    }

    func withdraw(_ amount: Double) -> Bool {
        guard balance >= amount else { return false }
        balance -= amount
        return true
    }

    var currentBalance: Double { balance }
}

// must use await to access actor from outside
let account = BankAccount()
await account.deposit(100)
let success = await account.withdraw(50)

// Sendable — type safe to share across concurrency boundaries
struct Message: Sendable {  // ok — structs with Sendable fields are Sendable
    let text: String
    let timestamp: Date
}

// async let — structured concurrency
async let price   = fetchPrice()
async let reviews = fetchReviews()
let (p, r) = await (price, reviews)  // both run concurrently`,
          examples: [
            { input: `// without actor — data race!\nvar count = 0\nfor _ in 1...1000 { Task { count += 1 } }`, output: `count is wrong — data race` },
            { input: `// with actor — safe\nactor Counter { var n=0; func inc(){n+=1} }\nlet c=Counter()\nfor _ in 1...1000 { Task { await c.inc() } }`, output: `n is always 1000` },
          ],
          note: "actors are reference types like classes, but all access to their stored properties must be done with await. the compiler enforces this — you can't accidentally access actor state from multiple threads",
        },
      }),
    ]),
  ],
});
