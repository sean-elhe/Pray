import "./loginmodal.css";
import { useAuth } from "../auth/useAuth";
import { useToast } from "../context/ToastContext";
import { useNotifications } from "../hooks/useNotifications";

type ProfileModalProps = {
  close: () => void;
};

export default function ProfileModal({ close }: ProfileModalProps) {
  const { notifications, unreadCount, markRead } = useNotifications();

  const { logout } = useAuth();
  const { showToast } = useToast();

  async function handleLogout() {
    await logout();
    close();
    showToast("Logged out");
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>
          X
        </button>
        <h3 className="header">You are logged in! </h3>
        <hr />

        <div>
          <h3 className="unread">Notifications</h3>
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount} unread</span>
          )}

          <div className="notifications">
            {notifications.length === 0 ? (
              <p className="empty-notifications">You're all caught up! 🎉</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification ${
                    notification.is_read ? "" : "unread"
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markRead(notification.id);
                    }
                  }}
                >
                  <p>{notification.message}</p>

                  <small>
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        <hr />

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
