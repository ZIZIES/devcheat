import { lang, section, card } from '../helpers';

export default lang({
  id: "r", name: "R", ext: ".r", year: 1993, common: false,
  sections: [
    section("basics", "basics", [
      card("vectors + basics", {
        beginner: {
          explanation: "R is a language built specifically for statistics and data analysis. Almost everything in R is a vector — even a single number is a vector of length 1. Operations on vectors happen on ALL elements at once automatically. R is used by data scientists, statisticians, and researchers worldwide.",
          code: `# hash is the comment in R
# <- is the assignment operator (= also works but <- is preferred)

x <- 42          # numeric (R calls numbers 'numeric', not int)
s <- "hello"     # character (R calls strings 'character')
b <- TRUE        # logical (R uses TRUE/FALSE, not true/false)
n <- NULL        # null
na <- NA         # missing value (different from null!)

# vector — the fundamental R type (everything is a vector)
v <- c(1, 2, 3, 4, 5)   # c() = combine
cat("Length:", length(v), "\n")   # 5
cat("Sum:", sum(v), "\n")         # 15
cat("Mean:", mean(v), "\n")       # 3

# R is 1-INDEXED (not 0!)
v[1]     # 1 (first element)
v[5]     # 5 (last element)
v[2:4]   # 2 3 4 (slice, inclusive both ends)
v[-1]    # 2 3 4 5 (everything EXCEPT index 1)

# print
print(v)         # [1] 1 2 3 4 5
cat(v, "\n")    # 1 2 3 4 5 (no formatting)`,
          examples: [
            { input: `v <- c(3, 1, 4, 1, 5, 9, 2, 6)\nsum(v)`, output: `[1] 31` },
            { input: `v <- 1:5\nv * 2`, output: `[1]  2  4  6  8 10  # vectorized!` },
          ],
          note: "R is 1-indexed and this is not going to change. v[1] is the first element, v[0] returns an empty vector (not an error). the [1] in output means 'element 1 starts here' for long vectors",
        },
        intermediate: {
          explanation: "Data frames are R's most important structure — like a spreadsheet or database table. Each column is a vector, all columns have the same length. The tidyverse packages (dplyr, ggplot2) make working with data frames elegant.",
          code: `# data frame — like a table
df <- data.frame(
    name  = c("Alice", "Bob", "Carol"),
    age   = c(25, 30, 28),
    score = c(88.5, 72.0, 95.5)
)

# access columns
df$name           # "Alice" "Bob" "Carol"
df[["age"]]       # same as df$age
df$score[1]       # 88.5 (first score)

# filter rows
df[df$age > 25, ]           # rows where age > 25
subset(df, age > 25)        # same, cleaner syntax

# add column
df$grade <- ifelse(df$score > 90, "A", "B")

# summary stats
summary(df)            # gives min, max, median, mean for each column
nrow(df)               # 3 rows
ncol(df)               # 4 columns (including grade now)

# apply family — apply function to rows or columns
apply(df[,c("age","score")], 2, mean)  # mean of each numeric column
sapply(df$name, nchar)   # length of each name`,
          examples: [
            { input: `df[df$score > 80, "name"]`, output: `[1] "Alice" "Carol"` },
            { input: `mean(df$score)`, output: `[1] 85.33333` },
          ],
        },
        advanced: {
          explanation: "The tidyverse is a collection of R packages that share a consistent design philosophy. dplyr makes data manipulation clean. ggplot2 makes beautiful visualizations. They transform how R code looks and feels.",
          code: `library(dplyr)
library(ggplot2)

# dplyr — data manipulation with pipes
result <- df |>
    filter(age > 25) |>        # keep rows where age > 25
    select(name, score) |>     # keep only these columns
    mutate(bonus = score * 0.1) |>  # add new column
    arrange(desc(score)) |>    # sort by score descending
    group_by(grade) |>
    summarise(
        avg_score = mean(score),
        count     = n()         # n() = number of rows in group
    )

# ggplot2 — layered grammar of graphics
ggplot(df, aes(x = age, y = score, color = grade)) +
    geom_point(size = 3) +                    # scatter plot
    geom_smooth(method = "lm") +              # trend line
    scale_color_manual(values = c("A" = "green", "B" = "red")) +
    labs(title = "Score vs Age",
         x = "Age", y = "Test Score") +
    theme_minimal()

# purrr — functional programming for lists
library(purrr)
map(1:5, ~ .x ^ 2)                  # list of squares
map_dbl(1:5, ~ .x ^ 2)              # numeric vector of squares`,
          examples: [
            { input: `df |> filter(score > 80) |> nrow()`, output: `[1] 2` },
            { input: `map_dbl(1:5, ~ .x^2)`, output: `[1]  1  4  9 16 25` },
          ],
          note: "|> is the base R pipe operator (added in R 4.1). The magrittr pipe %>% also works and is still widely used. they do the same thing: pass the left side as the first argument to the right side function",
        },
      }),
    ]),
  ],
});
