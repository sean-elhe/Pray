import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Prayer API is running");
});

app.get("/prayers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        prayers.id,
        prayers.content,
        prayers.is_answered,
        prayers.created_at,
        users.name
      FROM prayers
      JOIN users
        ON prayers.user_id = users.id
      ORDER BY prayers.created_at DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
