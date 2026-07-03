import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/prayers", async (req, res) => {
  try {
    const { content, user_id } = req.body;

    const result = await pool.query(
      `INSERT INTO prayers (content, user_id)
    VALUES ($1, $2)
    RETURNING id;
    `,
      [content, user_id],
    );

    const prayer = await pool.query(
      `SELECT
      prayers.id,
        prayers.content,
        prayers.is_answered,
        prayers.created_at,
        users.name
        FROM prayers
        JOIN users
        ON prayers.user_id = users.id
        WHERE prayers.id = $1;
    `,
      [result.rows[0].id],
    );

    res.status(201).json(prayer.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/prayers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM prayers WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.patch("/prayers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_answered } = req.body;

    const result = await pool.query(
      `
      UPDATE prayers
      SET
        content = COALESCE($1, content),
        is_answered = COALESCE($2, is_answered)
      WHERE id = $3
      RETURNING *;
      `,
      [content, is_answered, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
