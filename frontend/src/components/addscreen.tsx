import "../modals/prayercard.css";
import Toast from "./Toast";

type AddScreenProps = {
  prayerText: string;
  setPrayerText: React.Dispatch<React.SetStateAction<string>>;
  savePrayer: () => void;
};

function AddScreen({ prayerText, setPrayerText, savePrayer }: AddScreenProps) {
  const clear = () => {
    setPrayerText("");
  };

  return (
    <>
      <div className="main">
        <div className="saved-card">
          <textarea
            className="prayer-edit"
            value={prayerText}
            onChange={(e) => setPrayerText(e.target.value)}
          />
        </div>
        <div className="card-actions">
          <button className="edit-cancel" onClick={clear}>
            Clear
          </button>
          <button className="edit-save" onClick={savePrayer}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default AddScreen;
