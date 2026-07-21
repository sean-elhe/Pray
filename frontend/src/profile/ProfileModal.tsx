import "./profile.css";
import { useAuth } from "../auth/useAuth";
import { useToast } from "../context/ToastContext";

import NotificationDropdown from "./NotificationDropdown";
import SettingsDropdown from "./SettingsDropdown";

type ProfileModalProps = {
  close: () => void;
};

export default function ProfileModal({ close }: ProfileModalProps) {
  const { logout } = useAuth();
  const { user } = useAuth();
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
        <h3 className="header">Hi, {user?.name}!</h3>
        <hr />

        <NotificationDropdown />

        <hr />

        <SettingsDropdown />

        <hr />

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
