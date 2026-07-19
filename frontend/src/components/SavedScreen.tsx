import "../modals/prayercard.css";
import { useState } from "react";
import type { Prayer, Category } from "../types";
import PrayerCard from "../modals/PrayerCard";
import PrayerMenu from "../modals/PrayerMenu";
import { usePrayerNavigation } from "../hooks/usePrayerNavigation";
import { useToast } from "../context/ToastContext";
import ShareModal from "../modals/ShareModal";
import CategoryModal from "../modals/CategoryModal";

type SavedScreenProps = {
  prayers: Prayer[];
  deletePrayer: (id: number) => void;
  changePrayer: (
    id: number,
    content: string,
    is_public: boolean,
    categoru_id: number | null,
  ) => void;
  publicPrayer: boolean;
  setPublicPrayer: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  onCategoryChanged: (
    prayerId: number,
    categoryId: number | null,
  ) => Promise<void>;
  onCategoryCreated: (category: Category) => void;
  onCategoryUpdated: (category: Category) => Promise<void>;
  onCategoryDeleted: (id: number) => Promise<void>;
};

export default function SavedScreen({
  prayers,
  deletePrayer,
  changePrayer,
  publicPrayer,
  setPublicPrayer,
  categories,
  onCategoryChanged,
  onCategoryCreated,
  onCategoryUpdated,
  onCategoryDeleted,
}: SavedScreenProps) {
  const { currentPrayer, currentIndex, direction, next, previous } =
    usePrayerNavigation(prayers);

  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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

  const openEditMenu = () => {
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

  const openShareMenu = () => {
    setMenuOpen(false);
    setShareOpen(true);
  };

  return (
    <>
      <div className="background-glow" />

      <main>
        <PrayerCard
          key={currentPrayer.id}
          prayer={currentPrayer}
          onNext={next}
          onPrevious={previous}
          direction={direction}
          onDoubleTap={openMenu}
          onCategoryClick={() => setShowCategoryModal(true)}
          editing={editingId === currentPrayer.id}
          publicPrayer={publicPrayer}
          setPublicPrayer={setPublicPrayer}
          onSaveEdit={(content) => {
            changePrayer(
              currentPrayer.id,
              content,
              currentPrayer.is_public,
              currentPrayer.category_id,
            );
            setEditingId(null);
            showToast("Card updated");
          }}
          onCancelEdit={() => setEditingId(null)}
          isSavedScreen={true}
        />
      </main>

      <section>
        <div className="counter">
          {currentIndex + 1} / {prayers.length}
        </div>
      </section>

      <PrayerMenu
        open={menuOpen}
        onClose={closeMenu}
        onEdit={openEditMenu}
        onDelete={openDeleteMenu}
        onShare={openShareMenu}
      />

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        prayer={currentPrayer}
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

      {showCategoryModal && (
        <CategoryModal
          close={() => setShowCategoryModal(false)}
          categories={categories}
          onSelect={async (categoryId) => {
            try {
              await onCategoryChanged(currentPrayer.id, categoryId);

              showToast("Category updated");
              setShowCategoryModal(false);
            } catch (err) {
              console.error(err);
              showToast("Failed to update category");
            }
          }}
          selectedCategoryId={currentPrayer.category_id}
          onCreated={onCategoryCreated}
          onUpdated={onCategoryUpdated}
          onDeleted={onCategoryDeleted}
        />
      )}
    </>
  );
}
