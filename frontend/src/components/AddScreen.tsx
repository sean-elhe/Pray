import "../modals/prayercard.css";

type AddScreenProps = {
  prayerText: string;
  setPrayerText: React.Dispatch<React.SetStateAction<string>>;
  publicPrayer: boolean;
  setPublicPrayer: React.Dispatch<React.SetStateAction<boolean>>;
  savePrayer: () => void;
};

function AddScreen({
  prayerText,
  setPrayerText,
  publicPrayer,
  setPublicPrayer,
  savePrayer,
}: AddScreenProps) {
  const handleClear = () => {
    setPrayerText("");
  };

  const handlePublic = () => {
    setPublicPrayer((prev) => !prev);
  };

  return (
    <>
      <div className="main">
        <div className="saved-card">
          <textarea
            className="prayer-edit"
            value={prayerText}
            placeholder={`Our Father in heaven, \n\nHallowed be Your name, Your kingdom come, Your will be done, on earth as it is in heaven.\n\nGive us today our daily bread. And forgive us our debts, as we also have forgiven our debtors.\n\nAnd lead us not into temptation, but deliver us from the evil one.
                `}
            onChange={(e) => setPrayerText(e.target.value)}
          />
        </div>
        <div className="card-actions">
          <button className="edit-cancel" onClick={handleClear}>
            Clear
          </button>
          <button className="edit-public" onClick={handlePublic}>
            {publicPrayer ? "Private" : "Public"}
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
