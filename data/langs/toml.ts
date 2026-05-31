import { lang, section, card } from '../helpers';

export default lang({
  id: "toml", name: "TOML", ext: ".toml", year: 2013, common: false,
  sections: [
    section("basics", "basics", [
      card("keys + values", {
        beginner: {
          explanation: "TOML (Tom's Obvious Minimal Language) is a config file format designed to be easy to read. You've seen it if you've used Rust (Cargo.toml), Python packaging (pyproject.toml), or Hugo. It's like a more structured version of .env files. Values have types — strings need quotes, numbers don't.",
          code: `# hash is the comment character

# basic key = value pairs
name = "Alice"
age  = 25
pi   = 3.14159
active = true

# strings — use double quotes
city = "Boston"
path = 'C:\\Users\\Alice'   # single quotes = literal (no escapes)

# multi-line string
description = """
This is a
multi-line string.
"""

# dates and times (ISO 8601)
created_at = 2024-01-15
born_at    = 1999-07-04T12:00:00Z

# arrays
tags   = ["rust", "systems", "fast"]
scores = [95, 87, 92]
mixed  = [1, 2.0, "three"]   # mixed types ok in arrays`,
          examples: [
            { input: `# Python reading TOML\nimport tomllib\nwith open("config.toml","rb") as f:\n    data = tomllib.load(f)\nprint(data["name"])`, output: `Alice` },
            { input: `# Rust reading TOML\n[dependencies]\nserde = { version = "1.0", features = ["derive"] }`, output: `standard Cargo.toml dependency format` },
          ],
          note: "single-quoted strings in TOML are literal — no escape sequences processed. 'C:\\Users\\Alice' stays as-is. double-quoted strings process escapes like \\n, \\t, \\\\",
        },
        intermediate: {
          explanation: "Tables (sections) in TOML work like dictionaries inside a file. [table] starts a new section. [[array-of-tables]] creates an array of objects. This is how Cargo.toml defines multiple dependencies, or how Hugo defines multiple menu items.",
          code: `# table — like a dictionary/object
[database]
host = "localhost"
port = 5432
name = "myapp"
ssl  = false

# nested table
[database.credentials]
user     = "admin"
password = "secret"

# inline table — all on one line
server = { host = "api.example.com", port = 443 }

# [[double brackets]] = array of tables
[[dependencies]]
name    = "serde"
version = "1.0"
features = ["derive"]

[[dependencies]]
name    = "tokio"
version = "1.0"
features = ["full"]

# equivalent to:
# dependencies = [
#   { name = "serde", version = "1.0", features = ["derive"] },
#   { name = "tokio", version = "1.0", features = ["full"] },
# ]`,
          examples: [
            { input: `[package]\nname = "my-app"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\nserde = "1.0"`, output: `standard Cargo.toml layout` },
          ],
          note: "[[double brackets]] creates an array of tables — each [[item]] block adds one element to the array. this is how you define multiple things of the same type (multiple deps, multiple build targets, etc)",
        },
        advanced: {
          explanation: "TOML vs YAML vs JSON — each has tradeoffs. TOML is best for config files with sections. YAML is more compact but has nasty parsing surprises (the Norway Problem etc). JSON has no comments and is verbose. TOML is unambiguous and readable.",
          code: `# TOML wins for config files:
# - has comments (JSON doesn't)
# - unambiguous types (YAML's 'no' parses as false)
# - sections map naturally to nested config
# - error messages are clear

# same config in all three:

# TOML
[server]
host = "localhost"
port = 8080
debug = false

# YAML equivalent
# server:
#   host: localhost
#   port: 8080
#   debug: false   # but 'no' would be false too! yaml trap

# JSON equivalent
# {
#   "server": {
#     "host": "localhost",
#     "port": 8080,
#     "debug": false
#   }
# }

# TOML gotchas:
# - can't duplicate keys
# - tables must be defined before using inline
# - datetime without timezone = "local" (ambiguous)
born = 1999-07-04         # date (no time)
event = 2024-01-15T09:00:00Z  # datetime with UTC timezone
local = 2024-01-15T09:00:00   # datetime, local timezone (ambiguous!)`,
          examples: [
            { input: `# Python 3.11+ built-in TOML parser\nimport tomllib\nwith open("pyproject.toml", "rb") as f:  # must be binary mode\n    config = tomllib.load(f)`, output: `config is a Python dict` },
          ],
          note: "Python's tomllib (3.11+) requires binary mode ('rb') not text mode ('r'). this is because TOML requires UTF-8 and the parser handles encoding itself. tomllib only reads — use tomli-w or tomllib-w to write",
        },
      }),
    ]),
  ],
});
