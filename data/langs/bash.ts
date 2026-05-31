import { lang, section, card } from '../helpers';

export default lang({
  id: "bash", name: "Bash", ext: ".sh", year: 1989, common: true,
  sections: [
    section("basics", "basics", [
      card("variables + strings", {
        beginner: {
          explanation: "Bash is the language of the terminal — it lets you automate tasks by stringing commands together. Variables are created with = (no spaces!). To use a variable, put a $ in front of it. Bash is very picky about spaces.",
          code: `#!/bin/bash
# The line above tells the OS to run this with bash

# Variable assignment — NO SPACES around =
name="Alice"
age=25
greeting="Hello"

# Use variables with $
echo "$greeting, $name!"    # Hello, Alice!
echo "You are $age years old"

# Command substitution — run a command and use its output
today=$(date +%Y-%m-%d)    # today = "2024-01-15"
files=$(ls | wc -l)        # count files in directory
echo "Today is $today, $files files here"

# Arithmetic — use $(( ))
result=$((5 + 3))
doubled=$((age * 2))
echo "5 + 3 = $result"     # 5 + 3 = 8`,
          examples: [
            { input: `name="World"\necho "Hello, $name!"`, output: `Hello, World!` },
            { input: `echo $((2 ** 10))`, output: `1024` },
          ],
          note: "NEVER put spaces around = when assigning: name = 'Alice' is an ERROR. Bash thinks you're running a command called 'name'. x=1 is assignment, x = 1 is a syntax error",
        },
        intermediate: {
          explanation: "Bash strings have two flavors: double quotes expand variables and commands, single quotes treat everything literally. Curly braces ${var} let you do string operations like slicing, replacement, and defaults.",
          code: `name="hello world"

# length of string
echo ${#name}              # 11

# substring: ${var:start:length}
echo ${name:0:5}           # hello
echo ${name:6}             # world (from index 6 to end)

# replace: ${var/old/new}
echo ${name/hello/hi}      # hi world
echo ${name//l/L}          # heLLo worLd (replace ALL)

# default value if empty: ${var:-default}
unset email
echo ${email:-"no email"}  # no email
echo ${email:="set now"}   # sets email AND echoes it

# uppercase/lowercase (bash 4+)
echo ${name^^}             # HELLO WORLD
echo ${name,,}             # hello world (already lower)

# arrays
fruits=("apple" "banana" "cherry")
echo ${fruits[0]}          # apple
echo ${fruits[@]}          # all elements
echo ${#fruits[@]}         # 3 (length)`,
          examples: [
            { input: `s="Hello, World!"\necho ${s:7:5}`, output: `World` },
            { input: `s="hello"\necho ${s^^}`, output: `HELLO` },
          ],
        },
        advanced: {
          explanation: "Process substitution <() lets you treat command output as a file. Here strings (<<<) pass a string as stdin. Named pipes and /dev/fd tricks enable powerful shell programming.",
          code: `# process substitution — use command output as a file
diff <(sort file1.txt) <(sort file2.txt)
# compares two files after sorting, without creating temp files

# here string — pass string as stdin
while read line; do
    echo "got: $line"
done <<< "line1
line2
line3"

# mapfile — read lines into array
mapfile -t lines < file.txt   # each line becomes array element

# nameref — reference another variable by name (bash 4.3+)
declare -n ref=myvar
myvar="hello"
echo $ref   # hello
ref="world"
echo $myvar # world

# associative arrays (like dictionaries)
declare -A config
config["host"]="localhost"
config["port"]="5432"
echo ${config["host"]}   # localhost
for key in "${!config[@]}"; do
    echo "$key = ${config[$key]}"
done`,
          examples: [
            { input: `declare -A m\nm["x"]=10\nm["y"]=20\necho ${m["x"]}`, output: `10` },
          ],
          note: "process substitution <() creates a named pipe (a special file). the command runs and its output can be read like a file. this avoids temp files and is composable",
        },
      }),

      card("control flow + functions", {
        beginner: {
          explanation: "Bash if statements check the exit code of a command — 0 means success/true, anything else means failure/false. [[ ]] is the modern test command. for loops iterate over lists. Functions use () and curly braces.",
          code: `# if statement — checks exit code of command
if [[ $age -gt 18 ]]; then
    echo "adult"
elif [[ $age -eq 18 ]]; then
    echo "just turned 18"
else
    echo "minor"
fi

# comparison operators for numbers: -gt -lt -ge -le -eq -ne
# comparison operators for strings: == != < >

# string tests
if [[ -z "$name" ]]; then echo "name is empty"; fi
if [[ -n "$name" ]]; then echo "name is not empty"; fi

# file tests
if [[ -f "file.txt" ]]; then echo "file exists"; fi
if [[ -d "mydir"   ]]; then echo "directory exists"; fi

# for loop
for i in 1 2 3 4 5; do
    echo "number: $i"
done

# C-style for loop
for ((i=0; i<5; i++)); do
    echo "$i"
done

# function
greet() {
    local name="$1"    # $1 = first argument, local = scope to function
    echo "Hello, $name!"
}
greet "Alice"`,
          examples: [
            { input: `for f in *.sh; do echo "$f"; done`, output: `lists all .sh files` },
            { input: `[[ "hello" == "hello" ]] && echo "equal"`, output: `equal` },
          ],
          note: "local makes a variable only exist inside the function. without local, variables are global in bash — this causes bugs when function variables clash with outer variables",
        },
        intermediate: {
          explanation: "Pipelines chain commands — the output of one becomes the input of the next. Redirection sends output to files or takes input from files. The exit code ($?) of the last command tells you if it succeeded.",
          code: `# pipes — chain commands
cat access.log | grep "ERROR" | sort | uniq -c | sort -rn
# read file | find errors | sort lines | count unique | sort by count

# redirection
command > output.txt       # stdout to file (overwrites)
command >> output.txt      # stdout to file (appends)
command 2> errors.txt      # stderr to file
command 2>&1               # stderr into stdout
command &> all.txt         # both stdout and stderr to file
command < input.txt        # read stdin from file
command 2>/dev/null        # discard stderr

# check exit code
ls /nonexistent 2>/dev/null
if [[ $? -ne 0 ]]; then   # $? = exit code of last command
    echo "failed"
fi

# or use directly
if ls /nonexistent 2>/dev/null; then
    echo "success"
else
    echo "failed"
fi

# tee — write to file AND stdout at the same time
echo "hello" | tee output.txt | wc -c`,
          examples: [
            { input: `echo "hello world" | wc -w`, output: `2  # count words` },
            { input: `ls /fake 2>/dev/null || echo "not found"`, output: `not found` },
          ],
        },
        advanced: {
          explanation: "Bash traps let you run cleanup code when the script exits or receives a signal. set -euo pipefail makes scripts fail fast on errors instead of silently continuing.",
          code: `#!/bin/bash
set -euo pipefail
# -e  exit immediately if any command fails
# -u  treat undefined variables as errors
# -o pipefail  pipe fails if any command in it fails

# trap — run cleanup when script exits
cleanup() {
    echo "cleaning up..."
    rm -f /tmp/my-lockfile
}
trap cleanup EXIT    # runs on any exit (normal or error)
trap 'echo "interrupted!"' INT   # runs on Ctrl+C

# create lockfile to prevent concurrent runs
LOCKFILE="/tmp/my-script.lock"
if ! mkdir "$LOCKFILE" 2>/dev/null; then
    echo "already running"
    exit 1
fi
# trap ensures lockfile is removed even if script crashes

# parallel execution
for url in "${urls[@]}"; do
    curl -s "$url" &    # & runs in background
done
wait                    # wait for all background jobs

# error handling
err_handler() {
    local line=$1
    echo "Error on line $line"
    exit 1
}
trap 'err_handler $LINENO' ERR`,
          examples: [
            { input: `set -e\nfail_cmd\necho "never runs"`, output: `script exits immediately at fail_cmd` },
          ],
          note: "set -euo pipefail should be at the top of every serious bash script. without it, scripts continue running after errors and you get silent failures that are very hard to debug",
        },
      }),
    ]),
  ],
});
