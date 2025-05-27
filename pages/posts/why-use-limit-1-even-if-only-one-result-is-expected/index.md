```js
export async function checkEmail(database: D1Database, email: string) {
  const { results } = await database
    .prepare(`SELECT email FROM profile WHERE email = ? LIMIT 1`) // 👈
    .bind(email)
    .all();

  return results.length > 0;
}
```

## Reasons

1. **Reduces Unnecessary Scanning**
  - Without `LIMIT 1`, the database may scan more rows than necessary.
  - With `LIMIT 1`, the query stops as soon as it finds the first matching record, improving performance.
2. **Query Optimization**
  - Some database engines (e.g., SQLite, MySQL) can optimize queries better when `LIMIT` is used.
  - `LIMIT 1` helps the query planner use indexes more efficiently, potentially reducing execution time.
3. **Improved Code Readability and Intent Clarity**
  - Explicitly stating `LIMIT 1` makes it clear that the query is only expected to return a single result.
  - This improves code readability and makes it easier for others to understand the intent of the query.

## Conclusion

It's a good practice to use `LIMIT 1` even if only one result is expected.
