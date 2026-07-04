import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../db.js";
import { auth } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM users WHERE id = $1",
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, pin } = req.body;

    if (!name || !pin) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    if (!name || !pin || pin.length !== 4) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const existing = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    await pool.query("INSERT INTO users (name, pin_hash) VALUES ($1, $2)", [
      name,
      pinHash,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { name, pin } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    console.log("LOGIN ATTEMPT", name, pin);
    console.log("USER:", user);
    console.log("PIN HASH:", user?.pin_hash);

    if (!user.pin_hash) {
      return res.status(500).json({ error: "Missing pin hash in database" });
    }

    const match = await bcrypt.compare(pin, user.pin_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid PIN" });
    }

    const sessionId = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "INSERT INTO sessions (session_id, user_id) VALUES ($1, $2)",
      [sessionId, user.id],
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", auth, async (req, res) => {
  const sessionId = req.cookies.session;

  if (sessionId) {
    await pool.query("DELETE FROM sessions WHERE session_id = $1", [sessionId]);
  }

  res.clearCookie("session");

  res.json({ success: true });
});

export default router;
