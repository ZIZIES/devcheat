import { lang, section, card } from '../helpers';

export default lang({
  id: "javascript", name: "JavaScript", ext: ".js", year: 1995, common: true,
  sections: [
    section("basics", "basics", [
      card("variables", {
        beginner: {
          explanation: "Variables store values. JavaScript has three ways to make them: const (value can never change), let (value can change), and var (old way, avoid it). Always start with const and switch to let only if you need to change the value.",
          code: `const name = "Alice";   // can't be reassigned
let   age  = 25;        // can be reassigned
// var is old — don't use it, it causes weird bugs

age = 26;               // ok — let allows this
// name = "Bob";        // ERROR — const doesn't allow this

// JavaScript figures out the type automatically
const num    = 42;          // number
const text   = "hello";     // string
const flag   = true;        // boolean
const empty  = null;        // intentionally empty
const undef  = undefined;   // not set yet

console.log(name);          // Alice
console.log(typeof num);    // "number"`,
          examples: [
            { input: `const x = 5;\nconsole.log(x * 2);`, output: `10` },
            { input: `let count = 0;\ncount++;\nconsole.log(count);`, output: `1` },
          ],
          note: "const doesn't mean the value is frozen — it means the variable can't be reassigned. const arr = [1,2,3] still lets you do arr.push(4). it just stops you from doing arr = [5,6,7]",
        },
        intermediate: {
          explanation: "JavaScript is dynamically typed and has some quirky type coercion rules. Always use === (strict equality) instead of == (loose equality) to avoid surprises. Understand null vs undefined — null means 'intentionally empty', undefined means 'not yet set'.",
          code: `// == does type coercion — surprising results
0  == false   // true  — loose equality, avoid
0  === false  // false — strict equality, use this
"" == false   // true
"" === false  // false

// null vs undefined
let x;          // x is undefined — not set
let y = null;   // y is null — deliberately empty
x == y          // true  (both "nothing")
x === y         // false (different types)

// nullish coalescing — only falls back on null/undefined
const val = user.name ?? "Anonymous";
// val is "Anonymous" only if user.name is null or undefined
// unlike ||, it doesn't fall back on 0, "", or false

// optional chaining — safe access on possibly null objects
user?.address?.city  // undefined if user or address is null
arr?.[0]             // undefined if arr is null`,
          examples: [
            { input: `null ?? "default"`, output: `"default"` },
            { input: `0 ?? "default"`, output: `0  // 0 is not null/undefined!` },
            { input: `0 || "default"`, output: `"default"  // || treats 0 as falsy` },
          ],
          note: "?? and || look similar but behave differently. ?? only triggers on null/undefined. || triggers on any falsy value (0, '', false, null, undefined). Use ?? when 0 or empty string are valid values",
        },
        advanced: {
          explanation: "JavaScript's type system has quirks that trip up everyone. typeof null returns 'object' (a famous bug kept for compatibility). NaN is the only value that doesn't equal itself. Understanding these prevents subtle bugs.",
          code: `// famous JavaScript quirks
typeof null          // "object" — known bug, kept forever
typeof undefined     // "undefined"
typeof []            // "object" — arrays are objects
Array.isArray([])    // true — use this to check for arrays

// NaN — "Not a Number", but typeof NaN === "number"
NaN === NaN          // false — NaN doesn't equal itself!
Number.isNaN(NaN)    // true — correct way to check

// type coercion in arithmetic
"5" + 3              // "53" — + triggers string concat
"5" - 3              // 2    — - forces number conversion
+"5"                 // 5    — unary + converts to number

// Object.is — even stricter than ===
Object.is(NaN, NaN)  // true  — finally!
Object.is(0, -0)     // false — === says true
0 === -0             // true  — === lies about -0`,
          examples: [
            { input: `typeof [] === "object"`, output: `true  // use Array.isArray() instead` },
            { input: `NaN === NaN`, output: `false  // 🤦` },
            { input: `Number.isNaN(NaN)`, output: `true  // correct` },
          ],
          note: "always use Array.isArray() to check if something is an array — typeof returns 'object' for both arrays and objects",
        },
      }),

      card("functions", {
        beginner: {
          explanation: "Functions let you package code into a reusable block with a name. You can define them with the function keyword or with arrow syntax (=>). Arrow functions are shorter and are preferred in modern JavaScript.",
          code: `// regular function
function greet(name) {
    return "Hello, " + name + "!";
}

// arrow function — shorter, modern style
const greet = (name) => {
    return "Hello, " + name + "!";
};

// even shorter — if the body is just a return, skip the braces
const greet = (name) => "Hello, " + name + "!";
const square = x => x * x;   // one param = skip parens too

// call them
console.log(greet("Alice"));  // Hello, Alice!
console.log(square(7));       // 49

// default parameters
const greet = (name = "World") => \`Hello, \${name}!\`;
greet();          // Hello, World!
greet("Alice");   // Hello, Alice!`,
          examples: [
            { input: `const add = (a, b) => a + b;\nadd(3, 5);`, output: `8` },
            { input: `const double = x => x * 2;\n[1,2,3].map(double);`, output: `[2, 4, 6]` },
          ],
          note: "arrow functions don't have their own 'this' — they inherit it from the surrounding code. regular functions create their own 'this'. this matters a lot inside class methods and event handlers",
        },
        intermediate: {
          explanation: "Functions in JavaScript are first-class values — you can store them in variables, pass them as arguments, and return them from other functions. This is used everywhere in modern JS.",
          code: `// higher-order functions — take or return functions
const apply = (fn, values) => values.map(fn);
apply(x => x * 2, [1, 2, 3]);   // [2, 4, 6]

// rest parameters — collect extra args into array
const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);
sum(1, 2, 3, 4, 5);    // 15

// destructuring parameters — unpack objects/arrays
const greet = ({ name, age }) => \`\${name} is \${age}\`;
greet({ name: "Alice", age: 25 });

// immediately invoked function expression (IIFE)
const result = (() => {
    const x = 10;
    return x * 2;
})();   // runs immediately, x is not in outer scope

// closures — function remembers its surrounding scope
const makeCounter = () => {
    let count = 0;
    return () => ++count;
};
const counter = makeCounter();
counter();  // 1
counter();  // 2`,
          examples: [
            { input: `const add = x => y => x + y;\nconst add5 = add(5);\nadd5(3);`, output: `8  // curried function` },
          ],
        },
        advanced: {
          explanation: "Async functions and the event loop are central to JavaScript. async/await makes asynchronous code look synchronous. Promise.all runs multiple async operations at the same time instead of one after another.",
          code: `// async/await — write async code that reads like sync code
async function fetchUser(id) {
    const res  = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json();
}

// sequential — slow, each waits for the previous
const user  = await fetchUser(1);
const posts = await fetchPosts(1);

// parallel — fast, both run at the same time
const [user, posts] = await Promise.all([
    fetchUser(1),
    fetchPosts(1),
]);

// Promise.allSettled — don't fail if one fails
const results = await Promise.allSettled([
    fetchUser(1),
    fetchUser(999),   // might fail
]);
results.forEach(r => {
    if (r.status === "fulfilled") use(r.value);
    else console.error(r.reason);
});`,
          examples: [
            { input: `// sequential: total = time(A) + time(B)\nconst a = await taskA();\nconst b = await taskB();`, output: `slow` },
            { input: `// parallel: total = max(time(A), time(B))\nconst [a, b] = await Promise.all([taskA(), taskB()]);`, output: `fast` },
          ],
          note: "await only works inside async functions. if you need it at the top level of a module (not in a function), modern JS supports top-level await",
        },
      }),

      card("arrays", {
        beginner: {
          explanation: "Arrays hold lists of items in order. You access items by their position, starting at 0. JavaScript arrays can hold any mix of types and can grow or shrink dynamically.",
          code: `const fruits = ["apple", "banana", "cherry"];

// access by position (starts at 0)
console.log(fruits[0]);    // apple
console.log(fruits[2]);    // cherry
console.log(fruits.length);// 3

// add and remove
fruits.push("mango");       // add to end
fruits.pop();               // remove from end
fruits.unshift("grape");    // add to beginning
fruits.shift();             // remove from beginning

// check if something is in the array
fruits.includes("banana");  // true

// find the position of an item
fruits.indexOf("cherry");   // 2 (or -1 if not found)

// loop through
for (const fruit of fruits) {
    console.log(fruit);
}`,
          examples: [
            { input: `const nums = [10, 20, 30];\nconsole.log(nums[0], nums[nums.length-1]);`, output: `10 30` },
            { input: `const arr = [1,2,3];\narr.push(4);\nconsole.log(arr);`, output: `[1, 2, 3, 4]` },
          ],
          note: "arrays in JavaScript are technically objects. that's why typeof [] returns 'object'. use Array.isArray(x) to check if something is actually an array",
        },
        intermediate: {
          explanation: "The array methods map, filter, and reduce are the backbone of functional JavaScript. They each return a new array (or value) instead of changing the original.",
          code: `const nums = [1, 2, 3, 4, 5, 6];

// map — transform every element, get new array
nums.map(x => x * 2);           // [2,4,6,8,10,12]
nums.map(x => ({ value: x }));  // array of objects

// filter — keep elements that pass the test
nums.filter(x => x % 2 === 0);  // [2, 4, 6]
nums.filter(x => x > 3);        // [4, 5, 6]

// reduce — fold array into a single value
nums.reduce((sum, x) => sum + x, 0);     // 21 (sum)
nums.reduce((max, x) => x > max ? x : max, -Infinity); // 6

// chain them together
nums
    .filter(x => x % 2 === 0)  // [2, 4, 6]
    .map(x => x * x)            // [4, 16, 36]
    .reduce((a, b) => a + b, 0) // 56

// find — return first matching element
nums.find(x => x > 3);          // 4
nums.findIndex(x => x > 3);     // 3 (the index)
nums.some(x => x > 5);          // true — any match?
nums.every(x => x > 0);         // true — all match?`,
          examples: [
            { input: `[1,2,3,4,5].filter(x=>x%2===0).map(x=>x*x)`, output: `[4, 16]` },
            { input: `["a","bb","ccc"].reduce((longest,s)=>s.length>longest.length?s:longest,"")`, output: `"ccc"` },
          ],
        },
        advanced: {
          explanation: "Spread, destructuring, and flat/flatMap are powerful for working with complex data. Understanding these makes it much easier to transform API data into what your UI needs.",
          code: `// spread — expand array into individual elements
const a = [1, 2, 3];
const b = [...a, 4, 5];           // [1,2,3,4,5]
const copy = [...a];              // shallow copy

// destructuring — unpack values into variables
const [first, second, ...rest] = [10, 20, 30, 40, 50];
// first=10, second=20, rest=[30,40,50]

const [,, third] = [1, 2, 3];    // skip first two

// flat — collapse nested arrays
[1, [2, [3, [4]]]].flat()        // [1, 2, [3, [4]]]  depth 1
[1, [2, [3, [4]]]].flat(Infinity)// [1, 2, 3, 4]  fully flat

// flatMap — map then flatten one level
[[1,2],[3,4]].flatMap(x => x)    // [1,2,3,4]
["hello","world"].flatMap(w => w.split(""))
// ["h","e","l","l","o","w","o","r","l","d"]

// Array.from — create array from anything iterable
Array.from("hello")              // ["h","e","l","l","o"]
Array.from({length: 5}, (_, i) => i)  // [0,1,2,3,4]`,
          examples: [
            { input: `[1,[2,[3]]].flat(Infinity)`, output: `[1, 2, 3]` },
            { input: `Array.from({length:5},(_,i)=>i*2)`, output: `[0, 2, 4, 6, 8]` },
          ],
        },
      }),

      card("objects", {
        beginner: {
          explanation: "An object stores data as key-value pairs. Like a real-world thing that has properties — a car has a color, a speed, a model. You access properties with a dot or with square brackets.",
          code: `const person = {
    name: "Alice",
    age:  25,
    city: "Boston"
};

// access properties
console.log(person.name);      // Alice — dot notation
console.log(person["age"]);    // 25 — bracket notation

// add or change properties
person.email = "alice@example.com";
person.age   = 26;

// remove a property
delete person.city;

// check if property exists
"name" in person     // true
"phone" in person    // false

// loop through properties
for (const key in person) {
    console.log(key, ":", person[key]);
}`,
          examples: [
            { input: `const obj = {x:10, y:20};\nconsole.log(obj.x + obj.y);`, output: `30` },
          ],
          note: "dot notation (obj.name) and bracket notation (obj['name']) do the same thing. use brackets when the key is in a variable or has special characters",
        },
        intermediate: {
          explanation: "Modern JavaScript has shorthand syntax, computed keys, destructuring, and spread for objects. These make working with objects much less verbose.",
          code: `// shorthand when variable name matches key
const name = "Alice";
const age  = 25;
const person = { name, age };  // same as { name: name, age: age }

// computed property names
const key = "dynamicKey";
const obj = { [key]: "value" };  // { dynamicKey: "value" }

// destructuring — pull properties into variables
const { name, age } = person;
const { name: alias } = person;   // rename while destructuring
const { city = "Unknown" } = person; // default if missing

// spread — shallow copy or merge objects
const copy   = { ...person };
const merged = { ...person, ...extra, override: true };

// Object methods
Object.keys(person)    // ["name", "age"]
Object.values(person)  // ["Alice", 25]
Object.entries(person) // [["name","Alice"], ["age",25]]
Object.fromEntries([["a",1],["b",2]])  // { a:1, b:2 }`,
          examples: [
            { input: `const {x=0,y=0} = {x:5};\nconsole.log(x,y);`, output: `5 0  // y uses default` },
            { input: `Object.fromEntries(Object.entries({a:1,b:2}).map(([k,v])=>[k,v*2]))`, output: `{a:2, b:4}` },
          ],
        },
        advanced: {
          explanation: "Objects in JavaScript are prototypal. Every object has a hidden __proto__ link to another object (its prototype). Classes in JS are syntactic sugar over this prototype chain.",
          code: `// classes are syntax sugar over prototypes
class Animal {
    #name;  // private field — truly private (can't access outside class)
    #sound;

    constructor(name, sound) {
        this.#name  = name;
        this.#sound = sound;
    }

    get name() { return this.#name; }  // getter

    speak() {
        return \`\${this.#name} says \${this.#sound}\`;
    }

    static create(name, sound) {       // static — called on class, not instance
        return new Animal(name, sound);
    }
}

class Dog extends Animal {
    fetch(item) {
        return \`\${this.name} fetches the \${item}!\`;
    }
}

const d = new Dog("Rex", "woof");
d.speak();    // "Rex says woof"
d.#name;      // SyntaxError — private!`,
          examples: [
            { input: `class Counter {\n  #n = 0;\n  inc() { this.#n++; }\n  get value() { return this.#n; }\n}\nconst c = new Counter();\nc.inc(); c.inc();\nc.value;`, output: `2` },
          ],
          note: "private fields (#name) are truly private — unlike the old convention of _name which was just a hint. nothing outside the class can access them",
        },
      }),
    ]),

    section("async", "async", [
      card("promises + async/await", {
        beginner: {
          explanation: "JavaScript runs one thing at a time, but needs to wait for slow things (network requests, timers, file reads) without blocking everything else. Promises represent a value that will arrive later. async/await makes working with them look like normal code.",
          code: `// async function — always returns a promise
async function getUser(id) {
    // await pauses this function until the promise resolves
    const response = await fetch(\`/api/users/\${id}\`);
    const user     = await response.json();
    return user;
}

// call it with await (must be inside an async function)
async function main() {
    const user = await getUser(1);
    console.log(user.name);
}

// handle errors with try/catch
async function safeGet(id) {
    try {
        const user = await getUser(id);
        return user;
    } catch (error) {
        console.log("failed:", error.message);
        return null;
    }
}`,
          examples: [
            { input: `async function wait(ms) {\n    return new Promise(r => setTimeout(r, ms));\n}\nawait wait(1000);\nconsole.log("1 second later");`, output: `(waits 1 second)\n1 second later` },
          ],
          note: "if you forget await, you get a Promise object instead of the actual value. console.log(fetchUser(1)) will print Promise { <pending> } not the user",
        },
        intermediate: {
          explanation: "Running async operations in parallel with Promise.all is much faster than running them one after another. Promise.allSettled waits for all to finish without failing if one fails.",
          code: `// sequential — each waits for the previous
// total time = time(A) + time(B) + time(C)
const a = await taskA();
const b = await taskB();
const c = await taskC();

// parallel — all run at the same time
// total time = slowest of A, B, C
const [a, b, c] = await Promise.all([taskA(), taskB(), taskC()]);

// allSettled — don't fail if one fails, get all results
const results = await Promise.allSettled([taskA(), taskB()]);
results.forEach(result => {
    if (result.status === "fulfilled") {
        console.log("success:", result.value);
    } else {
        console.log("failed:", result.reason);
    }
});

// race — resolve with whichever settles first
const data = await Promise.race([
    fetch("/fast-server"),
    fetch("/backup-server"),
]);`,
          examples: [
            { input: `// 3 x 1-second tasks\n// sequential: 3s total\n// parallel:   1s total\nconst [a,b,c] = await Promise.all([t1(), t2(), t3()]);`, output: `~1 second` },
          ],
        },
        advanced: {
          explanation: "AbortController lets you cancel fetch requests. Async generators produce values asynchronously one at a time — useful for streaming data from an API.",
          code: `// AbortController — cancel a fetch request
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
    const res = await fetch("/api/data", {
        signal: controller.signal
    });
    const data = await res.json();
    clearTimeout(timeout);
} catch (e) {
    if (e.name === "AbortError") console.log("request cancelled");
    else throw e;
}

// async generator — produce values asynchronously
async function* streamLines(url) {
    const res    = await fetch(url);
    const reader = res.body.getReader();
    const dec    = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield dec.decode(value);  // yield each chunk as it arrives
    }
}

for await (const line of streamLines("/api/stream")) {
    console.log(line);  // process each chunk as it arrives
}`,
          examples: [
            { input: `async function* range(n) {\n  for(let i=0;i<n;i++) yield i;\n}\nfor await (const n of range(3)) console.log(n);`, output: `0\n1\n2` },
          ],
        },
      }),
    ]),
  ],
});
