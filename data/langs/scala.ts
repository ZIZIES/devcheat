import { lang, section, card } from '../helpers';

export default lang({
  id: "scala", name: "Scala", ext: ".scala", year: 2004, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "Scala runs on the JVM (like Java) so it can use all Java libraries, but it's much more expressive. It blends object-oriented and functional programming. Scala is used heavily in data engineering (Apache Spark is written in Scala) and backend services. The name stands for Scalable Language.",
          code: `// val = immutable (preferred), var = mutable
val name: String = "Alice"   // explicit type
val age = 25                  // type inferred as Int
var count = 0                 // mutable

count = count + 1   // ok — var allows this
// name = "Bob"    // ERROR — val doesn't allow this

// types
val x: Int    = 42
val y: Double = 3.14
val z: Long   = 9_000_000_000L
val b: Boolean = true
val c: Char   = 'A'

// string interpolation
val greeting = s"Hello, $name! You are $age years old."
val calc = s"${age * 2} is double your age"

// raw string (no escape sequences)
val path = raw"C:\Users\$name\file.txt"

// println
println(greeting)
println(s"Pi is approximately ${math.Pi:.2f}")`,
          examples: [
            { input: `val x = 42\nprintln(s"x * 2 = ${x * 2}")`, output: `x * 2 = 84` },
            { input: `"hello".toUpperCase`, output: `"HELLO"` },
          ],
          note: "in Scala, method calls without arguments don't need parentheses: string.length or string.length() both work. by convention, methods with side effects use () and pure methods don't",
        },
        intermediate: {
          explanation: "Scala's case classes are like Kotlin data classes or Python dataclasses — they automatically get equals, hashCode, toString, and copy. Pattern matching on case classes is one of Scala's most powerful features.",
          code: `// case class — immutable data with auto-generated methods
case class Person(name: String, age: Int, email: String = "")

val alice = Person("Alice", 25)
val bob   = Person("Bob", 30, "bob@example.com")

alice.name      // "Alice"
alice == Person("Alice", 25)  // true — value equality
alice.copy(age = 26)          // new Person with age changed

// sealed trait + case classes = algebraic data type
sealed trait Shape  // sealed = only defined here
case class Circle(radius: Double)          extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

// pattern matching — exhaustive (compiler checks)
def area(shape: Shape): Double = shape match {
    case Circle(r)        => math.Pi * r * r
    case Rectangle(w, h)  => w * h
}

// Option — safe null alternative
def findUser(id: Int): Option[Person] =
    if (id == 1) Some(alice)
    else None

findUser(1).map(_.name)         // Some("Alice")
findUser(2).getOrElse("none")   // "none"`,
          examples: [
            { input: `area(Circle(5.0))`, output: `78.53981633974483` },
            { input: `findUser(99).map(_.name).getOrElse("unknown")`, output: `"unknown"` },
          ],
        },
        advanced: {
          explanation: "Scala's type system has higher-kinded types, implicits (given/using in Scala 3), and type classes. Scala 3 simplifies many Scala 2 features. The collections library with map/filter/flatMap is extremely powerful.",
          code: `// for comprehension — syntactic sugar for map/flatMap/filter
val result = for {
    x <- List(1, 2, 3)
    y <- List(10, 20)
    if x + y > 15
} yield s"$x + $y = ${x + y}"
// List("1 + 20 = 21", "2 + 20 = 22", "3 + 10 = 13", "3 + 20 = 23")

// type class pattern (Scala 3 with given/using)
trait Printable[A]:
    def print(a: A): String

given Printable[Int] with
    def print(n: Int) = s"Int: $n"

given Printable[String] with
    def print(s: String) = s"String: $s"

def printIt[A](a: A)(using p: Printable[A]): Unit =
    println(p.print(a))

printIt(42)       // Int: 42
printIt("hello")  // String: hello

// futures — async computation
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val f1 = Future { Thread.sleep(1000); 42 }
val f2 = Future { Thread.sleep(500);  "hello" }

// combine futures
val combined = for {
    n <- f1
    s <- f2
} yield s"$s: $n"`,
          examples: [
            { input: `(1 to 10).filter(_ % 2 == 0).map(_ * _ ).sum`, output: `220  // sum of squares of even numbers 1-10` },
          ],
          note: "Scala's for comprehensions desugar to map/flatMap/filter calls. they're not imperative loops — they're functional transformations on monadic types (List, Option, Future, Either all work)",
        },
      }),
    ]),
  ],
});
