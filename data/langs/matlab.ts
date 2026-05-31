import { lang, section, card } from '../helpers';

export default lang({
  id: "matlab", name: "MATLAB", ext: ".m", year: 1984, common: false,
  sections: [
    section("basics", "basics", [
      card("matrices + basics", {
        beginner: {
          explanation: "MATLAB (Matrix Laboratory) is built around matrices — everything is a matrix by default. Even a single number is a 1x1 matrix. It's used in engineering, physics, image processing, and signal processing. MATLAB has fantastic built-in tools for plotting and numerical computation. GNU Octave is a free open-source alternative.",
          code: `% percent sign is the comment character in MATLAB

% basic values
x = 42;        % semicolon suppresses output
y = 3.14;      % no semicolon = prints to console
name = 'Alice'; % single quotes for strings (MATLAB style)

% print
disp('Hello, World!')
fprintf('Name: %s, Age: %d\n', name, 42)

% MATRICES — everything is a matrix
v = [1, 2, 3, 4, 5]     % row vector (1x5 matrix)
c = [1; 2; 3; 4; 5]     % column vector (5x1 matrix)
M = [1 2 3; 4 5 6; 7 8 9]  % 3x3 matrix (rows separated by ;)

% 1-indexed! (like R and Fortran)
v(1)      % 1  (first element)
v(end)    % 5  (last element)
M(2,3)    % 6  (row 2, column 3)
M(1,:)    % [1 2 3]  (entire first row)
M(:,2)    % [2;5;8]  (entire second column)`,
          examples: [
            { input: `v = 1:5;\nsum(v)`, output: `ans = 15` },
            { input: `A = [1 2; 3 4];\ndet(A)`, output: `ans = -2  % determinant` },
          ],
          note: "in MATLAB, semicolons inside brackets separate rows, commas separate columns. [1,2,3] is a row vector, [1;2;3] is a column vector. forgetting this is a common mistake",
        },
        intermediate: {
          explanation: "MATLAB's strength is matrix operations — everything vectorizes automatically. Instead of loops, operate on entire matrices at once. This is both faster and more readable.",
          code: `% matrix operations
A = [1 2 3; 4 5 6; 7 8 9];
B = [9 8 7; 6 5 4; 3 2 1];

A + B           % element-wise add
A * B           % MATRIX multiplication
A .* B          % element-wise multiply (. before operator)
A .^ 2          % element-wise square
A'              % transpose of A
inv(A)          % matrix inverse
det(A)          % determinant
eig(A)          % eigenvalues and eigenvectors

% creating matrices
zeros(3, 4)     % 3x4 matrix of zeros
ones(2, 2)      % 2x2 matrix of ones
eye(3)          % 3x3 identity matrix
rand(3, 3)      % random 3x3 matrix (uniform 0-1)
randn(3, 3)     % random 3x3 (normal distribution)
linspace(0, 1, 100) % 100 evenly-spaced points from 0 to 1

% vectorized operations — fast, avoid loops
x = linspace(0, 2*pi, 1000);
y = sin(x);     % sin of 1000 values at once
plot(x, y)      % plot them
xlabel('x'); ylabel('sin(x)'); title('Sine Wave')`,
          examples: [
            { input: `v = [1 2 3 4 5];\nv .^ 2`, output: `ans = 1  4  9  16  25  % vectorized` },
            { input: `A = [1 2; 3 4]; A'`, output: `ans = 1  3\n      2  4  % transpose` },
          ],
        },
        advanced: {
          explanation: "MATLAB's cell arrays and structs handle heterogeneous data. Function handles enable functional programming patterns. The profile tool finds performance bottlenecks.",
          code: `% cell array — like a list that holds anything
c = {42, 'hello', [1 2 3], {nested, cell}};
c{1}      % 42      (use {} for indexing cell arrays)
c{2}      % 'hello'
c{3}(2)   % 2       (access element of nested array)

% struct — like a dictionary
s.name  = 'Alice';
s.age   = 25;
s.score = 95.5;
s.name          % 'Alice'
fieldnames(s)   % {'name', 'age', 'score'}

% function handles — store functions as variables
sq = @(x) x.^2;         % anonymous function
sq(5)                    % 25
sq([1 2 3 4])            % [1 4 9 16]

% apply to array
f = @sin;
arrayfun(f, 0:pi/4:pi)  % sin at 0, pi/4, pi/2, 3pi/4, pi

% cellfun — apply to cell array
nums = {1, 4, 9, 16};
cellfun(@sqrt, nums)     % [1 2 3 4]

% profile — find bottlenecks
profile on
my_slow_function()
profile off
profile viewer   % opens interactive profiler`,
          examples: [
            { input: `f = @(x) x.^2 + 2*x + 1;\nf(3)`, output: `ans = 16  % (3+1)^2` },
          ],
          note: "avoid for loops in MATLAB whenever possible — vectorized operations are 10-100x faster because MATLAB is optimized for matrix operations at the C level. if you must loop, pre-allocate the output array first",
        },
      }),
    ]),
  ],
});
