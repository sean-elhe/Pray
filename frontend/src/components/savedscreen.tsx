import { useState } from "react";
import type { Prayer } from "../types";
import PrayerCard from "../modals/prayercard";
import { usePrayerNavigation } from "../hooks/navigation";

type SavedScreenProps = {
  prayers: Prayer[];
  deletePrayer: (id: number) => void;
  changePrayer: (id: number, content: string) => void;
};

export default function SavedScreen({
  prayers,
  deletePrayer,
  changePrayer,
}: SavedScreenProps) {
  const { currentPrayer, currentIndex, direction, next, previous } =
    usePrayerNavigation(prayers);

  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

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
  };

  return (
    <>
      <header>
        <h1>Saved Prayers</h1>
      </header>

      <main>
        <PrayerCard
          key={currentPrayer.id}
          prayer={currentPrayer}
          onNext={next}
          onPrevious={previous}
          direction={direction}
          onLongPress={openMenu}
        />
      </main>

      <div className="counter">
        {currentIndex + 1} / {prayers.length}
      </div>

      {selectedPrayer && (
        <div className="prayer-menu">
          <button
            onClick={() => {
              setEditing(true);
              setEditText(selectedPrayer.content);
            }}
          >
            Edit
          </button>

          <button
            onClick={() => {
              deletePrayer(selectedPrayer.id);
              setSelectedPrayer(null);
            }}
          >
            Delete
          </button>

          <button onClick={() => setSelectedPrayer(null)}>Cancel</button>
        </div>
      )}

      {editing && selectedPrayer && (
        <div className="edit-modal">
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <button
            onClick={() => {
              changePrayer(selectedPrayer.id, editText);
              setEditing(false);
              setSelectedPrayer(null);
            }}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
