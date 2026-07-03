// import '../index.css';
import "./savedscreen.css";
import type { Prayer } from "../types";
import { useState } from "react";

type SavedScreenProps = {
  prayers: Prayer[];
  deletePrayer: (id: number) => void;
  changePrayer: (id: number, content: string) => void;
  goBack: () => void;
};

function SavedScreen({
  prayers,
  deletePrayer,
  changePrayer,
  goBack,
}: SavedScreenProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  return (
    <div className="prayer-card">
      <div className="header-card">
        <h2>Saved Prayers</h2>

        <button onClick={goBack}>Back</button>
      </div>

      {prayers.map((prayer) => (
        <div className="saved-card" key={prayer.id}>
          {editingId === prayer.id ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <button
                onClick={() => {
                  changePrayer(editingId, editText);
                  setEditingId(null);
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p>{prayer.content}</p>

              <button
                onClick={() => {
                  setEditingId(prayer.id);
                  setEditText(prayer.content);
                }}
              >
                Edit
              </button>
            </>
          )}
          {/* <small>By {prayer.name}</small> */}
          <button onClick={() => deletePrayer(prayer.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default SavedScreen;
