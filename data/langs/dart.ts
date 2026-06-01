import { lang, section, card } from '../helpers';

export default lang({
  id: "dart", name: "Dart", ext: ".dart", year: 2011, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + null safety", {
        beginner: {
          explanation: "Dart is Google's language primarily used with Flutter to build mobile, web, and desktop apps. It looks a lot like Java or C# but with Kotlin/Swift-style null safety. If you want to build iOS and Android apps with one codebase, Dart + Flutter is the main option.",
          code: `// Dart uses C-style syntax
void main() {
    // var — type inferred
    var name = 'Alice';      // String inferred
    var age  = 25;           // int inferred

    // explicit types
    String city    = 'Boston';
    int    score   = 100;
    double pi      = 3.14159;
    bool   isAdmin = true;

    // final = can't be reassigned (like val in Kotlin)
    final greeting = 'Hello';

    // const = compile-time constant
    const maxScore = 100;

    // string interpolation
    print('Hello, $name!');
    print('Age: \${age + 1}');   // expressions use \${}

    // null safety — types can't be null by default
    String? maybeNull = null;   // ? makes it nullable
    String neverNull  = 'hi';   // can NEVER be null
}`,
          examples: [
            { input: `var s = 'hello';\nprint(s.toUpperCase());`, output: `HELLO` },
            { input: `int? x = null;\nprint(x ?? 0);`, output: `0  // null coalescing` },
          ],
          note: "Dart's sound null safety means the compiler guarantees non-nullable types are never null. this prevents NullPointerExceptions at runtime — if your code compiles, null won't crash it",
        },
        intermediate: {
          explanation: "Dart classes are similar to Java/C# but with cleaner constructor syntax, named parameters, and mixins. The cascade operator (..) chains calls on the same object.",
          code: `class Person {
    final String name;
    int age;
    String? email;    // nullable field

    // constructor with required named parameters
    Person({
        required this.name,   // required named param
        required this.age,
        this.email,           // optional named param
    });

    // named constructor
    Person.guest() : name = 'Guest', age = 0;

    // getter
    bool get isAdult => age >= 18;

    // toString override
    @override
    String toString() => 'Person($name, $age)';
}

// create
final alice = Person(name: 'Alice', age: 25);
final guest = Person.guest();

// cascade operator — chain calls on same object
final List<String> list = []
    ..add('Alice')    // same as list.add('Alice')
    ..add('Bob')      // then list.add('Bob')
    ..sort();         // then list.sort()

// extension methods — add methods to existing types
extension StringExtensions on String {
    String get reversed => split('').reversed.join();
    bool get isPalindrome => this == reversed;
}

'racecar'.isPalindrome  // true`,
          examples: [
            { input: `'racecar'.isPalindrome`, output: `true` },
            { input: `Person(name:'Alice', age:25).isAdult`, output: `true` },
          ],
        },
        advanced: {
          explanation: "Dart's async/await with Streams enables reactive programming. Streams are like async generators — they produce values over time. This is fundamental to Flutter's reactive UI model.",
          code: `// Future — single async value (like Promise)
Future<String> fetchData() async {
    await Future.delayed(Duration(seconds: 1));
    return 'data';
}

// run multiple in parallel
Future<void> parallel() async {
    final results = await Future.wait([
        fetchData(),
        fetchData(),
    ]);
    print(results);   // [data, data] after ~1 second
}

// Stream — multiple async values over time
Stream<int> countUp(int to) async* {
    for (var i = 0; i <= to; i++) {
        await Future.delayed(Duration(milliseconds: 100));
        yield i;    // produce value
    }
}

// consume a stream
await for (final n in countUp(5)) {
    print(n);   // 0, 1, 2, 3, 4, 5 (one per 100ms)
}

// or transform with StreamTransformer
countUp(10)
    .where((n) => n.isEven)          // filter
    .map((n) => n * n)               // transform
    .listen((n) => print(n));        // subscribe`,
          examples: [
            { input: `Stream.fromIterable([1,2,3,4,5]).where((n)=>n.isOdd)`, output: `Stream: 1, 3, 5` },
          ],
          note: "in Flutter, StreamBuilder widget rebuilds the UI whenever a Stream emits a new value. this is the foundation of reactive UI — your UI is a function of your data stream",
        },
      }),
    ]),
  ],
});
