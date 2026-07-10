import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Notification } from "../types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      const data = await api("/api/notifications");

      setNotifications(data);
    } catch (err) {
      console.log("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: number) {
    try {
      await api(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
    } catch (err) {
      console.log("Failed to mark notification read:", err);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.is_read).length,
    loading,
    markRead,
    refresh: loadNotifications,
  };
}
