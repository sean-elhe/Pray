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
        <button onClick={goToPublic} className="card sage">
          <h2>Public</h2>
        </button>

        <button className="card sand">
          <h2>Shared</h2>
        </button>

        <button onClick={goToSaved} className="card slate">
          <h2>Self</h2>
        </button>
      </main>

      {}
    </>
  );
}
