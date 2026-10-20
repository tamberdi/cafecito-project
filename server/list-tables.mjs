import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  const result = await client.query(
    "select table_schema, table_name from information_schema.tables where table_schema in ('public','drizzle') order by 1, 2"
  );
  console.log(result.rows.length ? result.rows : "No tables found in public or drizzle schemas");
} catch (err) {
  console.error("Query failed:", err.message);
} finally {
  await client.end().catch(() => {});
}