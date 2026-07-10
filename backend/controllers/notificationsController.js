import pool from "../db.js";

export async function getNotifications(req, res) {
  try {
    const result = await pool.query(
      `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get notifications" });
  }
}

export async function markRead(req, res) {
  try {
    await pool.query(
      `
            UPDATE notifications
            SET is_read = true
            WHERE id = $1
            AND user_id = $2
            `,
      [req.params.id, req.user.id],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notification" });
  }
}
