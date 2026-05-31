import { lang, section, card } from '../helpers';

export default lang({
  id: "cpp", name: "C++", ext: ".cpp", year: 1985, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + auto", {
        beginner: {
          explanation: "C++ requires you to declare the type of every variable, but 'auto' lets the compiler figure it out for you. You still get type safety — auto just saves typing when the type is obvious from the value.",
          code: `#include <iostream>
#include <string>

int main() {
    // explicit types
    int    age    = 25;
    double pi     = 3.14159;
    bool   active = true;
    char   grade  = 'A';

    // auto — compiler deduces the type
    auto x    = 42;         // int
    auto y    = 3.14;       // double
    auto name = std::string{"Alice"};  // std::string

    // print with cout
    std::cout << "Hello, " << name << "\\n";
    std::cout << "age: " << age << ", pi: " << pi << "\\n";

    return 0;
}`,
          examples: [
            { input: `auto x = 42;\nstd::cout << x * 2;`, output: `84` },
            { input: `auto s = std::string{"hello"};\nstd::cout << s.size();`, output: `5` },
          ],
          note: "auto is not 'no type' — it's 'figure out the type for me'. once declared as auto x = 42, x is an int and stays an int. you can't later do x = 'hello'",
        },
        intermediate: {
          explanation: "Fixed-width types from <cstdint> guarantee exact bit sizes across platforms. constexpr evaluates at compile time — the value is baked into the program, no runtime cost.",
          code: `#include <cstdint>   // fixed-width types

// guaranteed sizes everywhere
uint8_t  byte  = 255;      // 0–255
int32_t  word  = -1;       // always 32-bit signed
uint64_t big   = 0xDEADBEEFULL;

// auto deduction with type suffixes
auto a = 42;      // int
auto b = 42u;     // unsigned int
auto c = 42.0;    // double
auto d = 42.0f;   // float
auto e = 42ll;    // long long

// constexpr — evaluated at compile time, zero runtime cost
constexpr int KB = 1024;
constexpr int MB = KB * KB;
constexpr int pow2(int n) { return 1 << n; }
constexpr int PAGE = pow2(12);  // 4096, computed at compile time

// structured bindings (C++17) — unpack tuple/pair/struct
auto [x, y] = std::pair{3, 4};
std::cout << x << " " << y;  // 3 4`,
          examples: [
            { input: `constexpr int sq(int n) { return n*n; }\nconstexpr int r = sq(7);  // computed at compile time\nstd::cout << r;`, output: `49` },
          ],
          note: "use int32_t, uint64_t etc whenever dealing with binary formats, network protocols, or file formats — plain int is 4 bytes on most systems but the standard doesn't guarantee it",
        },
        advanced: {
          explanation: "Value categories (lvalue vs rvalue) determine whether you can move from something. An lvalue has an address (it 'lives' somewhere). An rvalue is temporary — you can steal its resources with std::move.",
          code: `#include <utility>
#include <type_traits>

int x = 5;        // x is lvalue — has address, can take &x
int&& r = 5;      // 5 is rvalue — temporary, no address

// std::move — cast to rvalue so the resources can be stolen
std::string a = "hello";
std::string b = std::move(a);  // b steals a's buffer, a is now empty

// check if type is what you expect
static_assert(std::is_integral_v<int>,    "int is integral");
static_assert(std::is_same_v<decltype(42), int>, "42 is int");

// CTAD — Class Template Argument Deduction (C++17)
std::vector v = {1, 2, 3};          // no need for <int>
std::pair   p = {10, 3.14};         // deduced pair<int,double>

// if constexpr — compile-time branching in templates
template<typename T>
void print_type(T val) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "integer: " << val;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "float: " << val;
    }
}`,
          examples: [
            { input: `std::string a = "hello";\nstd::string b = std::move(a);\nstd::cout << a.size() << " " << b.size();`, output: `0 5  // a is emptied, b has the data` },
          ],
          note: "std::move doesn't actually move anything — it casts to rvalue reference which allows the move constructor to be called. the actual moving happens in the move constructor",
        },
      }),

      card("references + pointers", {
        beginner: {
          explanation: "A reference is another name for an existing variable — changing the reference changes the original. A pointer stores an address and can be null or point to different things. References are safer and preferred in C++.",
          code: `int x = 10;

// reference — just another name for x
int& ref = x;
ref = 20;           // x is now 20
std::cout << x;     // 20

// pointer — stores the address of x
int* ptr = &x;      // & means "address of"
*ptr = 30;          // * means "value at address"
std::cout << x;     // 30

// references can't be null, can't be reseated
// pointers can be null and can point to different things
ptr = nullptr;  // ok — pointer can be null
// ref = ??? — can't make ref point to something else

// const reference — read only, no copy
void print(const std::string& s) {
    std::cout << s;  // s can't be modified here
    // but it's also not copied — efficient!
}`,
          examples: [
            { input: `int x=5; int& r=x; r=99;\nstd::cout << x;`, output: `99` },
            { input: `int x=5; int* p=&x; *p=99;\nstd::cout << x;`, output: `99` },
          ],
          note: "use const reference for function parameters when passing large objects — it avoids making a copy (fast) and marks the parameter read-only (safe). pass small things like int and float by value",
        },
        intermediate: {
          explanation: "Smart pointers manage heap memory automatically — they call delete when they go out of scope. unique_ptr means one owner. shared_ptr uses reference counting for multiple owners. These replace raw new/delete in modern C++.",
          code: `#include <memory>

// unique_ptr — ONE owner, freed when goes out of scope
auto p = std::make_unique<int>(42);
std::cout << *p;   // 42
// freed automatically — no delete needed!

// can't copy a unique_ptr (that would give two owners)
// auto p2 = p;  // ERROR
auto p2 = std::move(p);  // transfer ownership — p is now empty

// shared_ptr — MULTIPLE owners, freed when LAST owner is gone
auto s1 = std::make_shared<std::string>("hello");
auto s2 = s1;   // both own it, reference count = 2
// freed when BOTH s1 and s2 go out of scope

// weak_ptr — watch without owning (doesn't prevent deletion)
std::weak_ptr<std::string> w = s1;
if (auto locked = w.lock()) {     // try to get shared_ptr
    std::cout << *locked;          // safe — object still alive
}`,
          examples: [
            { input: `auto p = std::make_unique<int>(42);\nstd::cout << *p;\n// freed automatically when p goes out of scope`, output: `42  // no memory leak` },
          ],
          note: "prefer make_unique and make_shared over raw new — they're exception-safe and slightly faster for shared_ptr (one allocation instead of two)",
        },
        advanced: {
          explanation: "std::span is a non-owning view over contiguous memory — like a reference to a slice of an array or vector. It works with any contiguous container without copying. It's the modern way to write functions that accept 'some sequence of T'.",
          code: `#include <span>
#include <vector>
#include <array>

// span — non-owning view, works with anything contiguous
void double_all(std::span<int> data) {
    for (int& x : data) x *= 2;
}

std::vector<int> v = {1, 2, 3, 4};
std::array<int, 3> a = {5, 6, 7};
int raw[] = {8, 9, 10};

double_all(v);    // works
double_all(a);    // works
double_all(raw);  // works — same function, different containers

// span with size restriction
void read_header(std::span<const uint8_t, 16> header) {
    // header is exactly 16 bytes, checked at compile time
}

// reference to const for big objects, span for sequences
void process(const std::string& name, std::span<int> nums) {
    // name — const ref, no copy
    // nums — span, no copy, can modify elements
}`,
          examples: [
            { input: `std::vector<int> v={1,2,3};\ndouble_all(v);\nfor(int x:v) std::cout<<x<<" ";`, output: `2 4 6` },
          ],
          note: "span doesn't own the data — make sure the underlying array/vector outlives the span. a dangling span is as dangerous as a dangling pointer",
        },
      }),

      card("STL containers", {
        beginner: {
          explanation: "The STL (Standard Template Library) gives you ready-made data structures. vector is a resizable array — the most common container. map stores key-value pairs sorted by key. unordered_map is faster but unsorted.",
          code: `#include <vector>
#include <map>
#include <string>

// vector — resizable array
std::vector<int> nums = {3, 1, 4, 1, 5};
nums.push_back(9);     // add to end
nums.pop_back();       // remove from end
nums.size();           // how many elements
nums[0];               // first element (no bounds check)
nums.at(0);            // first element (throws if out of bounds)

// range-based for loop — cleanest way to iterate
for (int n : nums) {
    std::cout << n << " ";
}

// map — key-value pairs, sorted by key
std::map<std::string, int> scores;
scores["alice"] = 95;
scores["bob"]   = 87;
scores.count("alice");   // 1 if exists, 0 if not
scores["carol"];         // creates entry with value 0 if not found!`,
          examples: [
            { input: `std::vector<int> v={1,2,3};\nv.push_back(4);\nstd::cout << v.size();`, output: `4` },
            { input: `std::map<std::string,int> m;\nm["x"]=10;\nstd::cout << m.count("x") << m.count("y");`, output: `1 0` },
          ],
          note: "map[key] creates the key with a default value (0 for int) if it doesn't exist. to safely check existence without creating, use .count(key) or .find(key) != m.end()",
        },
        intermediate: {
          explanation: "unordered_map is O(1) average vs map's O(log n). vector::reserve prevents costly reallocations when you know the final size. Algorithms in <algorithm> work on any container via iterators.",
          code: `#include <unordered_map>
#include <algorithm>
#include <numeric>

// unordered_map — O(1) average, no ordering guarantee
std::unordered_map<std::string, int> freq;
for (const auto& word : words) freq[word]++;

// reserve — pre-allocate to avoid reallocations
std::vector<int> v;
v.reserve(1000);   // allocate space for 1000 elements upfront
// now 1000 push_backs won't reallocate

// structured bindings (C++17) — unpack pairs
for (const auto& [key, val] : freq) {
    std::cout << key << ": " << val << "\\n";
}

// algorithms — work on any container
std::sort(v.begin(), v.end());                // ascending
std::sort(v.begin(), v.end(), std::greater<int>{}); // descending
auto it = std::find(v.begin(), v.end(), 42);
bool found = it != v.end();
int total = std::accumulate(v.begin(), v.end(), 0);
std::fill(v.begin(), v.end(), 0);  // set all to 0`,
          examples: [
            { input: `std::vector<int> v={5,3,1,4,2};\nstd::sort(v.begin(),v.end());\nfor(int x:v) std::cout<<x<<" ";`, output: `1 2 3 4 5` },
          ],
        },
        advanced: {
          explanation: "Move semantics make container operations cheap. Moving a vector is O(1) — just pointer theft. std::move signals 'I'm done with this, steal its guts'. emplace_back constructs in-place, avoiding a copy.",
          code: `#include <vector>
#include <utility>

std::vector<int> a = {1, 2, 3, 4, 5};

// copy — O(n), makes a duplicate
std::vector<int> b = a;

// move — O(1), steals a's internal buffer
std::vector<int> c = std::move(a);
// a is now empty (valid but unspecified state)
// c has the data

// emplace_back — construct in-place, no copy
struct Point { float x, y; };
std::vector<Point> pts;
pts.push_back({1.0f, 2.0f});   // creates temporary, then copies/moves
pts.emplace_back(1.0f, 2.0f);  // constructs directly in vector — faster

// erase elements by value (erase-remove idiom)
v.erase(std::remove(v.begin(), v.end(), 42), v.end());

// ranges (C++20) — cleaner algorithms
#include <ranges>
auto evens = v | std::views::filter([](int x){ return x%2==0; })
               | std::views::transform([](int x){ return x*x; });`,
          examples: [
            { input: `std::vector<int> a={1,2,3};\nstd::vector<int> b=std::move(a);\nstd::cout<<a.size()<<" "<<b.size();`, output: `0 3  // a emptied, b has data` },
          ],
          note: "after std::move, the moved-from object is in a valid but unspecified state — you can destroy it or reassign it, but don't read from it",
        },
      }),
    ]),

    section("classes", "classes + OOP", [
      card("class basics", {
        beginner: {
          explanation: "A class bundles data and functions that operate on that data. public members are accessible from outside. private members are only accessible inside the class. The constructor runs automatically when you create an object.",
          code: `#include <iostream>
#include <string>

class Dog {
public:   // anyone can access these
    // constructor — runs when Dog is created
    Dog(std::string name, int age) {
        this->name = name;  // this-> means "my"
        this->age  = age;
    }

    void bark() {
        std::cout << name << " says: Woof!\\n";
    }

    std::string getName() { return name; }
    int         getAge()  { return age; }

private:  // only Dog can access these
    std::string name;
    int         age;
};

int main() {
    Dog rex("Rex", 3);
    rex.bark();                   // Rex says: Woof!
    std::cout << rex.getName();   // Rex
}`,
          examples: [
            { input: `Dog d("Buddy", 5);\nstd::cout << d.getName() << " " << d.getAge();`, output: `Buddy 5` },
          ],
          note: "private is the default in classes (public is default in structs). always make data private and expose it through functions — this lets you change the internal representation later without breaking code that uses the class",
        },
        intermediate: {
          explanation: "Initializer lists initialize members before the constructor body runs — this is faster than assigning in the body because it constructs directly instead of default-constructing then assigning.",
          code: `class Vec2 {
public:
    // initializer list — members are initialized HERE, not in the body
    Vec2(float x, float y) : x_(x), y_(y) {}  // faster than assigning in body
    Vec2() : x_(0.0f), y_(0.0f) {}             // default constructor

    // const method — can be called on const objects, doesn't modify *this
    float length() const {
        return std::sqrt(x_*x_ + y_*y_);
    }

    // operator overloading — make + work on Vec2
    Vec2 operator+(const Vec2& o) const {
        return Vec2(x_ + o.x_, y_ + o.y_);
    }

    // += modifies in place and returns reference for chaining
    Vec2& operator+=(const Vec2& o) {
        x_ += o.x_; y_ += o.y_;
        return *this;
    }

    // friend function — can access private members
    friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {
        return os << "(" << v.x_ << ", " << v.y_ << ")";
    }

private:
    float x_, y_;  // trailing underscore = private member convention
};`,
          examples: [
            { input: `Vec2 a{3,4};\nstd::cout << a.length();`, output: `5` },
            { input: `Vec2 a{1,2}, b{3,4};\nstd::cout << a + b;`, output: `(4, 6)` },
          ],
        },
        advanced: {
          explanation: "RAII (Resource Acquisition Is Initialization) ties resource lifetime to object lifetime. The destructor guarantees cleanup even if an exception is thrown. This is the core of C++ memory and resource safety.",
          code: `#include <memory>
#include <stdexcept>

// RAII class — manages a resource
class FileHandle {
public:
    explicit FileHandle(const char* path)
        : f_(std::fopen(path, "rb")) {
        if (!f_) throw std::runtime_error("can't open file");
    }

    ~FileHandle() {
        if (f_) std::fclose(f_);  // ALWAYS runs, even if exception thrown
    }

    // disable copying — two handles to same file would double-close
    FileHandle(const FileHandle&)            = delete;
    FileHandle& operator=(const FileHandle&) = delete;

    // allow moving — transfer ownership
    FileHandle(FileHandle&& o) noexcept : f_(o.f_) { o.f_ = nullptr; }
    FileHandle& operator=(FileHandle&&) noexcept = default;

    FILE* get() { return f_; }

private:
    FILE* f_;
};

{
    FileHandle f("data.bin");
    // use f...
}  // destructor called here — file closed automatically, no leak`,
          examples: [
            { input: `{\n    FileHandle f("data.bin");\n    // throw exception here\n}  // destructor still runs — file closed!`, output: `no resource leak even with exceptions` },
          ],
          note: "the Rule of Five: if you define any of destructor, copy constructor, copy assignment, move constructor, move assignment — define all five. or use = delete/= default to be explicit",
        },
      }),

      card("inheritance + polymorphism", {
        beginner: {
          explanation: "Inheritance lets one class be built on top of another, inheriting its properties and methods. virtual functions let you call the right version of a method even when accessing an object through a base class pointer.",
          code: `class Shape {
public:
    // virtual = can be overridden by derived classes
    virtual float area() const = 0;  // pure virtual — MUST be overridden
    virtual void  describe() const {
        std::cout << "I am a shape with area " << area() << "\\n";
    }
    virtual ~Shape() = default;  // always virtual destructor in base class!
};

class Circle : public Shape {    // Circle inherits from Shape
    float radius_;
public:
    Circle(float r) : radius_(r) {}
    float area() const override { // override = explicitly override virtual
        return 3.14159f * radius_ * radius_;
    }
};

class Rectangle : public Shape {
    float w_, h_;
public:
    Rectangle(float w, float h) : w_(w), h_(h) {}
    float area() const override { return w_ * h_; }
};

// polymorphism — call correct method through base pointer
std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(5.0f));
shapes.push_back(std::make_unique<Rectangle>(4.0f, 3.0f));

for (const auto& s : shapes) {
    s->describe();  // calls correct area() for each type
}`,
          examples: [
            { input: `std::unique_ptr<Shape> s = std::make_unique<Circle>(5.0f);\nstd::cout << s->area();`, output: `78.5397...` },
          ],
          note: "always declare destructors virtual in base classes. without it, deleting a derived object through a base pointer only calls the base destructor, leaking the derived class's resources",
        },
        intermediate: {
          explanation: "Concepts (C++20) constrain template types at the call site instead of getting confusing errors deep in template instantiation. They make template code readable and give better error messages.",
          code: `#include <concepts>

// concept — describes what a type must support
template<typename T>
concept Printable = requires(T t, std::ostream& os) {
    { os << t } -> std::convertible_to<std::ostream&>;
};

template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

// constrained template — only works with Numeric types
template<Numeric T>
T clamp(T val, T lo, T hi) {
    return std::min(std::max(val, lo), hi);
}

clamp(15, 0, 10);    // ok — int is Numeric
clamp(15.0, 0.0, 10.0); // ok — double is Numeric
// clamp("hi", "a", "z"); // ERROR — string is not Numeric (clear message)

// requires clause — inline constraint
template<typename T>
    requires std::copyable<T> && std::equality_comparable<T>
void deduplicate(std::vector<T>& v) {
    std::sort(v.begin(), v.end());
    v.erase(std::unique(v.begin(), v.end()), v.end());
}`,
          examples: [
            { input: `clamp(15, 0, 10)`, output: `10` },
            { input: `clamp(-5, 0, 10)`, output: `0` },
          ],
        },
      }),
    ]),
  ],
});
