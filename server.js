import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test route
app.get("/", (req, res) => {
  res.send("Roadside Remembrance API is running");
});

// Get approved memorials
app.get("/api/memorials", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM memorials WHERE status = 'approved'"
  );
  res.json(result.rows);
});

// Submit new memorial
app.post("/api/submissions", async (req, res) => {
  const {
    full_name,
    province,
    latitude,
    longitude,
    life_summary,
    photo_url,
    obituary_url,
    accident_type,
    submitter_name,
    submitter_email,
  } = req.body;

  await pool.query(
    `INSERT INTO submissions 
    (full_name, province, latitude, longitude, life_summary, photo_url, obituary_url, accident_type, submitter_name, submitter_email)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      full_name,
      province,
      latitude,
      longitude,
      life_summary,
      photo_url,
      obituary_url,
      accident_type,
      submitter_name,
      submitter_email,
    ]
  );

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
