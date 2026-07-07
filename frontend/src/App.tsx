import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";

import AddScreen from "./components/AddScreen";
import SavedScreen from "./components/SavedScreen";
import PublicScreen from "./components/PublicScreen";
import HomeScreen from "./components/HomeScreen";
import LoginModal from "./modals/loginmodal";
import { NavBar } from "./modals/navbar";

import { useAuth } from "./auth/useAuth";
import type { Prayer } from "./types";
import ProfileModal from "./modals/profilemodal";

type Screen = "add" | "saved" | "public" | "home";

function App() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [prayerText, setPrayerText] = useState("");
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modal, setModal] = useState<"login" | "settings" | "profile" | null>(
    null,
  );

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

  async function getPublicPrayers() {
    const response = await fetch("http://localhost:3001/prayers/public");

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
    if (screen === "saved") {
      getPrayers();
    }

    if (screen === "public") {
      getPublicPrayers();
    }
  }, [screen, user]);

  return (
    <div className="app">
      {modal === "login" && <LoginModal close={() => setModal(null)} />}
      {modal === "settings" && <LoginModal close={() => setModal(null)} />}
      {modal === "profile" && <LoginModal close={() => setModal(null)} />}

      {showLogin && <LoginModal close={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal close={() => setShowProfile(false)} />}

      {
        <NavBar
          goToHome={() => setScreen(`home`)}
          goToAdd={!user ? () => setShowLogin(true) : () => setScreen(`add`)}
          goToAccount={
            !user ? () => setShowLogin(true) : () => setShowProfile(true)
          }
        />
      }

      {screen === `add` ? (
        <AddScreen
          prayerText={prayerText}
          setPrayerText={setPrayerText}
          savePrayer={savePrayer}
        />
      ) : screen === `home` ? (
        <HomeScreen
          goToPublic={() => setScreen(`public`)}
          goToSaved={
            !user ? () => setShowLogin(true) : () => setScreen(`saved`)
          }
        />
      ) : screen === `saved` ? (
        <SavedScreen
          prayers={prayers}
          deletePrayer={deletePrayer}
          changePrayer={changePrayer}
        />
      ) : (
        <PublicScreen prayers={prayers} />
      )}
    </div>
  );
}

export default App;
