// import '../index.css';
import './savedscreen.css';

type SavedScreenProps = {
  prayers: string[];
  deletePrayer: (index: number) => void;
  goBack: () => void;
};

function SavedScreen({ prayers, deletePrayer, goBack }: SavedScreenProps) {
  return (
    <div className="prayer-card">
      <div className="header-card">
        <h2>Saved Prayers</h2>

        <button onClick={goBack}>Back</button>
      </div>

      {prayers.map((prayer, index) => (
        <div className="saved-card" key={index}>
          <p>{prayer}</p>

          <button onClick={() => deletePrayer(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default SavedScreen;
