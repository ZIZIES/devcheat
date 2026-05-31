import { lang, section, card } from '../helpers';

export default lang({
  id: "go", name: "Go", ext: ".go", year: 2009, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + types", {
        beginner: {
          explanation: "Go is simple and fast. It looks like C but has automatic memory management (garbage collection). Every variable has a type, but := lets Go figure it out. Unlike most languages, unused variables are a compile error in Go — it forces clean code.",
          code: `package main

import "fmt"

func main() {
    // := is short variable declaration (inside functions)
    name := "Alice"    // Go infers string
    age  := 25         // Go infers int
    pi   := 3.14       // Go infers float64

    // explicit type declaration
    var count int = 0
    var flag  bool = true

    // multiple assignment
    x, y := 10, 20
    x, y  = y, x   // swap — no temp variable needed

    // zero values — Go always initializes variables
    var num int     // 0
    var str string  // ""
    var b   bool    // false

    fmt.Println(name, age, pi)
    fmt.Printf("count=%d flag=%v\\n", count, flag)
}`,
          examples: [
            { input: `x, y := 3, 4\nfmt.Println(x+y, x*y)`, output: `7 12` },
            { input: `var n int\nfmt.Println(n)`, output: `0  // always initialized` },
          ],
          note: "Go initializes everything to its zero value — 0 for numbers, '' for strings, false for bools, nil for pointers. you'll never have an uninitialized variable causing random bugs",
        },
        intermediate: {
          explanation: "Go's type system is simple but powerful. Interfaces are satisfied implicitly — if a type has the right methods, it satisfies the interface without explicitly saying so. This is called structural typing.",
          code: `// Go's basic types
var i  int     = 42      // platform-dependent size
var i8 int8    = 127     // -128 to 127
var u  uint32  = 42      // 0 to 4,294,967,295
var f  float64 = 3.14
var b  byte    = 255     // alias for uint8
var r  rune    = '⚡'    // alias for int32 (Unicode code point)

// type alias
type UserID int
type Celsius float64

// constants
const Pi      = 3.14159
const MaxSize = 1 << 20  // 1MB

// iota — auto-incrementing constant
type Weekday int
const (
    Sunday Weekday = iota  // 0
    Monday                  // 1
    Tuesday                 // 2
    // ...
)

// multiple return values — very common in Go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

result, err := divide(10, 2)
if err != nil {
    log.Fatal(err)
}`,
          examples: [
            { input: `result, err := divide(10, 3)\nfmt.Printf("%.2f %v", result, err)`, output: `3.33 <nil>` },
          ],
        },
        advanced: {
          explanation: "Go's memory model and scheduler are key to its performance. Goroutines are multiplexed onto OS threads by Go's runtime. Understanding escape analysis helps you write allocation-efficient code.",
          code: `// escape analysis — compiler decides stack vs heap
func noEscape() *int {
    x := 42
    return &x  // x escapes to heap — compiler detects this
}

// go build -gcflags='-m' shows escape analysis decisions

// unsafe package — direct memory access
import "unsafe"

type Header struct {
    Magic   uint32
    Version uint16
    Length  uint32
}

// read struct directly from bytes (like C)
func parseHeader(data []byte) *Header {
    return (*Header)(unsafe.Pointer(&data[0]))
}

// sync.Pool — reuse allocations
var bufPool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 0, 4096)
    },
}

func process(data []byte) {
    buf := bufPool.Get().([]byte)[:0]
    defer bufPool.Put(buf)
    // use buf...
}`,
          examples: [
            { input: `// go test -bench=. -benchmem\n// BenchmarkProcess-8    500000    2400 ns/op    0 B/op    0 allocs/op`, output: `0 allocs with pool` },
          ],
          note: "use pprof to profile Go programs: import _ 'net/http/pprof' then hit /debug/pprof/ in your browser. it shows CPU usage, memory allocations, goroutine stacks",
        },
      }),

      card("goroutines + channels", {
        beginner: {
          explanation: "A goroutine is a lightweight thread of execution. You start one with the 'go' keyword. Channels are pipes that goroutines use to communicate — one goroutine sends a value, another receives it. This is Go's approach to concurrency.",
          code: `package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    fmt.Println("Hello,", name)
}

func main() {
    // go keyword starts a goroutine — runs concurrently
    go sayHello("Alice")
    go sayHello("Bob")
    go sayHello("Carol")

    // main keeps running while goroutines run
    time.Sleep(time.Millisecond) // give goroutines time to run

    // channel — a typed pipe for communication
    ch := make(chan string)

    go func() {
        ch <- "message from goroutine"  // send to channel (blocks until received)
    }()

    msg := <-ch  // receive from channel (blocks until sent)
    fmt.Println(msg)
}`,
          examples: [
            { input: `ch := make(chan int)\ngo func() { ch <- 42 }()\nfmt.Println(<-ch)`, output: `42` },
          ],
          note: "goroutines are much lighter than OS threads — you can run thousands of them. Go's runtime multiplexes them onto a small number of OS threads automatically",
        },
        intermediate: {
          explanation: "Buffered channels don't block immediately — they hold up to N values before blocking. select lets a goroutine wait on multiple channels at once. WaitGroups coordinate when multiple goroutines finish.",
          code: `import "sync"

// buffered channel — holds up to 3 values without blocking
ch := make(chan int, 3)
ch <- 1   // doesn't block
ch <- 2   // doesn't block
ch <- 3   // doesn't block
// ch <- 4  // would block — buffer full

// select — wait on multiple channels
select {
case msg := <-ch1:
    fmt.Println("from ch1:", msg)
case msg := <-ch2:
    fmt.Println("from ch2:", msg)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
default:
    fmt.Println("no activity right now")
}

// WaitGroup — wait for multiple goroutines to finish
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)               // tell WaitGroup to expect one more
    go func(i int) {
        defer wg.Done()     // signal this goroutine is done
        fmt.Println(i)
    }(i)
}
wg.Wait()  // block until all goroutines call Done()`,
          examples: [
            { input: `ch := make(chan int, 2)\nch <- 10\nch <- 20\nfmt.Println(len(ch), cap(ch))`, output: `2 2` },
          ],
          note: "Go's concurrency motto: don't communicate by sharing memory, share memory by communicating. channels make data flow explicit and prevent race conditions",
        },
        advanced: {
          explanation: "Context carries deadlines, cancellations, and request-scoped values across goroutines. It's how you cancel a whole tree of goroutines when the user cancels a request.",
          code: `import "context"

// context — carries cancellation and deadlines
func fetchWithTimeout(url string) (string, error) {
    // cancel after 5 seconds
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()  // always call cancel to release resources

    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return "", err  // context.DeadlineExceeded if timed out
    }
    defer resp.Body.Close()
    // read body...
}

// pass context through call chain
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()                  // get request's context
    result, err := queryDB(ctx, "...")  // pass it down
    // if request is cancelled, queryDB can detect it
}

func queryDB(ctx context.Context, query string) (string, error) {
    // check if cancelled before doing expensive work
    select {
    case <-ctx.Done():
        return "", ctx.Err()  // context.Canceled or DeadlineExceeded
    default:
    }
    // do the query...
}`,
          examples: [
            { input: `ctx, cancel := context.WithTimeout(context.Background(), time.Second)\ndefer cancel()\n// all operations with ctx will fail after 1 second`, output: `operations automatically cancelled after 1s` },
          ],
          note: "always pass context as the first parameter to functions that do I/O. always call the cancel function (usually with defer). never store contexts in structs",
        },
      }),
    ]),
  ],
});
