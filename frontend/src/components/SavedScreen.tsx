import "../modals/prayercard.css";
import { useState } from "react";
import type { Prayer } from "../types";
import PrayerCard from "../modals/PrayerCard";
import PrayerMenu from "../modals/prayermenu";
import { usePrayerNavigation } from "../hooks/navigation";
import { useToast } from "../context/ToastContext";

type SavedScreenProps = {
  prayers: Prayer[];
  deletePrayer: (id: number) => void;
  changePrayer: (id: number, content: string) => void;
  publicPrayer: boolean;
  setPublicPrayer: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SavedScreen({
  prayers,
  deletePrayer,
  changePrayer,
  publicPrayer,
  setPublicPrayer,
}: SavedScreenProps) {
  const { currentPrayer, currentIndex, direction, next, previous } =
    usePrayerNavigation(prayers);

  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  if (prayers.length === 0) {
    return (
      <>
        <header>
          <h1>Saved Prayers</h1>
        </header>

        <main>
          <p>No prayers available.</p>
        </main>
      </>
    );
  }

  const openMenu = () => {
    setSelectedPrayer(currentPrayer);
    setConfirmDeleteOpen(false);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openEditor = () => {
    setMenuOpen(false);

    if (selectedPrayer) {
      setEditingId(selectedPrayer.id);
    }
  };

  const handleDelete = async () => {
    if (!selectedPrayer) return;

    setIsDeleting(true);

    try {
      await deletePrayer(selectedPrayer.id);

      setConfirmDeleteOpen(false);
      setSelectedPrayer(null);

      showToast("Card deleted");
    } catch (error) {
      console.log(error);
      showToast("Failed to delete card");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteMenu = () => {
    setConfirmDeleteOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <header>
        <h1></h1>
      </header>

      <main>
        <PrayerCard
          key={currentPrayer.id}
          prayer={currentPrayer}
          onNext={next}
          onPrevious={previous}
          direction={direction}
          onLongPress={openMenu}
          editing={editingId === currentPrayer.id}
          publicPrayer={publicPrayer}
          setPublicPrayer={setPublicPrayer}
          onSaveEdit={(content) => {
            changePrayer(currentPrayer.id, content);
            setEditingId(null);
            showToast("Card updated");
          }}
          onCancelEdit={() => setEditingId(null)}
          savedScreen={true}
        />
      </main>

      <div className="counter">
        {currentIndex + 1} / {prayers.length}
      </div>

      <PrayerMenu
        open={menuOpen}
        onClose={closeMenu}
        onEdit={openEditor}
        onDelete={openDeleteMenu}
      />

      {confirmDeleteOpen && (
        <div
          className="menu-overlay"
          onClick={() => setConfirmDeleteOpen(false)}
        >
          <div className="delete-menu" onClick={(e) => e.stopPropagation()}>
            <h3>Delete prayer?</h3>

            <p>This prayer will be permanently removed.</p>

            <div className="confirm-actions">
              <button onClick={openMenu} disabled={isDeleting}>
                Cancel
              </button>

              <button
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
