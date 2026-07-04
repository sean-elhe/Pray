import pool from "../db.js";

export async function auth(req, res, next) {
  try {
    const sessionId = req.cookies.session;

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT * FROM sessions WHERE session_id = $1",
      [sessionId],
    );

    const session = result.rows[0];

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    req.user = {
      id: session.user_id,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
