import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:your-email@example.email",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

export default webpush;
