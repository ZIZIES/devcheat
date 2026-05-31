import { lang, section, card } from '../helpers';

export default lang({
  id: "armasm", name: "ARM ASM", ext: ".s", year: 1985, common: false,
  sections: [
    section("basics", "basics", [
      card("what ARM is", {
        beginner: {
          explanation: "ARM is the instruction set used by almost every phone, tablet, and Apple Silicon Mac. It's also in Raspberry Pi, smart TVs, and embedded devices. ARM uses a RISC design (Reduced Instruction Set) — fewer, simpler instructions than x86. The 64-bit version is called AArch64 or ARM64.",
          code: `// AArch64 (ARM 64-bit) assembly — GNU assembler syntax
// file: hello.s

.global _start    // entry point

.section .data
msg:    .ascii "Hello, World!\\n"
msglen = . - msg  // . = current position, so msglen = length

.section .text
_start:
    // write(1, msg, msglen)
    mov x0, #1           // x0 = 1 = stdout
    ldr x1, =msg         // x1 = address of message
    mov x2, #msglen      // x2 = length
    mov x8, #64          // x8 = syscall number (64 = write on Linux ARM64)
    svc #0               // supervisor call — invoke OS

    // exit(0)
    mov x0, #0           // x0 = 0 = exit code
    mov x8, #93          // x8 = 93 = exit syscall
    svc #0`,
          examples: [
            { input: `as hello.s -o hello.o\nld hello.o -o hello\n./hello`, output: `Hello, World!` },
          ],
          note: "ARM syscall numbers are different from x86. write is 64 on ARM64 Linux but 1 on x86-64 Linux. always check the syscall table for your specific platform",
        },
        intermediate: {
          explanation: "ARM64 has 31 general-purpose registers (x0-x30). The calling convention says which registers hold arguments, which hold the return value, and which you must save before using.",
          code: `// AArch64 registers
// x0-x7   — function arguments and return values
// x8      — indirect result location / syscall number
// x9-x15  — caller-saved temporaries (you can use freely)
// x16,x17 — intra-procedure scratch registers
// x18     — platform register (don't use on some platforms)
// x19-x28 — callee-saved (must save/restore if you use them)
// x29     — frame pointer (like rbp in x86)
// x30     — link register (return address, like rip in x86)
// sp      — stack pointer
// xzr     — zero register (always reads as 0, writes discarded)

// w prefix = 32-bit view of x registers
// x0 = 64-bit, w0 = lower 32 bits of x0

// AAPCS64 calling convention:
// first 8 args: x0-x7
// return value: x0 (and x1 for 128-bit returns)
// caller saves: x0-x15
// callee saves: x19-x28, x29 (fp), x30 (lr)`,
          examples: [
            { input: `// function(a, b, c, d)\nmov x0, #1    // a\nmov x1, #2    // b\nmov x2, #3    // c\nmov x3, #4    // d\nbl my_func    // branch with link (call)\n// result in x0`, output: `up to 8 args in x0-x7, return in x0` },
          ],
        },
        advanced: {
          explanation: "ARM has NEON (called Advanced SIMD) for processing multiple values at once — similar to SSE/AVX on x86. ARM's load-store architecture means all operations happen on registers, never directly on memory.",
          code: `// NEON SIMD — process multiple values at once
// v registers: 128-bit (like xmm on x86)
// can be viewed as:
//   16 bytes  (v0.16b)
//   8 shorts  (v0.8h)
//   4 ints    (v0.4s)
//   2 longs   (v0.2d)
//   4 floats  (v0.4s with float ops)
//   2 doubles (v0.2d with float ops)

// add 4 floats at once
ldr  q0, [x0]        // load 4 floats from memory into v0
ldr  q1, [x1]        // load 4 more floats into v1
fadd v0.4s, v0.4s, v1.4s  // add all 4 pairs simultaneously
str  q0, [x2]        // store result

// ARM-specific features vs x86
// load-store: can't add memory directly, must load to register first
// condition codes on every instruction:
addne x0, x1, x2    // add only if NOT equal (NE condition)
// barrel shifter — free shift with any instruction:
add x0, x1, x2, lsl #2  // x0 = x1 + (x2 << 2) — in ONE instruction!`,
          examples: [
            { input: `fadd v0.4s, v1.4s, v2.4s`, output: `adds 4 floats simultaneously — 4x throughput` },
          ],
          note: "the barrel shifter is ARM's secret weapon — you get a free shift on the second operand of almost any instruction. x0 = x1 + x2*8 is ONE instruction on ARM, two on x86",
        },
      }),

      card("instructions + functions", {
        beginner: {
          explanation: "ARM instructions work only on registers — you load from memory into a register, operate on registers, then store back to memory. Branch instructions change where the CPU executes next.",
          code: `// load and store
ldr x0, [x1]          // load 64-bit from address in x1 into x0
ldr w0, [x1]          // load 32-bit
ldrb w0, [x1]         // load 1 byte (byte)
ldrh w0, [x1]         // load 2 bytes (halfword)
str x0, [x1]          // store x0 to address in x1
stp x0, x1, [sp, #-16]! // store PAIR, update sp (push two regs)
ldp x0, x1, [sp], #16   // load pair, update sp (pop two regs)

// arithmetic (all work on registers, never memory)
add x0, x1, x2        // x0 = x1 + x2
add x0, x1, #10       // x0 = x1 + 10 (immediate)
sub x0, x1, x2        // x0 = x1 - x2
mul x0, x1, x2        // x0 = x1 * x2
udiv x0, x1, x2       // x0 = x1 / x2 (unsigned)
sdiv x0, x1, x2       // x0 = x1 / x2 (signed)
lsl x0, x1, #3        // x0 = x1 << 3  (multiply by 8)
lsr x0, x1, #1        // x0 = x1 >> 1  (divide by 2)

// branches
b   label              // unconditional branch
bl  label              // branch with link (call — saves return addr in x30)
ret                    // return (branch to x30)
cbz x0, label          // branch if x0 == 0 (compare and branch if zero)
cbnz x0, label         // branch if x0 != 0`,
          examples: [
            { input: `mov x0, #10\nmov x1, #3\nudiv x2, x0, x1   // x2 = 10/3\nmsub x3, x2, x1, x0  // x3 = 10 - (3*3) = remainder\n// x2=?, x3=?`, output: `x2 = 3 (quotient)\nx3 = 1 (remainder)` },
          ],
          note: "ARM has no hardware remainder instruction. compute remainder with: msub rd, quotient, divisor, dividend. msub does: rd = dividend - (quotient * divisor)",
        },
        intermediate: {
          explanation: "ARM function calls save the return address in x30 (link register) rather than pushing it on the stack. If your function calls other functions, you must save x30 first or you'll lose the return address.",
          code: `// simple leaf function (doesn't call other functions)
// no need to save x30 since we don't call anything
add_func:
    add x0, x0, x1   // return value = a + b
    ret               // return to address in x30

// non-leaf function (calls other functions — must save x30)
outer:
    // prologue — save registers we'll use
    stp x29, x30, [sp, #-16]!  // save fp and lr, decrement sp
    mov x29, sp                  // set frame pointer

    // call inner function (this overwrites x30!)
    bl inner_func
    // ... use result in x0 ...

    // epilogue — restore and return
    ldp x29, x30, [sp], #16   // restore fp and lr, increment sp
    ret                        // return using restored x30

// conditional execution
    cmp x0, x1           // compare (sets condition flags)
    b.eq equal_label     // branch if equal
    b.gt greater_label   // branch if greater than
    b.lt less_label      // branch if less than
    b.ne notequal_label  // branch if not equal`,
          examples: [
            { input: `// if (x > y) x = y;\ncmp x0, x1\ncsel x0, x1, x0, gt  // x0 = (x0>x1) ? x1 : x0`, output: `conditional select — no branch needed` },
          ],
          note: "csel (conditional select) is ARM's equivalent of x86's cmov. it avoids branch misprediction and is preferred for simple if/else where both branches are short",
        },
      }),
    ]),
  ],
});
