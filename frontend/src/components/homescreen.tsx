import "./homescreen.css";

type HomeScreenProps = {
  goToPublic: () => void;
  goToSaved: () => void;
};

export default function HomeScreen({ goToPublic, goToSaved }: HomeScreenProps) {
  return (
    <>
      <div className="background-glow" />

      <header>
        <h1>Prayer Cards</h1>
      </header>

      <main>
        <div className="card sage">
          <h2>Public</h2>
          <button onClick={goToPublic} className="bottom">
            →
          </button>
        </div>

        <div className="card sand">
          <h2>Shared</h2>
          <div className="bottom">
            <span></span>
            <span> →</span>
          </div>
        </div>

        <div className="card slate">
          <h2>Self</h2>
          <button onClick={goToSaved} className="bottom">
            →
          </button>
        </div>
      </main>

      {}
    </>
  );
}
