import { lang, section, card } from '../helpers';

export default lang({
  id: "c", name: "C", ext: ".c", year: 1972, common: true,
  sections: [
    section("basics", "basics", [
      card("hello world + compilation", {
        beginner: {
          explanation: "C is compiled — you write code, run a compiler that translates it to machine instructions, then run the result. Unlike Python where you just run the file, C needs this extra step. But the result is extremely fast code.",
          code: `// every C program starts with includes — these bring in built-in tools
#include <stdio.h>   // stdio = standard input/output (gives us printf)

// int main() is where your program starts running
// int means it returns a number — 0 means success
int main() {
    printf("Hello, World!\\n");  // print text, \\n is newline
    return 0;                    // 0 = success, anything else = error
}`,
          examples: [
            { input: `gcc hello.c -o hello   # compile\n./hello                # run`, output: `Hello, World!` },
          ],
          note: "gcc is the compiler. -o hello means 'name the output file hello'. on Windows you'd run hello.exe. always compile with -Wall to see warnings: gcc -Wall hello.c -o hello",
        },
        intermediate: {
          explanation: "C gives you explicit control over everything. The compilation process has multiple stages: preprocessing (#include expands files), compiling (to assembly), assembling (to machine code), and linking (combines object files).",
          code: `#include <stdio.h>
#include <stdlib.h>  // malloc, free, exit
#include <string.h>  // strlen, strcpy, memcpy

int main(int argc, char *argv[]) {
    // argc = argument count, argv = argument values
    // argv[0] is always the program name
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <name>\\n", argv[0]);
        return 1;   // non-zero = error
    }
    printf("Hello, %s!\\n", argv[1]);
    return 0;
}

// compile with full warnings
// gcc -Wall -Wextra -std=c11 -O2 prog.c -o prog`,
          examples: [
            { input: `./prog Alice`, output: `Hello, Alice!` },
            { input: `./prog`, output: `Usage: ./prog <name>  (exits with code 1)` },
          ],
        },
        advanced: {
          explanation: "Understanding the compilation pipeline lets you optimize builds, use link-time optimization, and debug weird linker errors. Separate compilation means you compile each .c file independently and link them together.",
          code: `// header file (math_utils.h) — declarations
#ifndef MATH_UTILS_H    // include guard — prevents double-inclusion
#define MATH_UTILS_H

int add(int a, int b);  // declaration: tells compiler the function exists
int square(int x);

#endif

// source file (math_utils.c) — definitions
#include "math_utils.h"

int add(int a, int b) { return a + b; }      // definition: actual code
int square(int x)     { return x * x; }

// main.c
#include <stdio.h>
#include "math_utils.h"

int main() {
    printf("%d\\n", add(3, square(4)));  // 19
}

// compile separately then link:
// gcc -c math_utils.c -o math_utils.o  (compile to object file)
// gcc -c main.c -o main.o
// gcc math_utils.o main.o -o program   (link)`,
          examples: [
            { input: `gcc -c math_utils.c -o math_utils.o\ngcc main.o math_utils.o -o program\n./program`, output: `19` },
          ],
          note: "include guards (#ifndef/#define/#endif) prevent a header from being included twice in the same compilation unit, which would cause 'duplicate declaration' errors",
        },
      }),

      card("types + variables", {
        beginner: {
          explanation: "In C you must declare every variable with its type before using it. The type determines how many bytes of memory it uses and what operations are valid on it.",
          code: `#include <stdio.h>

int main() {
    // basic types
    int    age    = 25;       // whole number, usually 4 bytes
    float  price  = 9.99f;   // decimal, 4 bytes, f suffix required
    double pi     = 3.14159; // decimal, 8 bytes — more precise
    char   grade  = 'A';     // single character, 1 byte

    // print them with format specifiers
    printf("age:   %d\\n", age);    // %d = integer
    printf("price: %f\\n", price);  // %f = float/double
    printf("pi:    %.2f\\n", pi);   // .2 = 2 decimal places
    printf("grade: %c\\n", grade);  // %c = character

    return 0;
}`,
          examples: [
            { input: `printf("%.2f", 3.14159);`, output: `3.14` },
            { input: `printf("%d", 'A');`, output: `65  // 'A' is stored as number 65` },
          ],
          note: "char stores a number from -128 to 127, which represents a character via ASCII. 'A' is 65, 'a' is 97, '0' is 48",
        },
        intermediate: {
          explanation: "Plain int has different sizes on different platforms. For any code that deals with binary data, files, or network — always use fixed-width types from <stdint.h> so you know exactly how many bits you're working with.",
          code: `#include <stdint.h>   // fixed-width types
#include <stdbool.h>  // bool type

// guaranteed sizes regardless of platform
uint8_t  byte  = 255;       // 0 to 255 (unsigned 8-bit)
int8_t   sbyte = -128;      // -128 to 127 (signed 8-bit)
uint16_t port  = 8080;      // 0 to 65535
int32_t  word  = -1;        // always 32 bits signed
uint64_t big   = 0xDEADBEEFULL; // 64-bit unsigned

// bool in C (from stdbool.h)
bool found = false;
bool valid = true;

// size_t — correct type for sizes and counts
size_t length = 42;   // always the right size for memory/array indices

// check actual sizes on your platform
printf("int is %zu bytes\\n", sizeof(int));       // probably 4
printf("long is %zu bytes\\n", sizeof(long));     // 4 or 8
printf("pointer is %zu bytes\\n", sizeof(void*)); // 4 or 8`,
          examples: [
            { input: `printf("%zu", sizeof(uint64_t));`, output: `8  // always 8 bytes` },
          ],
          note: "use size_t for anything that represents a size or array index — it's the correct unsigned type for your platform (32-bit or 64-bit)",
        },
        advanced: {
          explanation: "C has undefined behavior (UB) — things that the standard says 'do whatever'. Signed integer overflow is UB. Accessing out-of-bounds array is UB. The compiler can assume UB never happens and optimize aggressively around it, causing bizarre bugs.",
          code: `#include <limits.h>
#include <stdint.h>

// signed overflow is UNDEFINED BEHAVIOR
int x = INT_MAX;
x++;     // UB — compiler can do anything, often wraps but not guaranteed

// unsigned overflow is DEFINED — always wraps
uint32_t y = UINT32_MAX;
y++;     // always 0 — defined behavior

// safe way to check for overflow before it happens
bool would_overflow(int a, int b) {
    // if a > 0 and b > INT_MAX - a, they'd overflow
    return (a > 0 && b > INT_MAX - a) ||
           (a < 0 && b < INT_MIN - a);
}

// type punning — reading the same bytes as a different type
// ONLY safe with memcpy, not casts
float f = 1.0f;
uint32_t bits;
memcpy(&bits, &f, sizeof(f));  // safe: reads float bits as uint32
// bits = 0x3F800000 (IEEE 754 representation of 1.0)`,
          examples: [
            { input: `uint32_t x = UINT32_MAX;\nprintf("%u\\n", x + 1);`, output: `0  // wraps around, defined` },
          ],
          note: "compile with -fsanitize=address,undefined to catch UB at runtime. the sanitizer adds checks that will crash the program and print exactly what went wrong",
        },
      }),

      card("pointers", {
        beginner: {
          explanation: "A pointer is a variable that stores a memory address — the location of another variable in RAM. The & operator gets the address of a variable. The * operator reads the value at an address (called dereferencing).",
          code: `#include <stdio.h>

int main() {
    int x = 42;

    // & means "address of" — gives you where x lives in memory
    int *ptr = &x;   // ptr stores the address of x

    // print the address and the value at that address
    printf("address: %p\\n", ptr);   // something like 0x7ff...
    printf("value:   %d\\n", *ptr);  // 42 — * reads value at address

    // * on the left side WRITES to the address
    *ptr = 100;
    printf("x is now: %d\\n", x);    // 100 — x changed!

    // null pointer — points to nothing
    int *nothing = NULL;
    // *nothing = 5;  // CRASH — never dereference NULL

    return 0;
}`,
          examples: [
            { input: `int x = 5;\nint *p = &x;\n*p = 99;\nprintf("%d", x);`, output: `99  // x changed through pointer` },
          ],
          note: "think of a pointer as a house address written on a piece of paper. & writes the address down. * goes to that address. dereferencing NULL is like going to address '0' — it doesn't exist",
        },
        intermediate: {
          explanation: "Pointers to functions let you store and call functions through a variable. Pointer arithmetic lets you navigate arrays. Passing a pointer to a function lets it modify a variable in the caller.",
          code: `#include <stdio.h>

// passing pointer so function can modify the variable
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

// arrays and pointer arithmetic
int arr[] = {10, 20, 30, 40, 50};
int *p = arr;           // p points to arr[0]
printf("%d\\n", *p);    // 10
printf("%d\\n", *(p+2));// 30 — p+2 points to arr[2]
p++;                    // move to next element
printf("%d\\n", *p);    // 20

// function pointer — store a function in a variable
int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int (*operation)(int, int) = add;   // point to add
printf("%d\\n", operation(3, 4));   // 7
operation = mul;
printf("%d\\n", operation(3, 4));   // 12`,
          examples: [
            { input: `int a=5, b=10;\nswap(&a, &b);\nprintf("%d %d", a, b);`, output: `10 5` },
          ],
        },
        advanced: {
          explanation: "Const correctness prevents bugs by marking pointers that shouldn't modify what they point to. const int *p means you can't change *p. int * const p means you can't change p itself.",
          code: `// const pointer variations
int x = 10;
const int *p1 = &x;  // pointer to const int — can't change *p1
int *const p2 = &x;  // const pointer to int — can't change p2
const int *const p3 = &x;  // can't change either

*p1 = 5;  // ERROR — *p1 is const
p1 = NULL;// OK    — p1 itself can change
*p2 = 5;  // OK    — *p2 can change
p2 = NULL;// ERROR — p2 is const

// void pointer — points to anything
void *generic = &x;
int *specific = (int*)generic;  // cast to use it

// restrict — promise that pointer is the only way to access this memory
// lets compiler optimize more aggressively
void copy(int *restrict dst, const int *restrict src, size_t n) {
    for (size_t i = 0; i < n; i++) dst[i] = src[i];
}`,
          examples: [
            { input: `const char *str = "hello";\nstr[0] = 'H';  // CRASH — string literal is read-only`, output: `segmentation fault` },
          ],
          note: "read pointer declarations right to left: 'const int *p' = 'p is a pointer to const int'. 'int *const p' = 'p is a const pointer to int'",
        },
      }),

      card("memory management", {
        beginner: {
          explanation: "In C you manage memory yourself. malloc asks the OS for a block of memory and gives you a pointer to it. When you're done, you must call free to give it back. Forgetting to free is called a memory leak.",
          code: `#include <stdio.h>
#include <stdlib.h>  // malloc, calloc, realloc, free

int main() {
    // malloc — allocate memory, returns pointer or NULL if failed
    int *arr = malloc(5 * sizeof(int));  // space for 5 ints
    if (arr == NULL) {
        printf("out of memory!\\n");
        return 1;
    }

    // fill the array
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }

    // print it
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);  // 0 10 20 30 40
    }

    // MUST free when done
    free(arr);
    arr = NULL;  // set to NULL to avoid accidental use after free

    return 0;
}`,
          examples: [
            { input: `int *p = malloc(sizeof(int));\n*p = 42;\nprintf("%d", *p);\nfree(p);`, output: `42` },
          ],
          note: "always check if malloc returned NULL — on low-memory systems it can fail. always free everything you malloc. always set the pointer to NULL after freeing",
        },
        intermediate: {
          explanation: "calloc zeroes the memory (malloc doesn't). realloc resizes an allocation. Using memory after freeing it or accessing out-of-bounds causes undefined behavior — the program might crash, corrupt data, or silently give wrong results.",
          code: `#include <stdlib.h>
#include <string.h>

// calloc — allocate AND zero-initialize
int *arr = calloc(5, sizeof(int));  // all zeros guaranteed

// realloc — resize existing allocation
arr = realloc(arr, 10 * sizeof(int));  // grow to 10 ints
if (arr == NULL) { /* old arr is gone — handle error */ }

// common mistake: don't assign directly to same pointer
// if realloc fails it returns NULL AND you lose the original
// int *arr = realloc(arr, bigger);  // WRONG — loses original on failure
// instead:
int *new_arr = realloc(arr, bigger);
if (new_arr) arr = new_arr;
else /* handle failure, arr still valid */;

// duplicate a string (allocates memory)
char *copy = strdup("hello");  // malloc + strcpy in one
// must free(copy) when done`,
          examples: [
            { input: `int *p = calloc(3, sizeof(int));\nprintf("%d %d %d", p[0],p[1],p[2]);\nfree(p);`, output: `0 0 0  // zero-initialized` },
          ],
          note: "use valgrind to find memory leaks and invalid accesses: valgrind --leak-check=full ./program. use -fsanitize=address for faster checking",
        },
        advanced: {
          explanation: "Memory layout matters for performance. Struct padding adds invisible bytes between fields for alignment. You can control this with __attribute__((packed)) but it makes accesses slower.",
          code: `#include <stdint.h>
#include <stdio.h>

// struct with padding — compiler adds gaps for alignment
struct Padded {
    char   a;    // 1 byte
    // 3 bytes padding here so b aligns to 4-byte boundary
    int    b;    // 4 bytes
    char   c;    // 1 byte
    // 3 bytes padding so struct size is multiple of 4
};
// sizeof = 12, not 6!

// reorder fields to minimize padding
struct Efficient {
    int    b;    // 4 bytes
    char   a;    // 1 byte
    char   c;    // 1 byte
    // 2 bytes padding
};
// sizeof = 8, not 12

// force no padding (slower access, but compact)
struct __attribute__((packed)) Packed {
    char  a;
    int   b;
    char  c;
};  // sizeof = 6

// flexible array member — variable-size struct
struct Buffer {
    size_t size;
    uint8_t data[];   // must be last, allocated with malloc
};
struct Buffer *b = malloc(sizeof(struct Buffer) + 256);
b->size = 256;`,
          examples: [
            { input: `struct A { char x; int y; char z; };\nprintf("%zu", sizeof(struct A));`, output: `12  // not 6 — padding added` },
          ],
          note: "struct field order matters for memory usage. put largest fields first, smallest last to minimize padding. this can reduce struct size by 30-50%",
        },
      }),
    ]),
  ],
});
