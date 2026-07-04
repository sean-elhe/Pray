import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import HomeScreen from "./components/homescreen";
import SavedScreen from "./components/savedscreen";
import Login from "./components/login";

import { useAuth } from "./auth/useAuth";
import type { Prayer } from "./types";

type Screen = "home" | "saved";

function App() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [prayerText, setPrayerText] = useState("");
  const [prayers, setPrayers] = useState<Prayer[]>([]);

  async function savePrayer() {
    const response = await fetch("http://localhost:3001/prayers", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: prayerText,
      }),
    });

    console.log(response.status);
    console.log(await response.text());

    await getPrayers();
    setPrayerText("");
  }

  async function getPrayers() {
    const response = await fetch("http://localhost:3001/prayers", {
      credentials: "include",
    });

    const data = await response.json();
    setPrayers(data);
  }

  async function deletePrayer(id: number) {
    const response = await fetch(`http://localhost:3001/prayers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      await getPrayers();
    }
  }

  async function changePrayer(id: number, content: string) {
    try {
      const response = await fetch(`http://localhost:3001/prayers/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        console.error("Failed to update prayer");
        return;
      }

      await getPrayers();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getPrayers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      {screen === `home` ? (
        <HomeScreen
          prayerText={prayerText}
          setPrayerText={setPrayerText}
          savePrayer={savePrayer}
          goToSaved={() => setScreen(`saved`)}
        />
      ) : (
        <SavedScreen
          prayers={prayers}
          deletePrayer={deletePrayer}
          changePrayer={changePrayer}
          goBack={() => setScreen(`home`)}
        />
      )}
    </div>
  );
}

export default App;
