import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const userId = req.user.id;
  const subscription = req.body;

  await pool.quert(
    `
        INSERT INTO push_subscriptions(user_id, subscription)
        VALUES ($1, $2)
        `,
    [userId, subscription],
  );

  res.json({ success: true });
});

export default router;
