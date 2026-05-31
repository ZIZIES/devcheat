import { lang, section, card } from '../helpers';

export default lang({
  id: "java", name: "Java", ext: ".java", year: 1995, common: true,
  sections: [
    section("basics", "basics", [
      card("hello world + basics", {
        beginner: {
          explanation: "Java is compiled to bytecode that runs on the Java Virtual Machine (JVM). Every Java file must have a class with the same name as the file. The program starts in the main method. Java is very explicit — everything needs a type.",
          code: `// file must be named Main.java
public class Main {
    // program starts here — this exact signature is required
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Java says hi!");

        // variables need explicit types
        int    age  = 25;
        double pi   = 3.14159;
        String name = "Alice";  // String is capitalized in Java
        boolean ok  = true;

        // String concatenation
        System.out.println("Hello, " + name);

        // formatted print
        System.out.printf("age: %d, pi: %.2f%n", age, pi);
    }
}`,
          examples: [
            { input: `javac Main.java   # compile\njava Main        # run`, output: `Hello, World!` },
          ],
          note: "System.out.println adds a newline. System.out.print does not. System.out.printf works like C's printf. %n is a newline that works on all platforms (\\n might not on Windows)",
        },
        intermediate: {
          explanation: "var (since Java 10) lets the compiler infer local variable types. Java has primitive types (int, double, boolean) and their boxed object equivalents (Integer, Double, Boolean) — you need the boxed versions for collections.",
          code: `// var — local type inference (Java 10+)
var list = new ArrayList<String>();  // compiler infers ArrayList<String>
var map  = new HashMap<String, Integer>();

// primitives vs boxed types
int x = 42;          // primitive — stack, fast, can't be null
Integer y = 42;      // boxed — heap, slow, can be null
Integer z = null;    // valid — boxed can be null

// autoboxing — Java automatically converts between them
Integer boxed = 42;       // auto-boxed from int
int unboxed   = boxed;    // auto-unboxed to int
// but: Integer a = null; int b = a;  // NullPointerException!

// String methods
String s = "Hello, World!";
s.length()              // 13
s.toUpperCase()         // "HELLO, WORLD!"
s.substring(7, 12)      // "World"
s.contains("World")     // true
s.replace("World","Java")// "Hello, Java!"
s.split(", ")           // ["Hello", "World!"]
String.format("x=%d", 42) // "x=42"`,
          examples: [
            { input: `"hello world".split(" ")[1].toUpperCase()`, output: `"WORLD"` },
            { input: `String.format("%.2f", Math.PI)`, output: `"3.14"` },
          ],
        },
        advanced: {
          explanation: "Java's String is immutable — every operation creates a new String. For building strings in a loop, use StringBuilder which mutates in place and is O(n) instead of O(n²).",
          code: `// String is immutable — each + creates a new String object
// This is O(n²) — very slow for large n
String result = "";
for (int i = 0; i < 10000; i++) {
    result += i;   // creates a new String each iteration!
}

// StringBuilder — mutable, O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String result = sb.toString();  // convert to String at the end

// String.join — for joining a list
String joined = String.join(", ", "alice", "bob", "carol");
// "alice, bob, carol"

// useful String methods for parsing
"  hello  ".strip()      // "hello" (Java 11+)
"42".isBlank()           // false (Java 11+)
"hi\\nbye".lines()       // Stream<String>
"abc".repeat(3)          // "abcabcabc" (Java 11+)
"hello".chars()          // IntStream of char values`,
          examples: [
            { input: `String.join("-", "2024", "01", "15")`, output: `"2024-01-15"` },
          ],
          note: "in Java 21+, use String templates for interpolation: STR.\"Hello \\{name}!\" (preview feature). for now String.format() or + concatenation are the standard ways",
        },
      }),

      card("collections + generics", {
        beginner: {
          explanation: "Java collections are type-safe containers. The type in angle brackets (like ArrayList<String>) says what kind of things the list holds. ArrayList is like a resizable array. HashMap stores key-value pairs.",
          code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// ArrayList — resizable array
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Carol");

names.get(0);          // "Alice"
names.size();          // 3
names.contains("Bob"); // true
names.remove("Bob");   // removes by value
names.remove(0);       // removes by index

// loop through
for (String name : names) {
    System.out.println(name);
}

// HashMap — key-value pairs
HashMap<String, Integer> scores = new HashMap<>();
scores.put("alice", 95);
scores.put("bob", 87);
scores.get("alice");          // 95
scores.getOrDefault("carol", 0); // 0 — safe get
scores.containsKey("bob");    // true`,
          examples: [
            { input: `var list = new ArrayList<>(List.of(3,1,4,1,5));\nCollections.sort(list);\nSystem.out.println(list);`, output: `[1, 1, 3, 4, 5]` },
          ],
          note: "List.of() creates an immutable list — you can't add or remove from it. new ArrayList<>(List.of(...)) creates a mutable copy. use List.of() when you just need a fixed collection",
        },
        intermediate: {
          explanation: "Streams (Java 8+) let you process collections with map, filter, and reduce in a pipeline. They're lazy — nothing runs until you call a terminal operation like collect() or count().",
          code: `import java.util.stream.*;
import java.util.*;

var nums = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// stream pipeline
var result = nums.stream()
    .filter(n -> n % 2 == 0)      // keep evens
    .map(n -> n * n)              // square them
    .collect(Collectors.toList()); // [4, 16, 36, 64, 100]

// terminal operations
nums.stream().count()              // 10
nums.stream().sum()                // not directly — need mapToInt
nums.stream().mapToInt(Integer::intValue).sum()  // 55
nums.stream().max(Comparator.naturalOrder())     // Optional[10]

// collecting to different collections
Map<Boolean,List<Integer>> groups = nums.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {false=[1,3,5,7,9], true=[2,4,6,8,10]}

String joined = nums.stream()
    .map(String::valueOf)
    .collect(Collectors.joining(", "));  // "1, 2, 3, ..."`,
          examples: [
            { input: `List.of(1,2,3,4,5).stream()\n  .filter(n->n%2==0).map(n->n*n)\n  .collect(Collectors.toList())`, output: `[4, 16]` },
          ],
        },
        advanced: {
          explanation: "Records (Java 16+) are immutable data classes that auto-generate constructor, getters, equals, hashCode, and toString. Sealed classes restrict which classes can extend them — perfect for modeling state machines.",
          code: `// record — immutable data carrier
record Point(double x, double y) {
    // compact constructor for validation
    Point {
        if (Double.isNaN(x) || Double.isNaN(y))
            throw new IllegalArgumentException("NaN not allowed");
    }
    // custom method
    double distance() { return Math.sqrt(x*x + y*y); }
}

var p = new Point(3, 4);
p.x()          // 3.0   — getter auto-generated
p.distance()   // 5.0
p.equals(new Point(3, 4))  // true — auto-generated

// sealed interface — only listed classes can implement it
sealed interface Shape permits Circle, Rect, Triangle {}
record Circle(double radius) implements Shape {}
record Rect(double width, double height) implements Shape {}

// exhaustive switch — compiler ensures all cases covered
double area(Shape s) {
    return switch (s) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rect r      -> r.width() * r.height();
        case Triangle t  -> 0;   // compiler would warn if missing
    };
}`,
          examples: [
            { input: `record Point(double x, double y) {}\nnew Point(3,4).equals(new Point(3,4))`, output: `true  // auto-generated equals` },
          ],
          note: "records are immutable by default — you can't change their fields after construction. use 'with' idiom for 'copy with change': new Point(p.x(), 5) creates a new Point with different y",
        },
      }),
    ]),
  ],
});
