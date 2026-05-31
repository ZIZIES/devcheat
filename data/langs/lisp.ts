import { lang, section, card } from '../helpers';

export default lang({
  id: "lisp", name: "Lisp", ext: ".lisp", year: 1958, common: false,
  sections: [
    section("basics", "basics", [
      card("s-expressions + basics", {
        beginner: {
          explanation: "Lisp (List Processing) is the second oldest programming language still in use (after Fortran). Everything in Lisp is an S-expression — a list with parentheses. The first element is the function, the rest are arguments. This uniform syntax is weird at first but incredibly powerful — code and data look the same.",
          code: `; semicolons are comments in Common Lisp

; S-expression: (function arg1 arg2 ...)
; The function comes FIRST, then arguments
(+ 1 2)          ; 3
(* 3 4)          ; 12
(- 10 3)         ; 7
(/ 15 3)         ; 5
(expt 2 10)      ; 1024 (2^10)

; string output
(print "Hello, World!")

; define a variable
(defvar *name* "Alice")    ; *earmuffs* = convention for global vars
(defvar *age* 25)

; defun — define a function
(defun greet (name)
    (concatenate 'string "Hello, " name "!"))

(greet "Alice")   ; "Hello, Alice!"

; let — create local bindings
(let ((x 10)
      (y 20))
    (+ x y))      ; 30  (x and y only exist inside the let)`,
          examples: [
            { input: `(+ 1 2 3 4 5)`, output: `15  ; + takes any number of args` },
            { input: `(* 2 (+ 3 4))`, output: `14  ; nested s-expressions` },
          ],
          note: "the parentheses style is called prefix notation or Polish notation. (+ 1 2) not (1 + 2). it's consistent and eliminates operator precedence rules entirely — no need to remember if * binds tighter than +",
        },
        intermediate: {
          explanation: "Lisp macros are the language's superpower — they let you extend the syntax of the language itself. A macro transforms code before it runs. This is how if, while, and basically everything in Lisp is implemented.",
          code: `; list operations — Lisp is built around lists
(car '(1 2 3))       ; 1 — first element (head)
(cdr '(1 2 3))       ; (2 3) — rest of list (tail)
(cons 1 '(2 3))      ; (1 2 3) — add to front
(list 1 2 3)         ; (1 2 3) — create a list
(length '(1 2 3))    ; 3
(append '(1 2) '(3 4)) ; (1 2 3 4)

; mapcar — map over a list
(mapcar (lambda (x) (* x x)) '(1 2 3 4 5))
; (1 4 9 16 25)

; defmacro — create new syntax
(defmacro when (condition &body body)
    \`(if ,condition
         (progn ,@body)))  ; quasiquote with unquote

; now 'when' works like built-in syntax:
(when (> x 0)
    (print "positive")
    (print x))

; this expands to:
; (if (> x 0) (progn (print "positive") (print x)))

; loop macro (Common Lisp)
(loop for i from 1 to 5
      collect (* i i))     ; (1 4 9 16 25)`,
          examples: [
            { input: `(mapcar #'(lambda (x) (* x 2)) '(1 2 3 4 5))`, output: `(2 4 6 8 10)` },
            { input: `(remove-if #'oddp '(1 2 3 4 5 6))`, output: `(2 4 6)` },
          ],
          note: "quasiquote (`) and unquote (,) are used in macros to build code as data. `(if ,condition body) means 'make a list (if ...) but evaluate condition and splice it in'. this is metaprogramming",
        },
        advanced: {
          explanation: "Common Lisp's CLOS (Common Lisp Object System) is one of the most powerful object systems ever designed. Methods dispatch on the types of ALL arguments, not just 'self'. Before/after/around methods add behavior without modifying originals.",
          code: `; CLOS — Common Lisp Object System
(defclass animal ()
    ((name  :initarg :name  :accessor animal-name)
     (sound :initarg :sound :accessor animal-sound)))

(defclass dog (animal)   ; inherits from animal
    ((breed :initarg :breed :accessor dog-breed)))

; generic function — method dispatches on ALL argument types
(defgeneric speak (animal))

(defmethod speak ((a animal))
    (format t "~a makes a sound~%" (animal-name a)))

(defmethod speak ((d dog))
    (format t "~a says: ~a!~%" (animal-name d) (animal-sound d)))

(defmethod speak :before ((a animal))  ; runs BEFORE the main method
    (format t "[preparing to speak]~%"))

; multi-dispatch — method selected based on ALL argument types
(defgeneric interact (a b))
(defmethod interact ((d dog) (c cat))
    (format t "dog chases cat~%"))
(defmethod interact ((c cat) (d dog))
    (format t "cat ignores dog~%"))

; conditions and restarts — more powerful than exceptions
(with-restarts ((use-default () 0))
    (/ x 0))   ; can restart instead of just catching`,
          examples: [
            { input: `(speak (make-instance 'dog :name "Rex" :sound "Woof"))`, output: `[preparing to speak]\nRex says: Woof!` },
          ],
          note: "multi-dispatch (dispatching on multiple argument types) is rare in most languages — in Java you'd need the visitor pattern. in CLOS it's built in. Clojure and Julia also support this",
        },
      }),
    ]),
  ],
});
