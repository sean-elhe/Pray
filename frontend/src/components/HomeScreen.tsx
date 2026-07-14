import "./homescreen.css";

type HomeScreenProps = {
  goToPublic: () => void;
  goToShared: () => void;
  goToSaved: () => void;
};

export default function HomeScreen({
  goToPublic,
  goToShared,
  goToSaved,
}: HomeScreenProps) {
  return (
    <>
      <div className="background-glow" />

      <header>
        <h1></h1>
      </header>

      <main>
        <button onClick={goToPublic} className="card sage">
          <h2>Public</h2>
        </button>

        <button onClick={goToShared} className="card sand">
          <h2>Shared</h2>
        </button>

        <button onClick={goToSaved} className="card slate">
          <h2>Saved</h2>
        </button>
      </main>

      {}
    </>
  );
}
