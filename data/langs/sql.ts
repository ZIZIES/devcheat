import { lang, section, card } from '../helpers';

export default lang({
  id: "sql", name: "SQL", ext: ".sql", year: 1974, common: false,
  sections: [
    section("basics", "basics", [
      card("SELECT + filtering", {
        beginner: {
          explanation: "SQL (Structured Query Language) is how you talk to databases. Almost every app stores data in a database, and SQL is how you get it out. You don't write a loop to find things — you describe WHAT you want and the database figures out how to get it. SQL is used alongside another language (like Python or Java), not on its own.",
          code: `-- double dash is a comment in SQL

-- SELECT — get data from a table
SELECT * FROM users;                    -- get ALL columns from users table
SELECT name, email FROM users;         -- get specific columns
SELECT name, age FROM users LIMIT 10;  -- only first 10 rows

-- WHERE — filter rows
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE name = 'Alice';
SELECT * FROM users WHERE age BETWEEN 18 AND 30;
SELECT * FROM users WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM users WHERE name LIKE '%son'; -- ends with son
SELECT * FROM users WHERE email IS NULL;    -- no email
SELECT * FROM users WHERE email IS NOT NULL;

-- AND / OR
SELECT * FROM users
WHERE age > 18 AND city = 'Boston';

SELECT * FROM users
WHERE city = 'Boston' OR city = 'NYC';

-- ORDER BY — sort results
SELECT name, age FROM users
ORDER BY age DESC;   -- DESC = high to low, ASC = low to high`,
          examples: [
            { input: `SELECT name, age FROM users WHERE age > 25 ORDER BY age;`, output: `name  | age\n------|----\nBob   |  30\nCarol |  35` },
          ],
          note: "SQL is case-insensitive for keywords — SELECT, select, and Select are all the same. table and column names may be case-sensitive depending on the database. convention is UPPERCASE keywords, lowercase table/column names",
        },
        intermediate: {
          explanation: "JOIN combines data from multiple tables. GROUP BY aggregates rows together. These are the two most powerful and most confusing SQL features — understanding them unlocks almost everything.",
          code: `-- JOIN — combine rows from multiple tables
-- INNER JOIN — only rows that match in BOTH tables
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN — all users, even if no orders
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- users with no orders get NULL for orders.total

-- alias tables for cleaner queries
SELECT u.name, o.total, o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;

-- GROUP BY — aggregate rows
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city;   -- one row per city

-- aggregate functions: COUNT, SUM, AVG, MIN, MAX
SELECT
    city,
    COUNT(*)        as total,
    AVG(age)        as avg_age,
    MAX(age)        as oldest
FROM users
GROUP BY city
HAVING COUNT(*) > 5   -- HAVING filters AFTER grouping (like WHERE for groups)
ORDER BY total DESC;`,
          examples: [
            { input: `SELECT dept, AVG(salary) as avg_sal\nFROM employees\nGROUP BY dept\nHAVING AVG(salary) > 50000\nORDER BY avg_sal DESC;`, output: `dept       | avg_sal\n-----------|--------\nEngineering| 95000\nMarketing  | 65000` },
          ],
          note: "WHERE filters rows BEFORE grouping, HAVING filters AFTER. you can't use WHERE to filter on aggregates (like COUNT or AVG) — use HAVING for that",
        },
        advanced: {
          explanation: "Window functions, CTEs (Common Table Expressions), and subqueries are advanced SQL that makes complex reports possible without doing multiple queries. Indexes are what make queries fast.",
          code: `-- CTE (WITH clause) — name a subquery for readability
WITH high_value_customers AS (
    SELECT user_id, SUM(total) as lifetime_value
    FROM orders
    GROUP BY user_id
    HAVING SUM(total) > 1000
)
SELECT u.name, hvc.lifetime_value
FROM users u
JOIN high_value_customers hvc ON u.id = hvc.user_id
ORDER BY hvc.lifetime_value DESC;

-- Window functions — aggregate without collapsing rows
SELECT
    name,
    salary,
    dept,
    AVG(salary) OVER (PARTITION BY dept) as dept_avg,
    salary - AVG(salary) OVER (PARTITION BY dept) as vs_avg,
    RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank_in_dept
FROM employees;

-- running total
SELECT
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;

-- indexes — what makes queries fast
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);

EXPLAIN SELECT * FROM users WHERE email = 'a@b.com';  -- shows query plan`,
          examples: [
            { input: `SELECT name, salary,\n  RANK() OVER (ORDER BY salary DESC) as rank\nFROM employees;`, output: `name  | salary | rank\n------|--------|-----\nAlice | 95000  | 1\nBob   | 85000  | 2` },
          ],
          note: "window functions (OVER clause) are one of the most powerful SQL features — they let you compute aggregates alongside individual rows. PARTITION BY is like GROUP BY but doesn't collapse rows",
        },
      }),
    ]),
  ],
});
