import { lang, section, card } from '../helpers';

export default lang({
  id: "zig", name: "Zig", ext: ".zig", year: 2016, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "Zig is a modern systems language designed as a replacement for C. It's used to build extremely fast, safe low-level code. Zig has no hidden control flow, no hidden memory allocation, and no undefined behavior — unlike C, everything surprising is visible in the code. Bun (JavaScript runtime) and many game engines use Zig.",
          code: `const std = @import("std");

pub fn main() void {
    // const = immutable, var = mutable
    const name: []const u8 = "Alice";
    var age: i32 = 25;

    age += 1;   // ok — var allows mutation

    // print
    std.debug.print("Hello, {s}!\n", .{name});
    std.debug.print("Age: {d}\n", .{age});

    // Zig has MANY integer types:
    const a: u8  = 255;   // unsigned 8-bit (0-255)
    const b: i32 = -42;   // signed 32-bit
    const c: u64 = 9999;  // unsigned 64-bit
    const d: f64 = 3.14;  // 64-bit float

    // comptime — evaluated at compile time
    const KB: comptime_int = 1024;
    const MB = KB * KB;   // computed at compile time
}`,
          examples: [
            { input: `zig run hello.zig`, output: `Hello, Alice!\nAge: 26` },
          ],
          note: "in Zig, u8 means unsigned 8-bit integer, i32 means signed 32-bit, f64 means 64-bit float. the types are explicit so you always know exactly how much memory you're using",
        },
        intermediate: {
          explanation: "Zig's error handling uses error unions — a value is either the expected type OR an error. You must handle errors explicitly — you can't ignore them like in C where you'd forget to check return codes.",
          code: `const std = @import("std");

// error set — define possible errors
const FileError = error{
    NotFound,
    PermissionDenied,
    DiskFull,
};

// function that might fail — ! means returns error union
fn readNumber(path: []const u8) !i32 {
    const file = try std.fs.cwd().openFile(path, .{});
    // 'try' = if error, return it immediately (like ? in Rust)
    defer file.close();    // defer = runs when function exits

    var buf: [100]u8 = undefined;
    const bytes = try file.read(&buf);
    return try std.fmt.parseInt(i32, buf[0..bytes], 10);
}

pub fn main() !void {
    // catch — handle the error explicitly
    const n = readNumber("num.txt") catch |err| {
        std.debug.print("error: {}\n", .{err});
        return;
    };
    std.debug.print("number: {d}\n", .{n});
}

// optional — might have a value or null
fn findItem(items: []const i32, target: i32) ?usize {
    for (items, 0..) |item, i| {
        if (item == target) return i;
    }
    return null;
}`,
          examples: [
            { input: `const x: ?i32 = null;\nif (x) |val| { // val is i32, not ?i32\n    use(val);\n}`, output: `safe optional handling` },
          ],
          note: "try is shorthand for 'if this returns an error, return that error from the current function'. it's Zig's version of Rust's ? operator. it makes error propagation clean and visible",
        },
        advanced: {
          explanation: "Zig's comptime (compile-time) is more powerful than C preprocessor macros or C++ templates — it's actual Zig code that runs at compile time to generate other code. This enables generic types without any special syntax.",
          code: `const std = @import("std");

// comptime — generic type without any special syntax
fn Stack(comptime T: type) type {
    return struct {
        items: []T,
        len: usize,

        const Self = @This();

        pub fn push(self: *Self, item: T) void {
            self.items[self.len] = item;
            self.len += 1;
        }

        pub fn pop(self: *Self) ?T {
            if (self.len == 0) return null;
            self.len -= 1;
            return self.items[self.len];
        }
    };
}

const IntStack = Stack(i32);  // creates a concrete type at compile time
const FloatStack = Stack(f64);

// comptime function — runs at compile time
fn fibonacci(comptime n: u32) u64 {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
const fib10 = fibonacci(10);  // computed at compile time, no runtime cost

// inline assembly — call CPU instructions directly
fn cpuId() u32 {
    return asm ("cpuid"
        : [ret] "={eax}" (-> u32)
        : [id] "{eax}" (@as(u32, 0))
        : "ebx", "ecx", "edx"
    );
}`,
          examples: [
            { input: `const IntStack = Stack(i32);\nconst FloatStack = Stack(f64);\n// two different types generated at compile time`, output: `zero runtime overhead, no boxing` },
          ],
          note: "comptime in Zig replaces C++ templates, C macros, and Rust's const generics with a unified system. any code you can write in Zig, you can run at comptime to generate types and constants",
        },
      }),
    ]),
  ],
});
