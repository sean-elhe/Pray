import { api } from "./api/client";

export async function enablePushNotifications() {
  if (!("Notification" in window)) {
    throw new Error("Notifications are not supported");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  });

  await api("/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
}
