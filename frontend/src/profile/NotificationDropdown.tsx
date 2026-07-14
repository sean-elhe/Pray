import CollapsibleSection from "./CollapsibleSection";
import { useNotifications } from "../hooks/useNotifications";
import { formatRelativeTime } from "../utils/formatRelativeTime";

export default function NotificationDropdown() {
  const { notifications, unreadCount, markRead } = useNotifications();

  return (
    <CollapsibleSection
      title="Notifications"
      badge={unreadCount > 0 ? `${unreadCount} unread` : undefined}
    >
      <div className="notifications">
        {notifications.length === 0 ? (
          <p className="empty-notifications">You're all caught up! 🎉</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification ${notification.is_read ? "" : "unread"}`}
              onClick={() => {
                if (!notification.is_read) {
                  markRead(notification.id);
                }
              }}
            >
              <p>{notification.message}</p>

              <small>{formatRelativeTime(notification.created_at)}</small>
            </div>
          ))
        )}
      </div>
    </CollapsibleSection>
  );
}
