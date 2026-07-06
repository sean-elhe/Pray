// import '../index.css';
import "./addscreen.css";

type AddScreenProps = {
  prayerText: string;
  setPrayerText: React.Dispatch<React.SetStateAction<string>>;
  savePrayer: () => void;
};

function AddScreen({ prayerText, setPrayerText, savePrayer }: AddScreenProps) {
  return (
    <div className="prayer-card">
      <header>
        <h1>Add Prayer</h1>
      </header>

      <textarea
        rows={8}
        value={prayerText}
        placeholder="Our Father in heaven, hallowed be Your name."
        onChange={(e) => setPrayerText(e.target.value)}
      />

      <button onClick={savePrayer}>Save Prayer</button>
    </div>
  );
}

export default AddScreen;
