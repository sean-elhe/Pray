import "./loginmodal.css";
import { useAuth } from "../auth/useAuth";

type ProfileModalProps = {
  close: () => void;
};

export default function ProfileModal({ close }: ProfileModalProps) {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    close();
  }

  return (
    <div className="modal-overlay">
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>
          X
        </button>
        <h3>You are logged in! </h3>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
