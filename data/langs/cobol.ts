import { lang, section, card } from '../helpers';

export default lang({
  id: "cobol", name: "COBOL", ext: ".cbl", year: 1959, common: false,
  sections: [
    section("basics", "basics", [
      card("structure + hello world", {
        beginner: {
          explanation: "COBOL (Common Business-Oriented Language) is from 1959 and still processes an estimated $3 trillion in daily commerce — banks, insurance, government systems. It's famously verbose. Every program has 4 divisions, and the syntax reads almost like English. If you ever want a very well-paying legacy job, COBOL is it.",
          code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD.

       ENVIRONMENT DIVISION.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
           01 WS-MESSAGE    PIC X(20) VALUE 'Hello, World!'.
           01 WS-NUMBER     PIC 9(5)  VALUE 12345.
           01 WS-DECIMAL    PIC 9(3)V99 VALUE 123.45.

       PROCEDURE DIVISION.
           DISPLAY WS-MESSAGE
           DISPLAY WS-NUMBER
           STOP RUN.`,
          examples: [
            { input: `cobc -x hello.cbl -o hello && ./hello`, output: `Hello, World!\n12345` },
          ],
          note: "COBOL is column-sensitive — code must start at column 8 (Area A) or column 12 (Area B). the 6 spaces at the start of each line are required. modern COBOL is more relaxed but legacy code is strict about this",
        },
        intermediate: {
          explanation: "COBOL's PIC (picture) clause defines the format of data — 9 means digit, X means any character, V means implied decimal point, S means signed. The DATA DIVISION is where all variables are declared with their exact byte layout.",
          code: `       DATA DIVISION.
       WORKING-STORAGE SECTION.
       *> 01 = top level, 05/10 = nested fields
           01 WS-CUSTOMER.
               05 WS-CUST-ID      PIC 9(6).
               05 WS-CUST-NAME    PIC X(30).
               05 WS-CUST-BAL     PIC S9(7)V99.
               05 WS-CUST-ACTIVE  PIC X VALUE 'Y'.

           01 WS-COUNTERS.
               05 WS-COUNT        PIC 9(4) VALUE ZERO.
               05 WS-TOTAL        PIC 9(9)V99 VALUE ZERO.

       *> PIC clauses:
       *> 9     = numeric digit
       *> X     = alphanumeric character
       *> A     = alphabetic character
       *> V     = implied decimal (no actual decimal stored)
       *> S     = signed (+ or -)
       *> 9(6)  = six digits
       *> X(30) = 30 characters`,
          examples: [
            { input: `01 WS-PRICE PIC 9(5)V99.\nMOVE 123.45 TO WS-PRICE\nDISPLAY WS-PRICE`, output: `12345  (stored as 1234500 internally, V = implied decimal)` },
          ],
          note: "V in PIC means 'virtual decimal point' — the decimal isn't actually stored, it's implied. so 9(5)V99 stores 7 digits but represents a 5.2 decimal number. this saves storage but confuses everyone",
        },
        advanced: {
          explanation: "COBOL's FILE SECTION and sequential file processing are the core of what it actually does — reading millions of records from flat files and processing them. This is how banks batch-process transactions overnight.",
          code: `       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT CUSTOMER-FILE ASSIGN TO 'CUSTOMERS.DAT'
               ORGANIZATION IS SEQUENTIAL
               ACCESS MODE IS SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
           FD CUSTOMER-FILE.
           01 CUSTOMER-RECORD.
               05 CUST-ID     PIC 9(6).
               05 CUST-NAME   PIC X(30).
               05 CUST-BAL    PIC S9(7)V99.

       WORKING-STORAGE SECTION.
           01 WS-EOF          PIC X VALUE 'N'.
           01 WS-TOTAL-BAL    PIC S9(15)V99 VALUE ZERO.

       PROCEDURE DIVISION.
           OPEN INPUT CUSTOMER-FILE
           PERFORM UNTIL WS-EOF = 'Y'
               READ CUSTOMER-FILE
                   AT END MOVE 'Y' TO WS-EOF
                   NOT AT END
                       ADD CUST-BAL TO WS-TOTAL-BAL
               END-READ
           END-PERFORM
           CLOSE CUSTOMER-FILE
           DISPLAY 'TOTAL: ' WS-TOTAL-BAL
           STOP RUN.`,
          examples: [
            { input: `./process-customers`, output: `TOTAL:  0000000123456789  (processes every record in file)` },
          ],
          note: "this pattern — open file, loop until EOF, read records, process, close — is the backbone of most COBOL programs and processes billions of bank transactions, insurance claims, and payroll records every night",
        },
      }),

      card("conditionals + loops", {
        beginner: {
          explanation: "COBOL conditionals use IF/ELSE/END-IF. Loops use PERFORM. The syntax is very English-like — almost reads like plain instructions. COBOL was designed so non-programmers could read business logic.",
          code: `       PROCEDURE DIVISION.
           *> IF statement
           IF WS-BALANCE > 1000
               DISPLAY 'HIGH BALANCE'
           ELSE IF WS-BALANCE > 0
               DISPLAY 'POSITIVE BALANCE'
           ELSE
               DISPLAY 'ZERO OR NEGATIVE'
           END-IF

           *> PERFORM loop (like for loop)
           PERFORM VARYING WS-INDEX FROM 1 BY 1
               UNTIL WS-INDEX > 10
               DISPLAY WS-INDEX
           END-PERFORM

           *> PERFORM a paragraph (like calling a function)
           PERFORM PROCESS-RECORD

           *> EVALUATE (like switch)
           EVALUATE WS-STATUS
               WHEN 'A' DISPLAY 'ACTIVE'
               WHEN 'I' DISPLAY 'INACTIVE'
               WHEN OTHER DISPLAY 'UNKNOWN'
           END-EVALUATE.`,
          examples: [
            { input: `MOVE 5 TO WS-INDEX\nIF WS-INDEX > 3\n    DISPLAY 'BIG'\nEND-IF`, output: `BIG` },
          ],
          note: "END-IF, END-PERFORM, END-EVALUATE are required terminators in modern COBOL. old COBOL used periods to terminate everything which caused subtle bugs — a misplaced period could end an entire IF block",
        },
        intermediate: {
          explanation: "COBOL paragraphs are like functions but with no arguments or return values. Data is shared through the global WORKING-STORAGE section. PERFORM calls a paragraph like a subroutine.",
          code: `       PROCEDURE DIVISION.
           PERFORM INITIALIZE-COUNTERS
           PERFORM PROCESS-ALL-RECORDS
           PERFORM DISPLAY-TOTALS
           STOP RUN.

       INITIALIZE-COUNTERS.
           MOVE ZERO TO WS-COUNT
           MOVE ZERO TO WS-TOTAL.

       PROCESS-ALL-RECORDS.
           OPEN INPUT TRANS-FILE
           PERFORM UNTIL WS-EOF = 'Y'
               READ TRANS-FILE
                   AT END MOVE 'Y' TO WS-EOF
                   NOT AT END PERFORM PROCESS-ONE-RECORD
               END-READ
           END-PERFORM
           CLOSE TRANS-FILE.

       PROCESS-ONE-RECORD.
           ADD 1 TO WS-COUNT
           ADD TR-AMOUNT TO WS-TOTAL.

       DISPLAY-TOTALS.
           DISPLAY 'RECORDS: ' WS-COUNT
           DISPLAY 'TOTAL:   ' WS-TOTAL.`,
          examples: [
            { input: `PERFORM CALC-TAX`, output: `calls the CALC-TAX paragraph (like a void function)` },
          ],
        },
      }),
    ]),
  ],
});
