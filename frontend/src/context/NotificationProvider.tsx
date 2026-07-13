import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { NotificationContext } from "./NotificationContext";
import { useAuth } from "../auth/useAuth";
import { socket } from "../socket";
import { useToast } from "./ToastContext";
import type { Notification } from "../types";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    if (!user) return;

    try {
      const data = await api("/api/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, [user]);

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
      console.error(err);
    }
  }

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("register", user.id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    function handleNotification(notification: Notification) {
      if (!notification) return;

      setNotifications((prev) => [notification, ...prev]);

      showToast(notification.message);
    }

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [showToast]);

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
