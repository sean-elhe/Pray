import "./loginmodal.css";

type ProfileModalProps = {
  close: () => void;
};

export default function ProfileModal({ close }: ProfileModalProps) {
  return (
    <div className="modal-overlay">
      <div className="profile-modal" onClick={(e) => e.stopPropagation}>
        <button className="close-btn" onClick={close}>
          X
        </button>
        <h3>You are logged in! </h3>
        <button className="logout-btn">Log out</button>
      </div>
    </div>
  );
}
