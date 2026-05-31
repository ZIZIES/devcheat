import { lang, section, card } from '../helpers';

export default lang({
  id: "batch", name: "Batch", ext: ".bat", year: 1981, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + basics", {
        beginner: {
          explanation: "Batch is the scripting language of the Windows Command Prompt. It's been around since DOS in 1981. You use it to automate Windows tasks — copying files, running programs, setting up environments. Batch files end in .bat or .cmd. It's not pretty but it's everywhere on Windows.",
          code: `@ECHO OFF
REM @ECHO OFF stops commands from printing before they run
REM REM = comment (Remark)

REM variables — use SET, no spaces around =
SET name=Alice
SET age=25

REM use variables with %% around the name
ECHO Hello, %name%!
ECHO You are %age% years old

REM arithmetic — must use SET /A
SET /A result = 5 + 3
SET /A doubled = %age% * 2
ECHO 5 + 3 = %result%

REM command output into variable
FOR /F "tokens=*" %%i IN ('date /t') DO SET today=%%i
ECHO Today is %today%

REM user input
SET /P username=Enter your name:
ECHO Hello, %username%!

PAUSE   REM wait for keypress before closing`,
          examples: [
            { input: `SET /A x = 10 * 5\nECHO %x%`, output: `50` },
            { input: `SET name=World\nECHO Hello, %name%!`, output: `Hello, World!` },
          ],
          note: "NO spaces around = in SET statements. SET name = Alice sets a variable named 'name ' (with a trailing space) which is different from 'name'. this causes countless batch bugs",
        },
        intermediate: {
          explanation: "Batch if statements compare strings or numbers. The comparison operators are different from most languages. Files and directories can be tested with IF EXIST.",
          code: `@ECHO OFF

SET /A x = 15

REM number comparison — use EQU NEQ LSS LEQ GTR GEQ
IF %x% GTR 10 (
    ECHO x is greater than 10
) ELSE IF %x% EQU 10 (
    ECHO x equals 10
) ELSE (
    ECHO x is less than 10
)

REM string comparison — use == and != with quotes
SET animal=cat
IF "%animal%"=="cat" ECHO it's a cat
IF NOT "%animal%"=="dog" ECHO not a dog

REM file/directory tests
IF EXIST "C:\Windows" ECHO Windows folder exists
IF NOT EXIST "output.txt" (
    ECHO creating output file...
    ECHO placeholder > output.txt
)

REM loops
FOR /L %%i IN (1,1,5) DO ECHO %%i    REM count 1 to 5

FOR %%f IN (*.txt) DO (              REM loop over files
    ECHO Found: %%f
)

REM functions via CALL and labels
CALL :greet Alice
GOTO :EOF    REM skip past function definitions

:greet
    ECHO Hello, %~1!
    EXIT /B 0`,
          examples: [
            { input: `FOR /L %%i IN (1,1,3) DO ECHO %%i`, output: `1\n2\n3` },
            { input: `IF EXIST "file.txt" (ECHO exists) ELSE (ECHO missing)`, output: `exists or missing` },
          ],
          note: "always quote variables in comparisons: IF \"%var%\"==\"value\" — if var is empty, IF %var%==value becomes IF ==value which is a syntax error",
        },
        advanced: {
          explanation: "Batch has string manipulation through variable substring syntax, delayed expansion for variables inside loops, and error handling through ERRORLEVEL.",
          code: `@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION
REM ENABLEDELAYEDEXPANSION lets you use !var! inside loops
REM needed because %var% is expanded BEFORE the loop runs

REM string operations
SET str=Hello, World!
ECHO Length trick: call :strlen result str

REM substring: %var:~start,length%
ECHO %str:~0,5%      REM Hello (chars 0-4)
ECHO %str:~7%        REM World! (from char 7)
ECHO %str:~-6%       REM orld!  (last 6 chars)

REM string replace: %var:old=new%
SET fixed=%str:World=Batch%
ECHO %fixed%         REM Hello, Batch!

REM delayed expansion — use !var! inside loops
SET count=0
FOR /L %%i IN (1,1,5) DO (
    SET /A count+=1
    ECHO Count: !count!   REM use ! not % inside loops
)

REM error handling
some_command.exe
IF ERRORLEVEL 1 (
    ECHO command failed with code %ERRORLEVEL%
    EXIT /B %ERRORLEVEL%
)

REM check specific exit code
some_command.exe
IF %ERRORLEVEL% EQU 2 ECHO access denied`,
          examples: [
            { input: `SET s=Hello World\nECHO %s:~0,5%`, output: `Hello` },
            { input: `SET s=Hello World\nECHO %s:World=Batch%`, output: `Hello Batch` },
          ],
          note: "ERRORLEVEL is checked with IF ERRORLEVEL n which means 'if exit code is n OR HIGHER'. to check for exactly 0, use IF %ERRORLEVEL% EQU 0, not IF ERRORLEVEL 0 (which is always true)",
        },
      }),
    ]),
  ],
});
