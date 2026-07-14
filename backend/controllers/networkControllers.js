import pool from "../db.js";
import { createNotification } from "../utils/createNotification.js";
import { sendPushNotifications } from "../utils/sendPushNotifications.js";
import { notifyUser } from "../socket.js";

export const sharePrayer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { userId: sharedUserId } = req.body;

    const prayer = await pool.query(
      `
      SELECT id
      FROM prayers
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId],
    );

    if (prayer.rowCount === 0) {
      return res.status(403).json({
        error: "Not your prayer",
      });
    }

    await pool.query(
      `
      INSERT INTO prayer_shares
      (prayer_id, shared_with_user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
      `,
      [id, sharedUserId],
    );

    const notification = await createNotification(
      sharedUserId,
      "Someone shared a prayer with you",
    );

    notifyUser(sharedUserId, notification);

    await sendPushNotifications(sharedUserId, notification);

    res.json({
      message: "Prayer shared",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const createShareLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(req.user);
    console.log(req.params);

    const result = await pool.query(
      `
      SELECT share_token
      FROM prayers
      WHERE id=$1
      AND user_id=$2
      `,
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Prayer not found",
      });
    }

    const token = result.rows[0].share_token;

    res.json({
      url: `${process.env.CLIENT_URL}/share/${token}`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const updateVisibility = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { is_public } = req.body;

    const result = await pool.query(
      `
      UPDATE prayers
      SET is_public=$1
      WHERE id=$2
        AND user_id=$3
      RETURNING id;
      `,
      [is_public, id, userId],
    );

    res.json({
      message: "Updated",
      is_public,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const result = await pool.query(
      `
      SELECT id, name
      FROM users
      WHERE name ILIKE $1
      AND id != $2
      ORDER BY name
      LIMIT 10;
      `,
      [`%${q}%`, userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /users/search error:", err);

    res.status(500).json({
      error: "Database error",
    });
  }
};
