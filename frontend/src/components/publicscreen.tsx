import "./savedscreen.css";
import type { Prayer } from "../types";

type PublicScreenProps = {
  prayers: Prayer[];
  goBack: () => void;
};

function PublicScreen({ prayers, goBack }: PublicScreenProps) {
  return (
    <div className="prayer-card">
      <div className="header-card">
        <h2>Public Prayers</h2>

        <button onClick={goBack}>Back</button>
      </div>

      {prayers.map((prayer) => (
        <div className="saved-card" key={prayer.id}>
          <p>{prayer.content}</p>

          <small>By {prayer.name}</small>

          {prayer.is_answered && <p className="answered">✅ Answered</p>}
        </div>
      ))}
    </div>
  );
}

export default PublicScreen;
