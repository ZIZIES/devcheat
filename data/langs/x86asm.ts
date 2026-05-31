import { lang, section, card } from '../helpers';

export default lang({
  id: "x86asm", name: "x86 ASM", ext: ".asm", year: 1978, common: false,
  sections: [
    section("basics", "basics", [
      card("what assembly is", {
        beginner: {
          explanation: "Assembly is the lowest level you can program before writing raw 1s and 0s. Every instruction maps directly to one CPU operation. There's no garbage collector, no types, no loops — just registers (tiny storage slots in the CPU) and instructions that move data around and do math. x86 is the instruction set used by Intel and AMD processors (most laptops and desktops).",
          code: `; assembly uses semicolons for comments
; this is NASM syntax (a popular assembler for x86-64)

; every program needs sections
section .data
    msg db "Hello, World!", 10   ; 10 = newline character
    len equ $ - msg              ; $ = current address, so len = length of msg

section .text
    global _start    ; entry point — OS looks for this

_start:
    ; write(1, msg, len) — system call to print
    mov rax, 1       ; rax = 1 means "write" syscall
    mov rdi, 1       ; rdi = 1 means stdout (screen)
    mov rsi, msg     ; rsi = address of our message
    mov rdx, len     ; rdx = length of message
    syscall          ; ask the OS to do it

    ; exit(0) — system call to quit
    mov rax, 60      ; rax = 60 means "exit" syscall
    xor rdi, rdi     ; rdi = 0 means success (xor with itself = 0)
    syscall`,
          examples: [
            { input: `nasm -f elf64 hello.asm -o hello.o\nld hello.o -o hello\n./hello`, output: `Hello, World!` },
          ],
          note: "assembly is platform-specific — x86-64 code only runs on Intel/AMD processors. ARM assembly (used in phones and Apple Silicon) is completely different syntax",
        },
        intermediate: {
          explanation: "x86-64 has 16 general-purpose registers. Each has a specific role in the calling convention — which register holds which argument, which register holds the return value. The System V AMD64 ABI is used on Linux and macOS.",
          code: `; registers — 64-bit names (r prefix)
; rax  — accumulator, return value
; rbx  — preserved across function calls
; rcx  — 4th argument
; rdx  — 3rd argument, also used in division
; rsi  — 2nd argument (source index)
; rdi  — 1st argument (destination index)
; rsp  — stack pointer (top of stack)
; rbp  — base pointer (stack frame base)
; r8   — 5th argument
; r9   — 6th argument
; r10-r15 — general purpose (some caller-saved)

; sub-registers of rax:
; rax = 64-bit
; eax = lower 32 bits of rax
; ax  = lower 16 bits of rax
; al  = lower 8 bits of rax
; ah  = bits 8-15 of rax

; System V AMD64 calling convention (Linux/macOS):
; arguments go in: rdi, rsi, rdx, rcx, r8, r9
; return value in: rax
; caller saves: rax, rcx, rdx, rsi, rdi, r8, r9, r10, r11
; callee saves: rbx, rbp, r12, r13, r14, r15`,
          examples: [
            { input: `; function(a, b, c) call\nmov rdi, 1    ; a = 1\nmov rsi, 2    ; b = 2\nmov rdx, 3    ; c = 3\ncall my_func\n; result in rax`, output: `arguments passed in registers, not stack` },
          ],
          note: "Windows uses a DIFFERENT calling convention: rcx, rdx, r8, r9 for first 4 args. code that works on Linux won't work on Windows and vice versa",
        },
        advanced: {
          explanation: "SIMD (Single Instruction Multiple Data) instructions process multiple values at once. AVX-512 can operate on 16 floats simultaneously. This is how optimized math libraries get extreme performance.",
          code: `; SSE/AVX — process multiple values at once
; xmm registers: 128 bits = 4 floats or 2 doubles
; ymm registers: 256 bits = 8 floats or 4 doubles
; zmm registers: 512 bits = 16 floats or 8 doubles

; add 4 floats at once with SSE
movaps  xmm0, [a]      ; load 4 floats from memory
movaps  xmm1, [b]      ; load 4 more floats
addps   xmm0, xmm1    ; add all 4 pairs simultaneously
movaps  [result], xmm0 ; store result

; scalar: 4 separate adds = 4 cycles
; SIMD:   1 addps = 1 cycle for all 4 — 4x speedup

; common SIMD patterns
; ps = packed single (4 floats)
; pd = packed double (2 doubles)
; ss = scalar single (1 float)
; sd = scalar double (1 double)

addps   xmm0, xmm1   ; add 4 floats
mulps   xmm0, xmm1   ; multiply 4 floats
sqrtps  xmm0, xmm1   ; sqrt 4 floats
maxps   xmm0, xmm1   ; max of 4 pairs

; shuffle — rearrange elements
shufps  xmm0, xmm0, 0b00011011  ; reverse order`,
          examples: [
            { input: `; computing dot product of two float[4] arrays\nvmovaps ymm0, [a]      ; load 8 floats\nvmulps  ymm0, ymm0, [b] ; multiply element-wise\n; then horizontal add to sum`, output: `8x throughput vs scalar` },
          ],
          note: "check CPU support before using AVX-512 — older CPUs don't have it. use CPUID instruction or check /proc/cpuinfo on Linux. mixing AVX and SSE code causes performance penalties",
        },
      }),

      card("instructions + memory", {
        beginner: {
          explanation: "Assembly has only a handful of instruction types: move data (mov), do math (add, sub, mul), compare (cmp), jump (jmp, je, jne), and call functions (call, ret). Memory is accessed with square brackets.",
          code: `; mov — move data
mov rax, 42        ; rax = 42 (immediate value)
mov rbx, rax       ; rbx = rax (register to register)
mov [ptr], rax     ; store rax at memory address ptr
mov rax, [ptr]     ; load from memory address ptr

; arithmetic
add rax, 10        ; rax += 10
sub rbx, 5         ; rbx -= 5
imul rax, rbx      ; rax *= rbx (signed multiply)
inc rax            ; rax++ (faster than add rax, 1)
dec rbx            ; rbx--
neg rax            ; rax = -rax

; before idiv, must set up rdx:rax as 128-bit dividend
xor rdx, rdx       ; clear rdx (upper 64 bits)
mov rax, 17        ; lower 64 bits
mov rcx, 5
idiv rcx           ; rax = 17/5 = 3, rdx = 17%5 = 2

; bit operations
and rax, 0xFF      ; keep only lower 8 bits
or  rax, 0x80      ; set bit 7
xor rax, rax       ; zero out rax (fastest way)
shl rax, 3         ; shift left 3 = multiply by 8
shr rax, 1         ; shift right 1 = divide by 2`,
          examples: [
            { input: `mov rax, 10\nmov rbx, 3\nxor rdx, rdx\nidiv rbx\n; rax=?, rdx=?`, output: `rax = 3 (quotient)\nrdx = 1 (remainder)` },
            { input: `xor rax, rax   ; zero rax`, output: `rax = 0  (2 bytes, faster than mov rax,0 which is 7 bytes)` },
          ],
          note: "idiv requires setting up rdx:rax as a 128-bit number before dividing. always xor rdx, rdx first for positive numbers. forgetting this causes incorrect results or crashes",
        },
        intermediate: {
          explanation: "The stack grows downward in memory. push decreases rsp and stores a value, pop loads a value and increases rsp. Function prologues and epilogues save/restore the frame pointer so you can find your local variables.",
          code: `; stack operations
push rax        ; rsp -= 8, memory[rsp] = rax
pop  rbx        ; rbx = memory[rsp], rsp += 8

; standard function prologue
my_function:
    push rbp           ; save caller's base pointer
    mov  rbp, rsp      ; set our base pointer
    sub  rsp, 32       ; allocate 32 bytes for local variables

    ; access local variables via rbp
    mov qword [rbp-8],  10   ; first local = 10
    mov qword [rbp-16], 20   ; second local = 20

    ; do work...
    mov rax, [rbp-8]         ; load first local
    add rax, [rbp-16]        ; add second local
    ; rax = 30 — this is the return value

    ; standard function epilogue
    mov rsp, rbp       ; restore stack pointer
    pop rbp            ; restore caller's base pointer
    ret                ; pop return address, jump to it

; call it
call my_function
; rax now contains 30`,
          examples: [
            { input: `; memory addressing modes\nmov rax, [rbx]           ; load from address in rbx\nmov rax, [rbx + 8]       ; load from rbx + 8\nmov rax, [rbx + rcx*4]  ; load from rbx + rcx*4\nmov rax, [rbx + rcx*4 + 8] ; all combined`, output: `flexible addressing for array access` },
          ],
        },
        advanced: {
          explanation: "Branch prediction and cache behavior dominate performance in assembly. A mispredicted branch costs 15-20 cycles. A cache miss costs 200+ cycles. Writing assembly that works WITH the CPU's prediction and caching is the real skill.",
          code: `; branchless code — avoid branch misprediction
; BAD: branch (misprediction costs 15-20 cycles)
    cmp rax, 0
    jge positive
    neg rax
positive:

; GOOD: branchless (always 1-2 cycles)
    sar rax, 63        ; arithmetic shift right 63: all 1s if negative, all 0s if positive
    mov rbx, rax       ; save the mask
    neg rax            ; negate
    and rax, rbx       ; if was positive, zero out (cancel negation)
    ; effectively: abs(rax) without a branch

; or use cmov — conditional move (no branch)
    cmp rax, rbx
    cmovg rax, rbx     ; rax = rbx only if rax > rbx (max without branch)

; cache-friendly loop — access memory sequentially
    ; BAD: column-major access of row-major array (cache miss every iteration)
    ; GOOD: row-major access — each access is adjacent in memory
    lea rdi, [array]
    mov rcx, 1024
.loop:
    add rax, [rdi]     ; sequential access — cache-friendly
    add rdi, 8         ; move to next element
    dec rcx
    jnz .loop`,
          examples: [
            { input: `; cmovg — conditional move if greater\nmov rax, 5\nmov rbx, 10\ncmp rax, rbx\ncmovl rax, rbx   ; if rax < rbx, rax = rbx\n; result:`, output: `rax = 10  (max of 5 and 10, no branch)` },
          ],
          note: "use perf stat to measure branch mispredictions and cache misses. a program with 10% branch misprediction rate can be 2-3x slower than the same logic written to be branchless",
        },
      }),
    ]),
  ],
});
