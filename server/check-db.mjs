import pg from "pg";

const url = new URL(process.env.DATABASE_URL);
console.log("Host:", url.host);

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  const result = await client.query("select now(), current_database() as db");
  console.log("Connected:", result.rows[0]);
} catch (err) {
  console.error("Connection failed:", err.message);
} finally {
  await client.end().catch(() => {});
}