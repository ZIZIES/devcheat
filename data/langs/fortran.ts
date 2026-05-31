import { lang, section, card } from '../helpers';

export default lang({
  id: "fortran", name: "Fortran", ext: ".f90", year: 1957, common: false,
  sections: [
    section("basics", "basics", [
      card("hello world + basics", {
        beginner: {
          explanation: "Fortran (Formula Translation) is the oldest programming language still in active use. It was created in 1957 for scientific computing and is still used today in weather forecasting, physics simulations, and aerospace engineering because of its extreme speed for numerical computation. Modern Fortran (Fortran 90 and later) looks nothing like the old punched-card era code.",
          code: `! Fortran uses ! for comments
! File: hello.f90

PROGRAM Hello
    IMPLICIT NONE    ! CRITICAL: always use this (explained below)

    ! variables must be declared before use
    INTEGER :: age = 25
    REAL    :: pi  = 3.14159
    CHARACTER(LEN=20) :: name = "Alice"

    ! print to screen
    PRINT *, "Hello, World!"
    PRINT *, "Hello, ", name
    PRINT *, "Age:", age, "Pi:", pi

    ! formatted output
    WRITE(*,'(A, I3, F8.4)') "age and pi: ", age, pi

END PROGRAM Hello`,
          examples: [
            { input: `gfortran hello.f90 -o hello\n./hello`, output: `Hello, World!\nHello, Alice\nAge: 25 Pi: 3.14159` },
          ],
          note: "IMPLICIT NONE is critical — without it Fortran silently gives variables types based on their first letter (I-N = integer, everything else = real). this caused countless scientific bugs for decades. ALWAYS use IMPLICIT NONE",
        },
        intermediate: {
          explanation: "Fortran's arrays are 1-indexed by default and stored in column-major order (opposite of C). This matters enormously for performance — iterating in the wrong order causes cache misses.",
          code: `PROGRAM Arrays
    IMPLICIT NONE
    INTEGER :: i, j
    REAL    :: v(5)              ! 1D array of 5 reals
    REAL    :: m(3,3)            ! 2D 3x3 matrix

    ! array indexing starts at 1!
    v(1) = 10.0
    v(5) = 50.0    ! last element

    ! array initialization
    v = [1.0, 2.0, 3.0, 4.0, 5.0]

    ! array operations — VECTORIZED, no loop needed!
    v = v * 2.0          ! multiply every element by 2
    v = v + 1.0          ! add 1 to every element
    PRINT *, SUM(v)      ! sum of all elements
    PRINT *, MAXVAL(v)   ! maximum value
    PRINT *, SIZE(v)     ! number of elements

    ! 2D array — column-major order!
    ! m(row, col) — iterate outer loop over columns for speed
    DO j = 1, 3           ! columns (outer loop = column)
        DO i = 1, 3       ! rows (inner loop = row)
            m(i,j) = i * j
        END DO
    END DO
END PROGRAM`,
          examples: [
            { input: `REAL :: v(5) = [1,2,3,4,5]\nPRINT *, v * 2`, output: `2.0 4.0 6.0 8.0 10.0  (vectorized)` },
            { input: `PRINT *, SUM([1,2,3,4,5])`, output: `15` },
          ],
          note: "Fortran stores 2D arrays column-by-column (column-major). iterating row-by-row (like C) causes cache misses. always make the FIRST index vary in the INNER loop for maximum performance",
        },
        advanced: {
          explanation: "Modern Fortran has allocatable arrays, modules, and coarrays for parallel computing. The INTENT attribute on function parameters prevents bugs by declaring how each parameter is used.",
          code: `MODULE MathUtils
    IMPLICIT NONE
    PRIVATE           ! everything private by default
    PUBLIC :: dot_product_custom, normalize

CONTAINS

    ! INTENT(IN)    = read only — can't be modified
    ! INTENT(OUT)   = write only — must be set before use
    ! INTENT(INOUT) = both read and write
    PURE FUNCTION dot_product_custom(a, b) RESULT(res)
        REAL, INTENT(IN) :: a(:), b(:)   ! assumed-shape arrays
        REAL             :: res
        res = SUM(a * b)   ! vectorized multiply then sum
    END FUNCTION

    SUBROUTINE normalize(v)
        REAL, INTENT(INOUT) :: v(:)
        REAL :: magnitude
        magnitude = SQRT(SUM(v**2))
        IF (magnitude > 0.0) v = v / magnitude
    END SUBROUTINE

END MODULE MathUtils

PROGRAM Main
    USE MathUtils
    IMPLICIT NONE
    REAL, ALLOCATABLE :: v(:)   ! allocatable — size set at runtime
    INTEGER :: n

    n = 100
    ALLOCATE(v(n))    ! allocate memory
    v = 1.0           ! set all elements to 1.0
    CALL normalize(v)
    PRINT *, v(1)     ! 0.1 = 1/sqrt(100)
    DEALLOCATE(v)     ! free memory
END PROGRAM`,
          examples: [
            { input: `REAL :: a(3) = [1,2,3], b(3) = [4,5,6]\nPRINT *, dot_product_custom(a,b)`, output: `32.0  ! (1*4 + 2*5 + 3*6)` },
          ],
          note: "PURE functions have no side effects and don't modify global state — the compiler can optimize them more aggressively and use them in array expressions. mark functions PURE whenever possible",
        },
      }),
    ]),
  ],
});
