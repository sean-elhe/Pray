// import '../index.css';
import "./homescreen.css";

type HomeScreenProps = {
  prayerText: string;
  setPrayerText: React.Dispatch<React.SetStateAction<string>>;
  savePrayer: () => void;
  goToSaved: () => void;
};

function HomeScreen({
  prayerText,
  setPrayerText,
  savePrayer,
  goToSaved,
}: HomeScreenProps) {
  return (
    <div className="prayer-card">
      <div className="header-card">
        <h2>Prayer</h2>
        <button onClick={goToSaved}>Saved</button>
      </div>

      <textarea
        rows={8}
        value={prayerText}
        placeholder="Write your prayer here..."
        onChange={(e) => setPrayerText(e.target.value)}
      />

      <button onClick={savePrayer}>Save Prayer</button>
    </div>
  );
}

export default HomeScreen;
