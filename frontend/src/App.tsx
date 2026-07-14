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
import ProfileModal from "./profile/ProfileModal";
import SharedScreen from "./components/SharedScreen";

type Screen = "add" | "saved" | "shared" | "public" | "home";

function App() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [screen, setScreen] = useState<Screen>("home");
  const [prayerText, setPrayerText] = useState("");
  const [publicPrayer, setPublicPrayer] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modal, setModal] = useState<"login" | "settings" | "profile" | null>(
    null,
  );

  const [savedPrayers, setSavedPrayers] = useState<Prayer[]>([]);
  const [sharedPrayers, setSharedPrayers] = useState<Prayer[]>([]);
  const [publicPrayers, setPublicPrayers] = useState<Prayer[]>([]);

  async function savePrayer() {
    await api("/api/prayers", {
      method: "POST",
      body: JSON.stringify({
        content: prayerText,
        is_public: publicPrayer,
      }),
    });

    await getPrayers();
    setPrayerText("");
    setPublicPrayer(false);
    showToast("Card saved");
  }

  async function getPrayers() {
    const data = await api("/api/prayers");
    setSavedPrayers(data);
  }

  async function getSharedPrayers() {
    const data = await api("/api/prayers/shared");
    setSharedPrayers(data);
  }

  async function getPublicPrayers() {
    const data = await api("/api/prayers/public");
    setPublicPrayers(data);
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

  async function changePrayer(id: number, content: string, is_public: boolean) {
    try {
      await api(`/api/prayers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          content,
          is_public,
        }),
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

    if (screen === "shared") {
      getSharedPrayers();
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
          publicPrayer={publicPrayer}
          setPublicPrayer={setPublicPrayer}
          savePrayer={savePrayer}
        />
      ) : screen === `home` ? (
        <HomeScreen
          goToPublic={() => setScreen(`public`)}
          goToShared={
            !user ? () => setShowLogin(true) : () => setScreen(`shared`)
          }
          goToSaved={
            !user ? () => setShowLogin(true) : () => setScreen(`saved`)
          }
        />
      ) : screen === `saved` ? (
        <SavedScreen
          prayers={savedPrayers}
          deletePrayer={deletePrayer}
          changePrayer={changePrayer}
          publicPrayer={publicPrayer}
          setPublicPrayer={setPublicPrayer}
        />
      ) : screen === `shared` ? (
        <SharedScreen prayers={sharedPrayers} />
      ) : (
        <PublicScreen prayers={publicPrayers} />
      )}
    </div>
  );
}

export default App;
