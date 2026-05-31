import { lang, section, card } from '../helpers';

export default lang({
  id: "elixir", name: "Elixir", ext: ".ex", year: 2011, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + immutability", {
        beginner: {
          explanation: "Elixir runs on the Erlang VM (BEAM), which was built to power telephone systems that need to run for years without stopping. Elixir is used for real-time apps, chat systems, and APIs that need to handle millions of users. Like Haskell, all data is immutable — you never change data, you create new versions of it.",
          code: `# hash is the comment character

# binding — not really "assignment" since data is immutable
name = "Alice"
age  = 25

# rebinding is allowed — but you're creating a new binding, not changing the old value
age = 26   # this is fine
# the old value 25 still exists if something else holds a reference to it

# atoms — like symbols, they are their own value
status = :ok
result = :error
# :ok, :error, :pending are common atoms

# string interpolation
IO.puts("Hello, #{name}!")   # Hello, Alice!
IO.puts("Age: #{age}")

# pattern matching with = (it's not just assignment!)
{a, b} = {1, 2}   # a = 1, b = 2
[head | tail] = [1, 2, 3, 4]  # head = 1, tail = [2,3,4]

# this is why = is called the MATCH operator, not assignment
{:ok, value} = {:ok, 42}  # matches and binds value = 42
# {:ok, value} = {:error, "oops"}  # crash — doesn't match!`,
          examples: [
            { input: `{a, b, c} = {1, 2, 3}\nIO.puts(a + b + c)`, output: `6` },
            { input: `[h | t] = [10, 20, 30]\nIO.inspect({h, t})`, output: `{10, [20, 30]}` },
          ],
          note: "the = operator in Elixir is pattern matching, not assignment. {a, b} = {1, 2} succeeds if the right side matches the pattern on the left, binding variables as it goes. it crashes if the pattern doesn't match",
        },
        intermediate: {
          explanation: "The pipe operator |> passes the result of one function as the first argument to the next. This is Elixir's most used feature and makes data transformation pipelines very readable.",
          code: `# pipe operator |> — thread data through functions
# instead of:
String.upcase(String.trim("  hello  "))

# write:
"  hello  "
|> String.trim()
|> String.upcase()
# "HELLO"

# realistic pipeline
result =
    users
    |> Enum.filter(fn u -> u.age >= 18 end)
    |> Enum.map(fn u -> u.name end)
    |> Enum.sort()
    |> Enum.join(", ")

# Enum module — works on any enumerable
Enum.map([1,2,3], fn x -> x * 2 end)     # [2, 4, 6]
Enum.filter([1,2,3,4], fn x -> rem(x, 2) == 0 end)  # [2, 4]
Enum.reduce([1,2,3,4,5], 0, fn x, acc -> x + acc end) # 15

# shorthand with & capture operator
Enum.map([1,2,3], &(&1 * 2))    # [2,4,6]  &1 = first argument
Enum.filter([1,2,3,4], &(rem(&1,2) == 0))  # [2,4]`,
          examples: [
            { input: `[1,2,3,4,5] |> Enum.filter(&(rem(&1,2)==0)) |> Enum.sum()`, output: `6  (2+4)` },
            { input: `"hello world" |> String.split() |> Enum.count()`, output: `2` },
          ],
        },
        advanced: {
          explanation: "Elixir processes are the key to its scalability. Each process has its own memory and communicates only by sending messages. Millions of processes can run simultaneously. If one crashes, it doesn't affect others.",
          code: `# spawn a process — runs concurrently
pid = spawn(fn ->
    IO.puts("I'm running in a separate process!")
end)

# send a message to a process
send(pid, {:hello, "world"})

# receive messages in the current process
receive do
    {:hello, msg} -> IO.puts("Got: #{msg}")
    {:error, reason} -> IO.puts("Error: #{reason}")
after
    5000 -> IO.puts("no message after 5 seconds")
end

# Agent — simple state management process
{:ok, agent} = Agent.start_link(fn -> 0 end)

Agent.update(agent, fn state -> state + 1 end)
Agent.update(agent, fn state -> state + 1 end)
Agent.get(agent, fn state -> state end)   # 2

# Task — async computation
task = Task.async(fn ->
    # expensive computation
    :timer.sleep(1000)
    "result"
end)

# do other work...
result = Task.await(task)   # wait for result
IO.puts(result)`,
          examples: [
            { input: `task = Task.async(fn -> 1 + 1 end)\nTask.await(task)`, output: `2` },
          ],
          note: "Elixir processes are not OS threads — they're extremely lightweight (a few KB each). you can spawn millions of them. the BEAM VM schedules them on OS threads, similar to Go goroutines",
        },
      }),
    ]),
  ],
});
