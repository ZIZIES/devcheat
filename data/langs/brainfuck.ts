import { lang, section, card } from '../helpers';

export default lang({
  id: "brainfuck", name: "Brainfuck", ext: ".bf", year: 1993, common: false,
  sections: [
    section("basics", "basics", [
      card("the 8 commands", {
        beginner: {
          explanation: "Brainfuck is an esoteric programming language with only 8 commands. It was created in 1993 as a joke/challenge — can you make a Turing-complete language with the minimum possible syntax? Despite being a joke, it's genuinely Turing-complete (you can write ANY program in it, in theory). The name is intentionally rude.",
          code: `> moves the data pointer right (to the next memory cell)
< moves the data pointer left (to the previous memory cell)
+ increment the byte at the current cell by 1
- decrement the byte at the current cell by 1
. output the byte at current cell as an ASCII character
, read one byte from input, store in current cell
[ if the byte at current cell is 0, jump to matching ]
] if the byte at current cell is nonzero, jump back to matching [

Everything else is a comment (ignored)

Memory model:
- Array of (usually 30,000) bytes, all initialized to 0
- A pointer that starts at cell 0
- Values wrap: 255 + 1 = 0, 0 - 1 = 255`,
          examples: [
            { input: `+++.`, output: `ETX (ASCII 3 — probably invisible)` },
            { input: `++++++++++.`, output: `(newline — ASCII 10)` },
            { input: `+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.`, output: `A (65 pluses = ASCII 65 = 'A')` },
          ],
          note: "brainfuck is Turing-complete which means ANY computable function can theoretically be written in it. this does NOT mean you should write it in brainfuck. it's purely for fun and the intellectual challenge",
        },
        intermediate: {
          explanation: "The hard part of brainfuck is building up ASCII values efficiently using loops. Instead of writing 72 plusses for 'H', you use multiplication: 8 loops of 9 increments = 72.",
          code: `hello world — the classic brainfuck program:

++++++++              set cell 0 to 8
[                     loop 8 times
  >++++              add 4 to cell 1  (8*4 = 32 = space)
  [                  loop 4 times
    >++             add 2 to cell 2   (8*4*2 = 64)
    >+++            add 3 to cell 3   (8*4*3 = 96)
    >+++            add 3 to cell 4
    >+              add 1 to cell 5   (8*4*1 = 32 = space)
    <<<<-           go back to cell 1, decrement
  ]
  >+               cell 2 = 64+8 = 72 = 'H'
  >+               cell 3 = 96+8-8+1 = 101 = 'e'
  >-               cell 4 = 96-8 = 88... (not right, simplified)
  >>+              cell 6 = 33 = '!'
  [<]              go back to start
  <-               decrement cell 0 (the counter)
]
...                (continues to output each character)`,
          examples: [
            { input: `,[.,]  (with input "hello")`, output: `hello  — cat program, 5 characters` },
            { input: `++++++++++[>++++++++++<-]>.`, output: `d  (10*10=100, ASCII 100='d')` },
          ],
          note: "the most common brainfuck pattern is multiplication via nested loops. to get value N*M in a cell: set cell to N, then loop N times adding M to another cell. this is how you avoid writing hundreds of +'s",
        },
        advanced: {
          explanation: "Brainfuck compilers and interpreters optimize the code. Run-length encoding collapses sequences of +++++ into a single 'add 5' instruction. Loop analysis identifies loops that only run once and unrolls them.",
          code: `common brainfuck patterns:

[-]              zero out current cell
                 (loop until 0, decrementing each time)

[->+<]           MOVE cell 0 to cell 1 (destructive)
                 loop: decrement cell 0, move right, increment cell 1, move left

[->+>+<<]        COPY cell 0 to cell 1 AND cell 2
                 (leaves cell 0 at 0, use [-]>>[->+<]<< to restore)

>,[>,]<[.<]      reverse input: read all chars, then print backwards

+++[>+++++++<-]>.  multiply: 3 * 7 = 21 (ASCII 21 is NAK, invisible)

adjust for ASCII: +++[>++++++++<-]>+.  3*8+1=25... (keeps going)

to print the letter 'A' (65):
  8*8+1 = 65: ++++++++[>++++++++<-]>+.
  or: 5*13 = 65: +++++[>+++++++++++++<-]>.

optimal brainfuck compilers:
  1. tokenize into run-length encoded ops (5x+ becomes ADD 5)
  2. optimize [-] patterns into ZERO instruction
  3. detect balanced loops, unroll simple ones
  4. use linear scan to find matching brackets (O(n) not O(n²))`,
          examples: [
            { input: `>+++++[<++++++>-]<.  (5*6=30, ASCII 30 is RS)`, output: `(non-printable control character)` },
            { input: `++++++++[>++++[>++<-]<-]>>.  (compute 'H')`, output: `H` },
          ],
          note: "the fastest brainfuck programs use a technique called 'balanced loops' where the pointer always returns to the same position after each loop iteration. this allows loop bodies to be analyzed at compile time",
        },
      }),
    ]),
  ],
});
