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
        <h3>You are logged in! </h3>

        <div>
          <h4 className="unread">Unread: {unreadCount}</h4>

          {notifications.map((notification) => (
            <div key={notification.id}>
              <p className="message">{notification.message}</p>

              {!notification.is_read && (
                <button onClick={() => markRead(notification.id)}>
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
