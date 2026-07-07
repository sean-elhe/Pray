// import '../index.css';
import "./addscreen.css";

type AddScreenProps = {
  prayerText: string;
  setPrayerText: React.Dispatch<React.SetStateAction<string>>;
  savePrayer: () => void;
};

function AddScreen({ prayerText, setPrayerText, savePrayer }: AddScreenProps) {
  return (
    <>
      <header className="addHeader">
        <button>Category</button>
      </header>
      <main className="addMain">
        <textarea
          id="add-main"
          rows={24}
          value={prayerText}
          placeholder="Our Father in heaven, hallowed be Your name."
          onChange={(e) => setPrayerText(e.target.value)}
        />
      </main>

      <button className="save-btn" onClick={savePrayer}>
        Save
      </button>
    </>
  );
}

export default AddScreen;
