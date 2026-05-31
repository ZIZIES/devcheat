import { lang, section, card } from '../helpers';

export default lang({
  id: "perl", name: "Perl", ext: ".pl", year: 1987, common: false,
  sections: [
    section("basics", "basics", [
      card("variables + syntax", {
        beginner: {
          explanation: "Perl is a text-processing powerhouse that was dominant in the 90s-2000s for web and sysadmin scripts. Variables are prefixed with sigils: $ for scalars (single values), @ for arrays, % for hashes (dictionaries). Perl is very flexible — there's always more than one way to do it.",
          code: `#!/usr/bin/perl
use strict;    # require variable declarations
use warnings;  # show helpful warnings

# scalar — single value (number or string)
my $name = "Alice";
my $age  = 25;
my $pi   = 3.14159;

# string interpolation in double quotes
print "Hello, $name!\\n";           # Hello, Alice!
print "You are $age years old\\n";

# no interpolation in single quotes
print 'Hello, $name\\n';            # Hello, $name\n (literal)

# string operations
my $upper = uc($name);              # ALICE
my $lower = lc($name);              # alice
my $len   = length($name);          # 5
my $rev   = reverse($name);         # ecilA

# numbers
print $age + 5, "\\n";              # 30
print $age . " years\\n";           # 25 years (. = concatenate)
printf("%.2f\\n", $pi);             # 3.14`,
          examples: [
            { input: `my $s = "hello";\nprint uc($s), "\\n";`, output: `HELLO` },
            { input: `print 5 + 3, "\\n";`, output: `8` },
          ],
          note: "always put 'use strict; use warnings;' at the top of every Perl script. strict forces you to declare variables with 'my', warnings shows common mistakes. without them Perl is very permissive and bugs hide easily",
        },
        intermediate: {
          explanation: "Perl's array (@) and hash (%) types are powerful. The sigil changes based on context — $array[0] to get one element, @array[0,1] to get a slice. Regular expressions are built into the language.",
          code: `use strict;
use warnings;

# array
my @fruits = ("apple", "banana", "cherry");
print $fruits[0], "\\n";      # apple ($ for single element)
print scalar @fruits, "\\n";  # 3 (scalar context = length)
push @fruits, "mango";        # add to end
my $last = pop @fruits;       # remove from end
unshift @fruits, "grape";     # add to beginning
my $first = shift @fruits;    # remove from beginning

# array slice
my @subset = @fruits[0, 2];   # @ for multiple elements

# hash (dictionary)
my %user = (
    name  => "Alice",
    age   => 25,
    email => "alice@example.com",
);
print $user{name}, "\\n";     # Alice (curly braces for hash)
$user{city} = "Boston";       # add key
delete $user{email};          # remove key
exists $user{name}            # check if key exists

# iterate
for my $key (keys %user) {
    print "$key: $user{$key}\\n";
}`,
          examples: [
            { input: `my @n = (3,1,4,1,5);\nmy @s = sort @n;\nprint "@s\\n";`, output: `1 1 3 4 5` },
          ],
        },
        advanced: {
          explanation: "Perl's regular expression engine is one of the most powerful. References let you create complex data structures (arrays of hashes, etc). Perl's CPAN has modules for nearly everything.",
          code: `use strict;
use warnings;

# regex — Perl's killer feature
my $text = "The quick brown fox jumps over the lazy dog";

# match
if ($text =~ /quick (\\w+)/) {
    print "After quick: $1\\n";  # brown ($1 = first capture group)
}

# match all occurrences
my @words = ($text =~ /(\\b\\w{4}\\b)/g);  # all 4-letter words
print "@words\\n";

# substitute
(my $new = $text) =~ s/fox/cat/;  # replace first
$text =~ s/\\b(\\w)/uc($1)/ge;    # capitalize each word (g=global, e=eval)

# references — create complex data structures
my $scalar_ref = \\$name;    # reference to scalar
my $array_ref  = \\@fruits;  # reference to array
my $hash_ref   = \\%user;    # reference to hash

# anonymous references
my $arr = [1, 2, 3];        # anonymous array ref
my $h   = {name=>"Alice"};  # anonymous hash ref

# nested structure (hash of arrays)
my %courses = (
    math    => ["algebra", "calculus"],
    science => ["physics", "chemistry"],
);
print $courses{math}[0], "\\n";   # algebra

# dereference
print $$scalar_ref, "\\n";        # dereference scalar
print $arr->[0], "\\n";           # 1 — arrow for refs`,
          examples: [
            { input: `my $t = "hello world";\n$t =~ s/\\b(\\w)/uc($1)/ge;\nprint "$t\\n";`, output: `Hello World` },
          ],
          note: "the -> arrow is used to dereference references: $arr->[0] for array refs, $hash->{key} for hash refs. Perl's regex modifiers: i (case insensitive), g (global), m (multiline), s (. matches newline), x (allow whitespace/comments)",
        },
      }),

      card("control flow + I/O", {
        beginner: {
          explanation: "Perl has the usual control flow plus some unique syntax like postfix if/unless/while. File I/O is built into the language with the diamond operator <> to read files line by line.",
          code: `use strict;
use warnings;

my $age = 25;

# standard if/elsif/else
if ($age >= 18) {
    print "adult\\n";
} elsif ($age >= 13) {
    print "teen\\n";
} else {
    print "child\\n";
}

# unless — opposite of if
unless ($age < 18) {
    print "you can vote\\n";
}

# postfix form — very common in Perl
print "adult\\n" if $age >= 18;
print "not admin\\n" unless $isAdmin;

# for/foreach loop
for my $i (1..5) {    # .. is range operator
    print "$i\\n";
}
foreach my $fruit (@fruits) {
    print "$fruit\\n";
}

# while loop
my $n = 10;
while ($n > 0) {
    print "$n\\n";
    $n -= 3;
}

# reading files
open(my $fh, '<', 'input.txt') or die "Can't open: $!";
while (my $line = <$fh>) {
    chomp $line;    # remove trailing newline
    print "$line\\n";
}
close($fh);`,
          examples: [
            { input: `print "$_\\n" for 1..5;`, output: `1\n2\n3\n4\n5` },
            { input: `my @even = grep { $_ % 2 == 0 } 1..10;\nprint "@even\\n";`, output: `2 4 6 8 10` },
          ],
          note: "$_ is Perl's default variable — many functions use it implicitly. 'for 1..5' sets $_ to each value. chomp removes the newline from the end of a string (very common after reading a line)",
        },
        intermediate: {
          explanation: "map and grep (filter) work on lists and are idiomatic Perl. sort with a comparison function, die for errors, and eval for catching them.",
          code: `use strict;
use warnings;

my @nums = (3, 1, 4, 1, 5, 9, 2, 6);

# map — transform each element
my @doubled = map { $_ * 2 } @nums;        # [6,2,8,2,10,18,4,12]
my @strings = map { "num:$_" } @nums;

# grep — filter (not regex grep, though it can use one)
my @evens   = grep { $_ % 2 == 0 } @nums;  # [4,2,6]
my @big     = grep { $_ > 4 } @nums;       # [5,9,6]

# sort with comparison function
my @sorted  = sort { $a <=> $b } @nums;    # numeric ascending
my @rsorted = sort { $b <=> $a } @nums;    # numeric descending
my @bylen   = sort { length($a) <=> length($b) } @words;

# die — throw an error
open(my $fh, '<', 'file.txt') or die "Can't open file.txt: $!";
# $! = system error message

# eval — catch errors
eval {
    die "something failed";
};
if ($@) {     # $@ contains the error
    print "caught: $@\\n";
}

# wantarray — detect list vs scalar context
sub context_aware {
    return wantarray ? (1, 2, 3) : "scalar";
}
my @list   = context_aware();   # (1, 2, 3)
my $scalar = context_aware();   # "scalar"`,
          examples: [
            { input: `my @sq = map { $_ ** 2 } grep { $_ % 2 == 0 } 1..10;\nprint "@sq\\n";`, output: `4 16 36 64 100` },
          ],
        },
      }),
    ]),
  ],
});
