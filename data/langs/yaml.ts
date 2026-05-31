import { lang, section, card } from '../helpers';

export default lang({
  id: "yaml", name: "YAML", ext: ".yaml", year: 2001, common: false,
  sections: [
    section("basics", "basics", [
      card("syntax + structure", {
        beginner: {
          explanation: "YAML (YAML Ain't Markup Language) is a human-readable data format used everywhere for configuration — Docker Compose, Kubernetes, GitHub Actions, Ansible. It's indentation-based like Python. You don't 'program' in YAML, you write structured data that tools read.",
          code: `# hash is the comment character

# key: value pairs (like a dictionary)
name: Alice
age: 25
email: alice@example.com
active: true
score: 98.5
nothing: null    # null value

# INDENTATION matters — use spaces, never tabs
# nested object (2-space indent is convention)
address:
  street: 123 Main St
  city: Boston
  zip: "02101"    # quote numbers that look like numbers but aren't

# list (items start with -)
fruits:
  - apple
  - banana
  - cherry

# list of objects
users:
  - name: Alice
    age: 25
    role: admin
  - name: Bob
    age: 30
    role: user`,
          examples: [
            { input: `# Python reading YAML\nimport yaml\ndata = yaml.safe_load(open('config.yaml'))\nprint(data['name'])`, output: `Alice` },
          ],
          note: "NEVER use tabs in YAML — only spaces. mixing tabs and spaces causes cryptic parse errors. most editors have a 'convert tabs to spaces' setting. use 2-space indent consistently",
        },
        intermediate: {
          explanation: "YAML has multiline strings, anchors for reusing values, and flow style for compact notation. Docker Compose and GitHub Actions files are YAML — understanding these features helps you write better configs.",
          code: `# multiline strings
# | preserves newlines (literal block)
description: |
  This is line 1.
  This is line 2.
  These newlines are preserved.

# > folds newlines into spaces (folded block)
summary: >
  This long text will be
  folded into a single line
  with spaces between parts.

# anchors & — define a reusable value
defaults: &defaults
  timeout: 30
  retries: 3
  debug: false

development:
  <<: *defaults   # merge anchor
  debug: true     # override

production:
  <<: *defaults
  timeout: 60     # override

# flow style — inline (like JSON)
point: {x: 3, y: 4}
tags: [python, backend, api]

# multi-document — separate with ---
---
name: document 1
---
name: document 2`,
          examples: [
            { input: `# GitHub Actions step\n- name: Run tests\n  run: |\n    npm install\n    npm test\n  env:\n    NODE_ENV: test`, output: `runs two commands as a shell script` },
          ],
          note: "the merge key <<: *anchor copies all keys from the anchored mapping. overlapping keys in the current mapping take priority. this is how Docker Compose does service inheritance",
        },
        advanced: {
          explanation: "Knowing YAML's quirks prevents bugs. YAML has many 'traps' — values that look like one thing but parse as another. The Norway Problem is famous: the country code 'NO' parsed as boolean false.",
          code: `# YAML traps — things that surprise you

# booleans — all of these are TRUE or FALSE
# (in YAML 1.1, which most tools use)
yes: true          # 'yes' = true
no: false          # 'no' = false  ← The Norway Problem!
on: true           # 'on' = true
off: false         # 'off' = false

# solution: quote them when you mean strings
country_code: "NO"  # now it's the string "NO"
enabled: "yes"      # now it's the string "yes"

# numbers — these parse as numbers
version: 1.0        # float
port: 8080          # integer
hex: 0xFF           # 255

# quote when you want strings
version: "1.0"      # string "1.0"
port: "8080"        # string "8080"

# null — all of these are null
nothing1: null
nothing2: Null
nothing3: NULL
nothing4: ~
nothing5:           # empty value = null too

# octals in YAML 1.1 (another trap)
# 0777 = 511 (octal!) not the string "0777"
permissions: "0777"   # quote file permissions!

# YAML 1.2 fixes most of these (only true/false for bool)
# but most tools still use YAML 1.1`,
          examples: [
            { input: `country: NO   # parses as false, not "NO"!`, output: `{'country': False}  # the Norway Problem` },
            { input: `country: "NO"  # quoted = string`, output: `{'country': 'NO'}  # correct` },
          ],
          note: "when in doubt, quote it. strings that look like numbers, booleans, or null should always be quoted. this is especially important for version numbers, country codes, port numbers, and file permissions",
        },
      }),
    ]),
  ],
});
