import { lang, section, card } from '../helpers';

export default lang({
  id: "php", name: "PHP", ext: ".php", year: 1994, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "PHP is a server-side language that runs on web servers. Variables always start with a $ sign. PHP is loosely typed — variables can hold any type. All PHP code goes inside <?php ?> tags. Echo prints to the webpage.",
          code: `<?php
// variables always start with $
$name  = "Alice";
$age   = 25;
$price = 9.99;
$isAdmin = true;
$nothing = null;

// print to the page
echo "Hello, $name!";        // Hello, Alice!
echo "Age: " . $age;         // Age: 25 (. = concatenation)
echo "<br>";                  // HTML line break

// double quotes expand variables, single quotes don't
echo "Hello $name";    // Hello Alice
echo 'Hello $name';    // Hello $name (literal)

// string interpolation with complex expressions
echo "Price: {$price}";
echo "Name length: {$name}";

// type juggling — PHP is very loose
var_dump($name);   // string(5) "Alice"
var_dump($age);    // int(25)`,
          examples: [
            { input: `$x = "5";\n$y = 3;\necho $x + $y;`, output: `8  // PHP converts "5" to int` },
            { input: `echo "Hello, $name!";  // $name = "Alice"`, output: `Hello, Alice!` },
          ],
          note: "PHP's loose typing causes surprising behavior: '5' + 3 = 8 (string becomes number). always use === (strict equality) instead of == to avoid type coercion surprises",
        },
        intermediate: {
          explanation: "PHP 7+ added type declarations for function parameters and return values. PHP 8 added union types and nullsafe operator. These make PHP code much more reliable.",
          code: `<?php

// type declarations (PHP 7+)
function add(int $a, int $b): int {
    return $a + $b;
}

// union types (PHP 8+)
function format(int|float $n): string {
    return number_format($n, 2);
}

// nullable types
function findUser(?int $id): ?array {
    if ($id === null) return null;
    return getUserById($id);
}

// null coalescing — safe default
$name = $_GET['name'] ?? 'Anonymous';

// nullsafe operator (PHP 8+) — like optional chaining in JS
$city = $user?->getAddress()?->getCity();

// match expression (PHP 8+) — stricter than switch
$label = match($status) {
    'active'   => 'Active',
    'inactive' => 'Inactive',
    'pending'  => 'Pending',
    default    => 'Unknown',
};

// named arguments (PHP 8+)
array_slice(array: $arr, offset: 2, length: 3);`,
          examples: [
            { input: `$x = $_GET['page'] ?? 1;\n// if 'page' not in URL, $x = 1`, output: `1` },
          ],
          note: "match is stricter than switch — it uses === (strict comparison) and doesn't fall through. always prefer match over switch in PHP 8+",
        },
        advanced: {
          explanation: "PHP's JIT compiler (added in PHP 8) compiles hot code to machine instructions. Fibers (PHP 8.1) enable cooperative multitasking. Named arguments and intersection types improve type safety.",
          code: `<?php

// Fibers — cooperative multitasking (PHP 8.1)
$fiber = new Fiber(function(): void {
    $value = Fiber::suspend('first');   // pause here
    echo "got: $value\\n";
});

$first = $fiber->start();        // "first" — from suspend
$fiber->resume('hello');          // got: hello

// intersection types — must satisfy ALL types (PHP 8.1)
function process(Iterator&Countable $collection): void {
    echo count($collection);  // must have both Iterator and Countable
}

// readonly properties (PHP 8.1)
class User {
    public function __construct(
        public readonly int    $id,
        public readonly string $name,
    ) {}
}
$user = new User(1, "Alice");
// $user->id = 2;  // Fatal error — readonly

// enums (PHP 8.1) — backed by string or int
enum Status: string {
    case Active   = 'active';
    case Inactive = 'inactive';

    public function label(): string {
        return match($this) {
            Status::Active   => 'Active User',
            Status::Inactive => 'Inactive User',
        };
    }
}

Status::Active->value;   // 'active'
Status::Active->label(); // 'Active User'`,
          examples: [
            { input: `enum Color { case Red; case Green; case Blue; }\n$c = Color::Red;\n$c === Color::Red`, output: `true` },
          ],
          note: "PHP 8.0+ has JIT compilation but it mainly helps CPU-bound code, not typical I/O-bound web requests. use opcache for significant speedups on regular PHP apps",
        },
      }),

      card("arrays + functions", {
        beginner: {
          explanation: "PHP arrays are actually ordered maps — they can work as both a numbered list and a key-value store. Array functions like array_map, array_filter, and usort let you transform arrays without loops.",
          code: `<?php

// indexed array (list)
$fruits = ["apple", "banana", "cherry"];
$fruits[] = "mango";        // append
echo $fruits[0];            // apple
echo count($fruits);        // 4

// associative array (map)
$user = [
    "name"  => "Alice",
    "age"   => 25,
    "email" => "alice@example.com",
];
echo $user["name"];           // Alice
$user["city"] = "Boston";     // add new key

// check if key exists
isset($user["email"])         // true
array_key_exists("phone", $user)  // false

// loop through
foreach ($user as $key => $value) {
    echo "$key: $value\\n";
}

// useful array functions
sort($fruits);                // sort ascending (in place)
rsort($fruits);               // sort descending
array_push($fruits, "grape"); // same as $fruits[]
array_pop($fruits);           // remove last
array_shift($fruits);         // remove first
array_unshift($fruits, "x");  // add to front`,
          examples: [
            { input: `$nums = [3,1,4,1,5];\nsort($nums);\nprint_r($nums);`, output: `Array([0]=>1 [1]=>1 [2]=>3 [3]=>4 [4]=>5)` },
          ],
        },
        intermediate: {
          explanation: "PHP's array functions are powerful. array_map transforms elements, array_filter keeps matching ones, array_reduce folds to a single value. These avoid imperative loops.",
          code: `<?php

$nums = [1, 2, 3, 4, 5, 6];

// array_map — transform each element
$doubled  = array_map(fn($n) => $n * 2, $nums);    // [2,4,6,8,10,12]
$strings  = array_map('strval', $nums);              // ['1','2',...,'6']

// array_filter — keep matching elements
$evens    = array_filter($nums, fn($n) => $n % 2 === 0);  // [2,4,6]

// array_reduce — fold to single value
$sum      = array_reduce($nums, fn($carry, $n) => $carry + $n, 0); // 21

// usort — custom sort
$people = [['name'=>'Bob','age'=>30], ['name'=>'Alice','age'=>25]];
usort($people, fn($a, $b) => $a['age'] <=> $b['age']);
// now sorted by age

// array_column — pluck a field from a list of arrays
$names = array_column($people, 'name');  // ['Alice', 'Bob']

// array_combine — make associative array from two arrays
$keys = ['a', 'b', 'c'];
$vals = [1, 2, 3];
$map  = array_combine($keys, $vals);  // ['a'=>1,'b'=>2,'c'=>3]

// spread operator
$merged = [...$arr1, ...$arr2];`,
          examples: [
            { input: `array_map(fn($n)=>$n**2, [1,2,3,4])`, output: `[1, 4, 9, 16]` },
            { input: `array_filter([1,2,3,4,5], fn($n)=>$n>3)`, output: `[4, 5]` },
          ],
        },
        advanced: {
          explanation: "Generators in PHP produce values lazily — great for processing large datasets without loading everything into memory. Closures in PHP must explicitly declare which variables they capture.",
          code: `<?php

// generator — yield one value at a time
function readLargeFile(string $path): Generator {
    $handle = fopen($path, 'r');
    while (!feof($handle)) {
        yield fgets($handle);   // produce one line, pause
    }
    fclose($handle);
}

foreach (readLargeFile('huge.csv') as $line) {
    processLine($line);  // memory: one line at a time, not whole file
}

// closure — must use() to capture variables
$multiplier = 3;
$triple = function(int $n) use ($multiplier): int {
    return $n * $multiplier;
};
echo $triple(7);  // 21

// capture by reference with &
$count = 0;
$increment = function() use (&$count): void {
    $count++;
};
$increment();
$increment();
echo $count;  // 2

// static anonymous function — no $this, slightly faster
$fn = static function(int $n): int { return $n * 2; };`,
          examples: [
            { input: `$x = 10;\n$fn = fn($n) => $n + $x;  // arrow fn auto-captures\n$fn(5)`, output: `15` },
          ],
          note: "arrow functions (fn() =>) in PHP 8 automatically capture outer variables — no use() needed. but they can't modify outer variables (no & capture). use regular functions with use(&$var) for that",
        },
      }),
    ]),
  ],
});
