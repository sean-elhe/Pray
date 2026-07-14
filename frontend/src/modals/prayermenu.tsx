import "./prayermenu.css";

type PrayerMenuProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
};

export default function PrayerMenu({
  open,
  onClose,
  onEdit,
  onDelete,
  onShare,
}: PrayerMenuProps) {
  if (!open) return null;

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="prayer-menu" onClick={(e) => e.stopPropagation()}>
        <h2>Card Options</h2>

        <button className="cancel" onClick={onClose}>
          Cancel
        </button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onShare}>Share</button>
      </div>
    </div>
  );
}
