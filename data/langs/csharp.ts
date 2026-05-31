import { lang, section, card } from '../helpers';

export default lang({
  id: "csharp", name: "C#", ext: ".cs", year: 2000, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "C# is a strongly typed language from Microsoft that runs on the .NET platform. Every variable needs a type, but 'var' lets the compiler figure it out for you. C# is similar to Java but with cleaner syntax and more modern features.",
          code: `// explicit types
int    age     = 25;
double pi      = 3.14159;
bool   isAdmin = true;
string name    = "Alice";   // lowercase string works too

// var — compiler infers the type
var count  = 42;            // int
var price  = 9.99;          // double
var phrase = "hello";       // string

// string interpolation — cleaner than concatenation
var greeting = \$"Hello, {name}! You are {age} years old.";

// verbatim string — backslashes are literal
var path = @"C:\Users\Alice\Documents\file.txt";

// multi-line string (C# 11+)
var json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;

Console.WriteLine(greeting);`,
          examples: [
            { input: `var x = 5;\nConsole.WriteLine(x * 2);`, output: `10` },
            { input: `var name = "Alice";\nConsole.WriteLine(\$"Hello, {name.ToUpper()}!");`, output: `Hello, ALICE!` },
          ],
          note: "string (lowercase) and String (uppercase) are the same thing in C# — string is just an alias for System.String. use lowercase string by convention",
        },
        intermediate: {
          explanation: "C# has value types (int, double, bool, struct) that live on the stack and reference types (class, string, arrays) that live on the heap. Nullable value types (int?) let value types hold null.",
          code: `// nullable value types — add ? to allow null
int?    maybeAge   = null;
double? maybePrice = 9.99;

// null coalescing — default if null
int age = maybeAge ?? 0;

// null conditional — safe access
string? name = null;
int len = name?.Length ?? 0;  // 0, no crash

// pattern matching
object obj = "hello";
if (obj is string s && s.Length > 3) {
    Console.WriteLine(s.ToUpper());
}

// switch expression (C# 8+)
var category = score switch {
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    _     => "F"   // _ is the default case
};

// records (C# 9+) — immutable data objects
record Point(double X, double Y);
var p  = new Point(3, 4);
var p2 = p with { X = 10 };  // copy with change
p == new Point(3, 4)         // true — value equality`,
          examples: [
            { input: `record Point(double X, double Y);\nvar p = new Point(3,4);\np == new Point(3,4)`, output: `true  // value equality, auto-generated` },
            { input: `var x = 42 switch { > 10 => "big", _ => "small" };`, output: `"big"` },
          ],
        },
        advanced: {
          explanation: "C# has spans and memory types for zero-copy operations. Span<T> is a stack-allocated view over contiguous memory — it lets you slice arrays and strings without allocating new objects.",
          code: `using System;

// Span<T> — stack-allocated view, zero allocation
Span<int> arr = stackalloc int[5] { 1, 2, 3, 4, 5 };
Span<int> slice = arr[1..4];  // [2, 3, 4] — no allocation

// ReadOnlySpan<char> — zero-copy string slicing
ReadOnlySpan<char> text = "Hello, World!".AsSpan();
ReadOnlySpan<char> hello = text[..5];  // "Hello" — no allocation

// Memory<T> — heap-based, can be stored
Memory<byte> buffer = new byte[1024];
Memory<byte> half   = buffer[..512];

// ref struct — must live on stack, can't be boxed
ref struct StackOnly {
    public Span<int> Data;
}

// unsafe code — direct memory access
unsafe {
    int x = 42;
    int* ptr = &x;
    *ptr = 99;
    Console.WriteLine(x);  // 99
}`,
          examples: [
            { input: `ReadOnlySpan<char> s = "hello world";\nvar word = s[..5];\nConsole.WriteLine(word.ToString());`, output: `hello  // zero allocation` },
          ],
          note: "Span<T> can't be stored on the heap or in async methods — use Memory<T> instead when you need to store the slice or use it across await boundaries",
        },
      }),

      card("LINQ", {
        beginner: {
          explanation: "LINQ (Language Integrated Query) lets you query and transform collections using a clean, readable syntax. It works on any collection — lists, arrays, databases (via Entity Framework), XML, and more.",
          code: `using System.Linq;

var nums = new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// filter — keep matching elements
var evens = nums.Where(n => n % 2 == 0);  // [2,4,6,8,10]

// transform — change each element
var doubled = nums.Select(n => n * 2);    // [2,4,6,...,20]

// chain them
var result = nums
    .Where(n => n % 2 == 0)   // keep evens
    .Select(n => n * n)        // square them
    .ToList();                 // [4, 16, 36, 64, 100]

// aggregate operations
nums.Sum()      // 55
nums.Max()      // 10
nums.Min()      // 1
nums.Average()  // 5.5
nums.Count()    // 10

// find elements
nums.First(n => n > 5)           // 6
nums.FirstOrDefault(n => n > 99) // 0 — safe, no crash
nums.Any(n => n > 9)             // true — any match?
nums.All(n => n > 0)             // true — all match?`,
          examples: [
            { input: `new[]{1,2,3,4,5}.Where(n=>n%2==0).Select(n=>n*n)`, output: `[4, 16]` },
            { input: `new[]{"apple","fig","banana"}.OrderBy(s=>s.Length)`, output: `["fig","apple","banana"]` },
          ],
          note: "LINQ is lazy — nothing runs until you call ToList(), ToArray(), First(), Sum() etc. you can build up a query without executing it",
        },
        intermediate: {
          explanation: "LINQ has query syntax (looks like SQL) and method syntax (chained methods). They're equivalent — use whichever is more readable. GroupBy, Join, and SelectMany are the powerful operators.",
          code: `// query syntax — looks like SQL
var query = from n in nums
            where n % 2 == 0
            orderby n descending
            select n * n;

// same thing in method syntax
var method = nums
    .Where(n => n % 2 == 0)
    .OrderByDescending(n => n)
    .Select(n => n * n);

// groupby — group elements by a key
var byLength = words.GroupBy(w => w.Length);
foreach (var group in byLength) {
    Console.WriteLine(\$"Length {group.Key}: {string.Join(", ", group)}");
}

// SelectMany — flatten nested collections
var allLetters = words.SelectMany(w => w);  // each char from each word
// "hello", "world" → ['h','e','l','l','o','w','o','r','l','d']

// join — combine two collections on a key
var joined = users.Join(
    orders,
    user  => user.Id,
    order => order.UserId,
    (user, order) => new { user.Name, order.Total }
);`,
          examples: [
            { input: `var words = new[]{"apple","ant","banana","bear"};\nwords.GroupBy(w=>w[0]).Select(g=>g.Key+":"+g.Count())`, output: `["a:2","b:2"]` },
          ],
        },
        advanced: {
          explanation: "LINQ deferred execution means the query runs fresh each time you enumerate it. If the source changes, the query reflects those changes. IQueryable is used for database queries — it translates LINQ to SQL.",
          code: `// deferred execution — runs when enumerated, not when defined
var list = new List<int> { 1, 2, 3 };
var query = list.Where(n => n > 1);   // NOT executed yet

list.Add(4);
list.Add(5);

foreach (var n in query) Console.Write(n);  // 2 3 4 5 — includes new items!

// force immediate execution
var snapshot = list.Where(n => n > 1).ToList();  // runs NOW, frozen

// IQueryable — LINQ to SQL (Entity Framework)
// this generates SQL, doesn't load everything into memory
var users = dbContext.Users
    .Where(u => u.Age > 18)       // WHERE age > 18
    .OrderBy(u => u.Name)         // ORDER BY name
    .Take(20)                     // LIMIT 20
    .ToList();                    // NOW it hits the database

// custom LINQ operator via extension method
public static IEnumerable<T> EveryOther<T>(this IEnumerable<T> source) {
    bool take = true;
    foreach (var item in source) {
        if (take) yield return item;
        take = !take;
    }
}
new[]{1,2,3,4,5,6}.EveryOther()  // [1, 3, 5]`,
          examples: [
            { input: `var list = new List<int>{1,2,3};\nvar q = list.Where(n=>n>1);\nlist.Add(99);\nq.ToList()`, output: `[2, 3, 99]  // 99 was added after query defined` },
          ],
          note: "deferred execution is a feature but also a footgun — if your source is expensive to compute, enumerating the query multiple times recomputes it each time. call .ToList() to cache the result",
        },
      }),

      card("async/await", {
        beginner: {
          explanation: "async/await in C# lets you do slow operations (network calls, file reads, database queries) without blocking the thread. An async method can pause at an await and let other code run while it waits.",
          code: `using System.Net.Http;

// async method — must return Task or Task<T>
async Task<string> FetchDataAsync(string url) {
    using var client = new HttpClient();

    // await pauses this method until the response arrives
    // the thread is FREE to do other work while waiting
    var response = await client.GetStringAsync(url);
    return response;
}

// call it
async Task Main() {
    string data = await FetchDataAsync("https://api.example.com/data");
    Console.WriteLine(data);
}

// handle errors
async Task SafeFetchAsync(string url) {
    try {
        var data = await FetchDataAsync(url);
        Console.WriteLine(data);
    } catch (HttpRequestException e) {
        Console.WriteLine(\$"Network error: {e.Message}");
    }
}`,
          examples: [
            { input: `// without async — thread is blocked while waiting\nvar data = File.ReadAllText("big.txt");  // thread stuck`, output: `thread can't do anything else` },
            { input: `// with async — thread is free while waiting\nvar data = await File.ReadAllTextAsync("big.txt");`, output: `thread does other work while file loads` },
          ],
          note: "async void is almost always wrong — it can't be awaited and exceptions get swallowed. always return Task or Task<T> from async methods. async void is only ok for event handlers",
        },
        intermediate: {
          explanation: "Task.WhenAll runs multiple async operations in parallel. CancellationToken lets you cancel long-running operations. ConfigureAwait(false) avoids deadlocks in library code.",
          code: `// parallel — all three run at the same time
var task1 = FetchDataAsync("url1");
var task2 = FetchDataAsync("url2");
var task3 = FetchDataAsync("url3");
var results = await Task.WhenAll(task1, task2, task3);
// total time = slowest of the three

// WhenAny — first one to finish wins
var first = await Task.WhenAny(task1, task2, task3);
var data  = await first;  // get the result

// CancellationToken — cancel operations
async Task LongOperationAsync(CancellationToken ct) {
    for (int i = 0; i < 100; i++) {
        ct.ThrowIfCancellationRequested();  // check if cancelled
        await Task.Delay(100, ct);
    }
}

using var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(5));  // cancel after 5 seconds
await LongOperationAsync(cts.Token);`,
          examples: [
            { input: `// 3 x 1-second tasks\nvar results = await Task.WhenAll(\n    Delay(1000), Delay(1000), Delay(1000));`, output: `total: ~1 second (parallel)` },
          ],
        },
        advanced: {
          explanation: "ValueTask is a lighter alternative to Task for hot paths that often complete synchronously. IAsyncEnumerable lets you produce values asynchronously one at a time — like a streaming API.",
          code: `// ValueTask — avoid allocation for sync-completing operations
async ValueTask<int> GetCachedValueAsync(string key) {
    if (cache.TryGetValue(key, out int val))
        return val;  // completes synchronously — no Task allocation!
    return await FetchFromDbAsync(key);
}

// IAsyncEnumerable — async streaming
async IAsyncEnumerable<string> StreamLinesAsync(string path) {
    await using var reader = new StreamReader(path);
    while (!reader.EndOfStream) {
        var line = await reader.ReadLineAsync();
        if (line != null) yield return line;  // produce one line at a time
    }
}

// consume the stream
await foreach (var line in StreamLinesAsync("big.txt")) {
    ProcessLine(line);  // process each line as it's read
}

// Parallel.ForEachAsync (C# 6+) — controlled parallelism
await Parallel.ForEachAsync(
    urls,
    new ParallelOptions { MaxDegreeOfParallelism = 4 },
    async (url, ct) => await ProcessUrl(url, ct)
);`,
          examples: [
            { input: `async IAsyncEnumerable<int> Count() {\n    for(int i=0;i<3;i++) { await Task.Delay(100); yield return i; }\n}\nawait foreach(var n in Count()) Console.Write(n);`, output: `0 1 2  (one per 100ms)` },
          ],
          note: "don't use ValueTask unless you've profiled and confirmed Task allocation is a bottleneck. ValueTask is harder to use correctly — you can only await it once and can't cache it",
        },
      }),
    ]),
  ],
});
