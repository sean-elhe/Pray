import pool from "../db.js";

export async function createNotification(userId, message) {
  const result = await pool.query(
    `
        INSERT INTO notifications(user_id, message)
        VALUES ($1, $2)
        RETURNING *;
        `,
    [userId, message],
  );

  return result.rows[0];
}
