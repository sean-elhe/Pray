import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import { useToast } from "./context/ToastContext";
import { api } from "./api/client";

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
  const { showToast } = useToast();
  const [screen, setScreen] = useState<Screen>("home");
  const [prayerText, setPrayerText] = useState("");
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modal, setModal] = useState<"login" | "settings" | "profile" | null>(
    null,
  );

  async function savePrayer() {
    await api("/api/prayers", {
      method: "POST",
      body: JSON.stringify({
        content: prayerText,
      }),
    });

    await getPrayers();
    setPrayerText("");
    showToast("Card saved");
  }

  async function getPrayers() {
    const data = await api("/api/prayers");
    setPrayers(data);
  }

  async function getPublicPrayers() {
    const data = await api("/api/prayers/public");
    setPrayers(data);
  }

  async function deletePrayer(id: number) {
    try {
      await api(`/api/prayers/${id}`, {
        method: "DELETE",
      });

      await getPrayers();
    } catch (err) {
      console.error(err);
    }
  }

  async function changePrayer(id: number, content: string) {
    try {
      await api(`/api/prayers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ content }),
      });

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
