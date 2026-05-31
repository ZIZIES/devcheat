import { lang, section, card } from '../helpers';

export default lang({
  id: "powershell", name: "PowerShell", ext: ".ps1", year: 2006, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + basics", {
        beginner: {
          explanation: "PowerShell is Microsoft's modern scripting language for Windows administration. Unlike Batch which works with text, PowerShell works with .NET objects — so when you get a list of files, you get actual file objects with properties, not just strings. It's available on macOS and Linux too.",
          code: `# hash is the comment character

# variables start with $
$name  = "Alice"
$age   = 25
$pi    = 3.14

# print
Write-Host "Hello, $name!"     # prints to console (human output)
Write-Output "Hello, $name!"   # outputs to pipeline (prefer this)

# string interpolation (double quotes only)
$greeting = "Hello, $name! Age: $age"
$calc     = "Double: $($age * 2)"   # expressions need $()

# single quotes — no interpolation
$literal = 'Hello, $name'    # prints literally: Hello, $name

# here-string — multi-line
$text = @"
This is line 1
Name: $name
Age: $age
"@    # closing @" must be at start of line

# types
$x = 42                    # Int32
$y = 3.14                  # Double
$b = $true                 # Boolean ($true/$false not true/false)
$n = $null                 # null ($null not null)
[int]$typed = "42"         # force type conversion`,
          examples: [
            { input: `$x = 5\nWrite-Host "x * 2 = $($x * 2)"`, output: `x * 2 = 10` },
            { input: `[int]"42" + 8`, output: `50  # string converted to int` },
          ],
          note: "Write-Host is for human output (goes to console only). Write-Output goes into the pipeline and can be captured. use Write-Output in scripts, Write-Host only for interactive messages",
        },
        intermediate: {
          explanation: "PowerShell works with objects, not text. Commands output objects with properties. The pipeline passes objects between commands. This makes filtering and processing much more powerful than Bash.",
          code: `# Get-ChildItem — like ls/dir but returns objects
$files = Get-ChildItem -Path . -Filter *.txt

# access object properties
foreach ($file in $files) {
    Write-Host "$($file.Name): $($file.Length) bytes"
}

# pipeline — pass objects between commands
Get-ChildItem . |
    Where-Object { $_.Length -gt 1MB } |   # filter large files
    Sort-Object Length -Descending |         # sort by size
    Select-Object Name, Length               # pick columns

# $_ = current object in pipeline

# conditional operators are different from Bash
# -eq -ne -lt -le -gt -ge (for numbers)
# -like -match (for strings, with wildcards/regex)
if ($age -gt 18) { "adult" }
if ($name -like "A*") { "starts with A" }   # wildcard
if ($name -match "^A.+e$") { "regex match" } # regex

# foreach-object in pipeline
1..10 | ForEach-Object { $_ * 2 }   # 2,4,6,...,20

# where-object filtering
Get-Process | Where-Object { $_.CPU -gt 10 }`,
          examples: [
            { input: `1..5 | ForEach-Object { $_ * $_ }`, output: `1\n4\n9\n16\n25` },
            { input: `Get-Service | Where-Object Status -eq "Running" | Measure-Object | Select Count`, output: `Count: (number of running services)` },
          ],
        },
        advanced: {
          explanation: "PowerShell functions support advanced parameter validation, pipeline input, and CmdletBinding. Error handling uses try/catch with .NET exceptions. Modules package reusable functions.",
          code: `# advanced function with parameter validation
function Get-UserInfo {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [string]$UserName,

        [ValidateRange(1, 150)]
        [int]$Age,

        [ValidateSet("admin", "user", "guest")]
        [string]$Role = "user"
    )

    process {   # runs for each pipeline input
        [PSCustomObject]@{
            Name = $UserName
            Age  = $Age
            Role = $Role
        }
    }
}

"Alice", "Bob" | Get-UserInfo -Age 25

# error handling
try {
    Get-Item "nonexistent.txt" -ErrorAction Stop
} catch [System.IO.FileNotFoundException] {
    Write-Warning "File not found: $_"
} catch {
    Write-Error "Unexpected error: $_"
} finally {
    Write-Host "always runs"
}

# jobs — run in background
$job = Start-Job { Start-Sleep 5; "done" }
Wait-Job $job
Receive-Job $job   # "done"`,
          examples: [
            { input: `"Alice","Bob" | Get-UserInfo -Age 25 -Role admin`, output: `Name  Age Role\n----  --- ----\nAlice  25 admin\nBob    25 admin` },
          ],
          note: "ValueFromPipeline means the function accepts input from the pipeline. the process {} block runs once per piped object. the begin {} block runs once before any pipeline input, end {} after all",
        },
      }),
    ]),
  ],
});
