import { lang, section, card } from '../helpers';

export default lang({
  id: "clojure", name: "Clojure", ext: ".clj", year: 2007, common: false,
  sections: [
    section("basics", "basics", [
      card("syntax + basics", {
        beginner: {
          explanation: "Clojure is a modern Lisp that runs on the JVM. It's dynamically typed, functional, and designed for concurrency. Like all Lisps, code is written as data (s-expressions with parentheses). Clojure is used at companies like Nubank (largest fintech in Latin America) and Walmart for backend systems.",
          code: `; semicolons are comments

; everything is an s-expression: (function arg1 arg2 ...)
(+ 1 2)          ; 3
(* 3 4)          ; 12
(str "Hello" ", " "World!")  ; "Hello, World!"

; def — define a name globally
(def name "Alice")
(def age 25)

; print
(println "Hello, World!")
(println "Name:" name)
(println (str "Hello, " name "!"))

; let — local bindings (not global)
(let [x 10
      y 20]
  (+ x y))   ; 30 — x and y only exist inside let

; Clojure's core data structures
[1 2 3]              ; vector
'(1 2 3)             ; list (quoted)
{:name "Alice" :age 25}  ; map (like dictionary)
#{1 2 3}             ; set (unique values)

; keywords — like Ruby symbols
:name   ; :name is its own value, used as map keys`,
          examples: [
            { input: `(+ 1 2 3 4 5)`, output: `15` },
            { input: `(count [1 2 3 4])`, output: `4` },
            { input: `(get {:name "Alice" :age 25} :name)`, output: `"Alice"` },
          ],
          note: "in Clojure, : prefix makes a keyword. keywords are self-evaluating — :name always equals :name. they're commonly used as map keys because they're fast and readable",
        },
        intermediate: {
          explanation: "Clojure is built around immutable data structures. Instead of changing data, you create new versions. The threading macros -> and ->> make data transformation pipelines readable.",
          code: `; immutable by default — all operations return new values
(def v [1 2 3 4 5])
(conj v 6)       ; [1 2 3 4 5 6] — new vector, v unchanged
v                ; still [1 2 3 4 5]

; map, filter, reduce — core operations
(map #(* % 2) [1 2 3 4 5])     ; (2 4 6 8 10)
(filter even? [1 2 3 4 5 6])   ; (2 4 6)
(reduce + [1 2 3 4 5])          ; 15
(reduce + 0 [1 2 3 4 5])        ; 15 (with initial value)

; thread-first -> — passes result as FIRST arg
(-> "hello world"
    str/upper-case               ; "HELLO WORLD"
    (str/split #" ")             ; ["HELLO" "WORLD"]
    first)                       ; "HELLO"

; thread-last ->> — passes result as LAST arg
(->> [1 2 3 4 5 6]
     (filter even?)              ; (2 4 6)
     (map #(* % %))             ; (4 16 36)
     (reduce +))                 ; 56

; destructuring
(let [[a b & rest] [1 2 3 4 5]]
  (println a b rest))            ; 1 2 (3 4 5)

(let [{:keys [name age]} {:name "Alice" :age 25}]
  (println name age))            ; Alice 25`,
          examples: [
            { input: `(->> (range 1 11)\n     (filter odd?)\n     (map #(* % %))\n     (reduce +))`, output: `165  ; 1+9+25+49+81` },
          ],
        },
        advanced: {
          explanation: "Clojure's Software Transactional Memory (STM) and atoms make concurrent state management safe. Macros let you extend the language. core.async brings Go-style channels to Clojure.",
          code: `; atom — thread-safe mutable reference
(def counter (atom 0))
(swap! counter inc)          ; atomically increment
(swap! counter + 5)          ; atomically add 5
@counter                     ; deref: get current value = 6

; ref + dosync — coordinated state changes (STM)
(def account-a (ref 1000))
(def account-b (ref 500))

(defn transfer [from to amount]
    (dosync                       ; transaction — atomic
        (alter from - amount)
        (alter to   + amount)))

(transfer account-a account-b 200)
@account-a  ; 800
@account-b  ; 700

; macro — transform code at compile time
(defmacro unless [condition & body]
    \`(when (not ~condition)
       ~@body))

(unless false
    (println "condition was false"))

; core.async — Go-style channels
(require '[clojure.core.async :as async])

(def ch (async/chan))

(async/go
    (async/>! ch "hello"))   ; send to channel

(async/go
    (println (async/<! ch)))  ; receive from channel`,
          examples: [
            { input: `(def a (atom 0))\n(swap! a + 42)\n@a`, output: `42` },
          ],
          note: "Clojure's STM (dosync/ref) is for coordinating multiple related state changes atomically. atoms are for single independent state. use atoms 90% of the time, refs when multiple things must change together",
        },
      }),
    ]),
  ],
});
