import { lang, section, card } from '../helpers';

export default lang({
  id: "typescript", name: "TypeScript", ext: ".ts", year: 2012, common: true,
  sections: [
    section("basics", "basics", [
      card("what TypeScript is", {
        beginner: {
          explanation: "TypeScript is JavaScript with types added on top. You write TypeScript, and it gets converted (compiled) to regular JavaScript that browsers can run. The benefit: TypeScript catches mistakes before you run your code, like trying to add a number to a person's name.",
          code: `// JavaScript — no type checking
function greet(name) {
    return "Hello, " + name.toUpperCase();
}
greet(42);   // runs but crashes: numbers have no toUpperCase

// TypeScript — catches the mistake before running
function greet(name: string): string {
    return "Hello, " + name.toUpperCase();
}
greet(42);   // ERROR at compile time: number is not a string
greet("Alice");  // fine — "HELLO, ALICE"

// basic type annotations
let name: string  = "Alice";
let age:  number  = 25;
let flag: boolean = true;`,
          examples: [
            { input: `const add = (a: number, b: number): number => a + b;\nadd(2, 3);`, output: `5` },
            { input: `const add = (a: number, b: number): number => a + b;\nadd("2", 3);`, output: `ERROR: Argument of type 'string' is not assignable to parameter of type 'number'` },
          ],
          note: "TypeScript only checks types at compile time — by the time your code runs it's plain JavaScript. if you pass a wrong type at runtime from external data (like an API), TypeScript won't save you — you still need runtime validation",
        },
        intermediate: {
          explanation: "TypeScript's type system is structural — if something has the right shape, it's considered the right type. Union types (|) let a value be one of several types. Intersection types (&) combine types.",
          code: `// union type — can be one or the other
type ID = number | string;
let userId: ID = 123;
userId = "abc-123";  // also fine

// literal types — only specific values allowed
type Direction = "north" | "south" | "east" | "west";
type DiceRoll  = 1 | 2 | 3 | 4 | 5 | 6;

// type alias — name a type so you can reuse it
type Point = { x: number; y: number };

// interface — similar to type alias, but for objects
interface User {
    id:     number;
    name:   string;
    email?: string;    // ? means optional
}

// intersection — combine types
type Admin = User & { role: "admin"; permissions: string[] };

// type narrowing — TypeScript tracks what you check
function format(val: string | number) {
    if (typeof val === "string") {
        return val.toUpperCase();  // TS knows it's string here
    }
    return val.toFixed(2);         // TS knows it's number here
}`,
          examples: [
            { input: `type Color = "red" | "green" | "blue";\nconst c: Color = "red";   // ok\nconst d: Color = "purple"; // ERROR`, output: `Type '"purple"' is not assignable to type 'Color'` },
          ],
        },
        advanced: {
          explanation: "Generic types let you write functions and types that work with any type while still being type-safe. Think of generics like a placeholder that gets filled in when you actually use the function.",
          code: `// generic function — T is a placeholder for any type
function first<T>(arr: T[]): T | undefined {
    return arr[0];
}
first([1, 2, 3]);         // returns number
first(["a", "b"]);        // returns string

// generic with constraints — T must have certain shape
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
const user = { name: "Alice", age: 25 };
getProperty(user, "name");  // string
getProperty(user, "age");   // number
getProperty(user, "email"); // ERROR — email doesn't exist

// utility types built into TypeScript
type ReadonlyUser   = Readonly<User>;        // all fields readonly
type PartialUser    = Partial<User>;         // all fields optional
type RequiredUser   = Required<User>;        // all fields required
type NameOnly       = Pick<User, "name">;    // only name field
type NoEmail        = Omit<User, "email">;   // everything except email
type UserOrNull     = Nullable<User>;        // User | null

// conditional types
type IsArray<T> = T extends any[] ? true : false;
// IsArray<number[]>  → true
// IsArray<number>    → false`,
          examples: [
            { input: `function wrap<T>(val: T): { value: T } {\n  return { value: val };\n}\nwrap(42);    // { value: number }\nwrap("hi");  // { value: string }`, output: `TypeScript infers the return type correctly` },
          ],
          note: "when TypeScript can't infer a type and you're sure about it, you can assert it with 'as': (response as User).name. only use this when you genuinely know better than TypeScript",
        },
      }),

      card("interfaces + types", {
        beginner: {
          explanation: "An interface describes the shape of an object — what properties it has and what types those properties are. If you define a User interface, TypeScript makes sure every User object has exactly the right properties.",
          code: `// interface — describes what an object looks like
interface User {
    name:  string;
    age:   number;
    email: string;
}

// any object with these properties satisfies the interface
const alice: User = {
    name:  "Alice",
    age:   25,
    email: "alice@example.com",
};

// optional properties — use ?
interface Product {
    name:        string;
    price:       number;
    description?: string;   // might or might not be there
}

// function that accepts a User
function greet(user: User): string {
    return \`Hello, \${user.name}!\`;
}

greet(alice);  // fine
greet({ name: "Bob" });  // ERROR — missing age and email`,
          examples: [
            { input: `interface Point { x: number; y: number; }\nconst p: Point = { x: 3, y: 4 };\nMath.sqrt(p.x**2 + p.y**2);`, output: `5` },
          ],
          note: "TypeScript checks the SHAPE, not the exact type name. if two different interfaces have the same properties, an object satisfies both",
        },
        intermediate: {
          explanation: "Interfaces can extend other interfaces to inherit their properties. Types and interfaces are similar but have some differences — types can represent unions and primitives, interfaces are better for objects you'll extend.",
          code: `// extending an interface
interface Animal {
    name: string;
    age:  number;
}

interface Dog extends Animal {
    breed: string;
    bark(): void;
}

// implement interface in a class
class Labrador implements Dog {
    constructor(
        public name: string,
        public age: number,
        public breed: string,
    ) {}

    bark() { console.log("Woof!"); }
}

// index signature — object with unknown keys
interface StringMap {
    [key: string]: string;
}
const env: StringMap = {
    API_URL: "https://api.example.com",
    API_KEY: "secret",
};

// readonly — prevent mutation
interface Config {
    readonly host: string;
    readonly port: number;
}`,
          examples: [
            { input: `interface ReadonlyPoint { readonly x: number; readonly y: number; }\nconst p: ReadonlyPoint = {x:1,y:2};\np.x = 5;  // ERROR`, output: `Cannot assign to 'x' because it is a read-only property` },
          ],
        },
        advanced: {
          explanation: "Mapped types let you transform an existing type into a new one. Template literal types let you create types from string patterns. These are used internally by TypeScript's built-in utility types.",
          code: `// mapped type — transform every key of a type
type Optional<T> = {
    [K in keyof T]?: T[K];   // same as Partial<T>
};

type Getters<T> = {
    [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
// Getters<{name:string}> → { getName: () => string }

// template literal types
type EventName = "click" | "focus" | "blur";
type Handler   = \`on\${Capitalize<EventName>}\`;
// Handler = "onClick" | "onFocus" | "onBlur"

// discriminated union — type-safe state machine
type LoadingState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: string }
    | { status: "error";   error: Error };

function handle(state: LoadingState) {
    switch (state.status) {
        case "success": return state.data;  // TS knows data exists
        case "error":   return state.error; // TS knows error exists
    }
}`,
          examples: [
            { input: `type Flags<T> = { [K in keyof T]: boolean };\ntype UserFlags = Flags<{name:string; age:number}>;\n// UserFlags = { name: boolean; age: boolean }`, output: `all string values replaced with boolean` },
          ],
          note: "discriminated unions (using a 'status' or 'kind' field) are the TypeScript-idiomatic way to model states that have different data depending on the state",
        },
      }),
    ]),
  ],
});
