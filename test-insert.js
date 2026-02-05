require("dotenv").config();
const { Pool } = require("pg");

console.log("FILE STARTED");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("INSIDE RUN()");

  const result = await pool.query(
    `INSERT INTO memorials 
     (full_name, province, latitude, longitude, life_summary, status)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      "Jane Test",
      "Alberta",
      51.05,
      -114.07,
      "Test memorial entry.",
      "approved"
    ]
  );

  console.log("INSERTED:", result.rows[0]);
  process.exit();
}

run().catch(err => {
  console.error("ERROR:", err);
});