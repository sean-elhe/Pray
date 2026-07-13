import pool from "../db.js";
import webpush from "./webPush.js";

export async function sendPushNotifications(user_id, notification) {
  const result = await pool.query(
    `
        SELECT subscription
        FROM push_subscriptions
        WHERE user_id = $1
        `,
    [user_id],
  );

  for (const row of result.rows) {
    try {
      await webpush.sendNotification(
        row.subscription,
        JSON.stringify({
          title: "Pray",
          message: notification.message,
        }),
      );
    } catch (err) {
      console.log("Failed to send push notifications: ", err);
    }
  }
}
