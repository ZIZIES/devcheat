import { lang, section, card } from '../helpers';

export default lang({
  id: "kotlin", name: "Kotlin", ext: ".kt", year: 2011, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + null safety", {
        beginner: {
          explanation: "Kotlin is a modern language that runs on the same JVM as Java but is much cleaner to write. The biggest thing Kotlin adds is null safety — it forces you to think about whether a variable can be empty (null) before you use it, which prevents the most common crash in programming.",
          code: `// val = can never be reassigned (like const)
// var = can be reassigned
val name = "Alice"     // type inferred as String
var age  = 25          // type inferred as Int
age = 26               // ok — var allows this
// name = "Bob"        // ERROR — val doesn't allow this

// nullable — add ? to allow null
var email: String? = null   // can be null
var city:  String  = "NYC"  // can NEVER be null

// safe call — returns null instead of crashing
println(email?.length)  // null (doesn't crash)
println(city.length)    // 3

// elvis operator — provide a default if null
val len = email?.length ?: 0  // 0 if email is null

// string templates — much cleaner than concatenation
println("Hello, \${name}! You are \$age years old.")`,
          examples: [
            { input: `val s: String? = null\nprintln(s?.length ?: 0)`, output: `0` },
            { input: `val s: String? = "hello"\nprintln(s?.length ?: 0)`, output: `5` },
          ],
          note: "the ? after a type (String?) means it can hold null. without ? it can NEVER be null and Kotlin won't even let you try. this prevents NullPointerExceptions at compile time",
        },
        intermediate: {
          explanation: "Kotlin's type system distinguishes nullable (String?) from non-null (String) at compile time. Smart casts let the compiler track what you've checked — after an if (x != null) check, x is automatically treated as non-null inside the block.",
          code: `// smart cast — compiler tracks null checks
fun printLength(s: String?) {
    if (s != null) {
        println(s.length)  // compiler knows s is String here, not String?
    }
}

// let — run a block only if non-null
email?.let { e ->
    println("email is: \$e")
    sendEmail(e)
}

// !! — assert non-null (throws if null — use sparingly)
val definitely = email!!  // crashes with NPE if email is null

// also, apply, run, with, let — scope functions
val user = User().apply {
    name  = "Alice"   // this = user inside apply
    email = "a@b.com"
}

// when — Kotlin's switch, but way more powerful
val result = when (age) {
    in 0..12  -> "child"
    in 13..17 -> "teen"
    in 18..64 -> "adult"
    else      -> "senior"
}`,
          examples: [
            { input: `val x: String? = "hello"\nval len = x?.length ?: -1\nprintln(len)`, output: `5` },
            { input: `val x: String? = null\nval len = x?.length ?: -1\nprintln(len)`, output: `-1` },
          ],
        },
        advanced: {
          explanation: "Kotlin's type system has platform types (T!) for Java interop — values from Java code are neither nullable nor non-null, they're unknown. Be careful calling Java APIs without null checks.",
          code: `// platform type — comes from Java, type is unknown (T!)
val javaString = JavaClass.getString()  // String! — might be null
// Kotlin can't guarantee safety here

// Nothing type — a function that never returns normally
fun fail(msg: String): Nothing {
    throw IllegalStateException(msg)  // always throws
}

// inline functions — avoid lambda overhead
inline fun <T> measure(block: () -> T): T {
    val start = System.nanoTime()
    val result = block()
    println("took \${System.nanoTime() - start}ns")
    return result
}

// reified type parameters — access type at runtime
inline fun <reified T> isInstanceOf(value: Any): Boolean {
    return value is T  // T is accessible at runtime because of reified
}
isInstanceOf<String>("hello")  // true
isInstanceOf<Int>("hello")     // false

// delegation
class LoggingList<T>(private val inner: MutableList<T>) : MutableList<T> by inner {
    override fun add(element: T): Boolean {
        println("Adding \$element")
        return inner.add(element)
    }
}`,
          examples: [
            { input: `inline fun <reified T> typeOf(v: Any) = v is T\ntypeOf<String>("hi")`, output: `true` },
          ],
          note: "reified type parameters only work with inline functions — the compiler inlines the function call and substitutes the actual type, making it available at runtime",
        },
      }),

      card("data classes + functions", {
        beginner: {
          explanation: "Data classes in Kotlin automatically get equals, hashCode, toString, and copy — all the boilerplate Java makes you write by hand. Functions use fun keyword and can have default parameter values.",
          code: `// data class — auto-generates equals, hashCode, toString, copy
data class User(
    val name:  String,
    val age:   Int,
    val email: String = ""   // default value
)

val alice = User("Alice", 25)
val bob   = User("Bob", 30, "bob@example.com")

println(alice)          // User(name=Alice, age=25, email=)
alice == User("Alice", 25)  // true — compares by value, not reference

// copy — create modified version
val olderAlice = alice.copy(age = 26)

// destructuring — unpack into variables
val (name, age) = alice
println("\$name is \$age")   // Alice is 25

// function with default parameters
fun greet(name: String, greeting: String = "Hello") {
    println("\$greeting, \$name!")
}
greet("Alice")              // Hello, Alice!
greet("Alice", "Hi")        // Hi, Alice!
greet(greeting = "Hey", name = "Bob")  // named arguments`,
          examples: [
            { input: `data class Point(val x: Int, val y: Int)\nPoint(3,4) == Point(3,4)`, output: `true  // value equality` },
            { input: `val p = Point(3,4)\nval (x,y) = p\nprintln("\$x, \$y")`, output: `3, 4` },
          ],
          note: "data classes are perfect for representing data that you compare by value — DTOs, API responses, state objects. regular classes are for objects with identity (like services, repositories)",
        },
        intermediate: {
          explanation: "Extension functions let you add methods to existing classes without modifying them. This is huge — you can add functions to String, List, or any class even from a library.",
          code: `// extension function — add a method to String
fun String.isPalindrome(): Boolean {
    return this == this.reversed()
}
"racecar".isPalindrome()   // true
"hello".isPalindrome()     // false

// extension property
val String.wordCount: Int
    get() = trim().split("\\s+".toRegex()).size

"hello world foo".wordCount   // 3

// higher-order functions — functions that take functions
fun <T> List<T>.filterAndMap(
    predicate: (T) -> Boolean,
    transform: (T) -> T
): List<T> = filter(predicate).map(transform)

listOf(1,2,3,4,5)
    .filterAndMap({ it % 2 == 0 }, { it * it })  // [4, 16]

// lambda syntax — trailing lambda outside parens
listOf(1,2,3).map { it * 2 }    // [2, 4, 6]
listOf(1,2,3).filter { it > 1 } // [2, 3]
listOf(1,2,3).forEach { println(it) }`,
          examples: [
            { input: `fun String.shout() = uppercase() + "!!!"\n"hello".shout()`, output: `"HELLO!!!"` },
          ],
        },
        advanced: {
          explanation: "Coroutines are Kotlin's way of doing async/concurrent code. They're lightweight — you can run thousands of them simultaneously. suspend functions can pause without blocking a thread.",
          code: `import kotlinx.coroutines.*

// suspend function — can pause without blocking a thread
suspend fun fetchData(): String {
    delay(1000)     // pause for 1 second (non-blocking)
    return "data"
}

// launch — fire and forget
fun main() = runBlocking {
    launch {
        val data = fetchData()
        println(data)
    }
    println("this prints immediately")
}

// async — returns a Deferred (like a Promise)
suspend fun parallel() = coroutineScope {
    val a = async { fetchFromApi1() }   // starts immediately
    val b = async { fetchFromApi2() }   // starts immediately
    println(a.await() + b.await())      // wait for both
}

// Flow — cold stream of values (like a lazy sequence of suspending values)
fun numberFlow(): Flow<Int> = flow {
    for (i in 1..5) {
        delay(100)
        emit(i)   // produce value
    }
}
numberFlow().collect { value -> println(value) }`,
          examples: [
            { input: `// sequential: 2 seconds\nval a = fetchData()  // 1 sec\nval b = fetchData()  // 1 sec`, output: `total: ~2 seconds` },
            { input: `// parallel: 1 second\nval a = async { fetchData() }\nval b = async { fetchData() }\na.await(); b.await()`, output: `total: ~1 second` },
          ],
          note: "coroutines are not threads — they're much lighter. you can run 100,000 coroutines on a handful of threads. they suspend (pause) instead of blocking, freeing the thread for other work",
        },
      }),
    ]),
  ],
});
