import { createContext } from "react";
import type { Notification } from "../types";

export type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);
