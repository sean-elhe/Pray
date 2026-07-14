import pool from "../db.js";
import { createNotification } from "../utils/createNotification.js";
import { sendPushNotifications } from "../utils/sendPushNotifications.js";
import { notifyUser } from "../socket.js";

export const getPrayers = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        prayers.id,
        prayers.content,
        prayers.is_answered,
        prayers.created_at,
        prayers.is_public,
        users.name
      FROM prayers
      JOIN users ON prayers.user_id = users.id
      WHERE prayers.user_id = $1
      ORDER BY prayers.created_at DESC;
      `,
      [userId],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("GET /prayers error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getPublicPrayers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        prayers.id,
        prayers.content,
        prayers.is_answered,
        prayers.created_at,
        prayers.is_public,
        users.name
      FROM prayers
      JOIN users ON prayers.user_id = users.id
      WHERE prayers.is_public = true
      ORDER BY prayers.created_at DESC;
    `);

    return res.json(result.rows);
  } catch (err) {
    console.error("GET /prayers/public error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createPrayer = async (req, res) => {
  try {
    const { content, is_public = false } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    const user_id = req.user.id;

    const insertResult = await pool.query(
      `
      INSERT INTO prayers (content, user_id, is_public)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      [content, user_id, is_public],
    );

    const prayerId = insertResult.rows[0].id;

    const prayer = await pool.query(
      `
      SELECT
        prayers.id,
        prayers.content,
        prayers.is_answered,
        prayers.created_at,
        prayers.is_public,
        users.name
      FROM prayers
      JOIN users
        ON prayers.user_id = users.id
      WHERE prayers.id = $1;
      `,
      [prayerId],
    );

    const notification = await createNotification(
      user_id,
      "Your prayer was created",
    );

    notifyUser(user_id, notification);

    await sendPushNotifications(user_id, notification);

    res.status(201).json(prayer.rows[0]);
  } catch (err) {
    console.error("POST /prayers error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deletePrayer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM prayers WHERE id = $1 AND user_id = $2 RETURNING id;",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json({
      message: "Prayer deleted",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("DELETE /prayers error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updatePrayer = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;
    const { content, is_answered, is_public } = req.body;

    const result = await pool.query(
      `
      UPDATE prayers
      SET
        content = COALESCE($1, content),
        is_answered = COALESCE($2, is_answered),
        is_public = COALESCE ($3, is_public)
      WHERE id = $4 AND user_id = $5
      RETURNING *;
      `,
      [content, is_answered, is_public, id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PATCH /prayers error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
