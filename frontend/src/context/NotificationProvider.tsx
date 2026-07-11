import { useEffect, useState } from "react";
import { api } from "../api/client";
import { NotificationContext } from "./NotificationContext";
import type { Notification } from "../types";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function refresh() {
    const data = await api("/api/notifications");
    setNotifications(data);
  }

  async function markRead(id: number) {
    await api(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((n) => !n.is_read).length,
        refresh,
        markRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
