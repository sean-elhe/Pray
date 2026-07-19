import { useState, useEffect } from "react";
import "./index.css";
import { useToast } from "./context/ToastContext";

import AddScreen from "./components/AddScreen";
import SavedScreen from "./components/SavedScreen";
import PublicScreen from "./components/PublicScreen";
import HomeScreen from "./components/HomeScreen";

import LoginModal from "./modals/loginmodal";
import { TopBar } from "./components/TopBar";

import { useAuth } from "./auth/useAuth";
import type { Prayer, Category } from "./types";
import ProfileModal from "./profile/ProfileModal";
import SharedScreen from "./components/SharedScreen";
import {
  deleteCategory,
  getCategories,
  updateCategory,
} from "./api/categories";

import {
  createPrayer,
  fetchSavedPrayers,
  fetchSharedPrayers,
  fetchPublicPrayers,
  removePrayer,
  editPrayer,
} from "./api/prayers";

type Screen = "add" | "saved" | "shared" | "public" | "home";

function App() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [screen, setScreen] = useState<Screen>("home");
  const [prayerText, setPrayerText] = useState("");
  const [publicPrayer, setPublicPrayer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [savedPrayers, setSavedPrayers] = useState<Prayer[]>([]);
  const [sharedPrayers, setSharedPrayers] = useState<Prayer[]>([]);
  const [publicPrayers, setPublicPrayers] = useState<Prayer[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const loaders: Record<Screen, () => Promise<void>> = {
    saved: getSavedPrayers,
    shared: getSharedPrayers,
    public: getPublicPrayers,
  };

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }

    if (user) {
      loadCategories();
    }
  }, [user]);

  async function savePrayer() {
    await createPrayer(prayerText, publicPrayer, selectedCategory?.id ?? null);

    await getSavedPrayers();

    setPrayerText("");
    setPublicPrayer(false);
    setSelectedCategory(null);

    showToast("Card saved");
  }

  async function getSavedPrayers() {
    const data = await fetchSavedPrayers();
    setSavedPrayers(data);
  }

  async function getSharedPrayers() {
    const data = await fetchSharedPrayers();
    setSharedPrayers(data);
  }

  async function getPublicPrayers() {
    const data = await fetchPublicPrayers();
    setPublicPrayers(data);
  }

  async function deletePrayer(id: number) {
    try {
      await removePrayer(id);

      await getSavedPrayers();

      showToast("Prayer deleted");
    } catch (err) {
      console.error(err);
    }
  }

  async function changePrayer(
    id: number,
    content: string,
    is_public: boolean,
    category_id: number,
  ) {
    try {
      await editPrayer(id, content, is_public, category_id);

      await getSavedPrayers();

      showToast("Prayer updated");
    } catch (err) {
      console.error(err);
    }
  }

  async function loadScreen(screen: Screen) {
    await loaders[screen]();
    setScreen(screen);
  }

  async function handleCategoryCreated(category: Category) {
    setCategories((prev) => [...prev, category]);
    setSelectedCategory(category);
  }

  async function handleCategoryUpdated(category: Category) {
    const updated = await updateCategory(
      category.id,
      category.name,
      category.color,
    );

    setCategories((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  async function handleCategoryChanged(
    prayerId: number,
    categoryId: number | null,
  ) {
    try {
      await editPrayer(prayerId, undefined, undefined, categoryId);

      await getSavedPrayers();

      showToast("Category updated");
    } catch (err) {
      console.error(err);
      showToast("Failed to update category");
    }
  }

  async function handleCategoryDeleted(id: number) {
    await deleteCategory(id);

    setCategories((prev) => prev.filter((category) => category.id !== id));

    if (selectedCategory?.id === id) {
      setSelectedCategory(null);
    }
  }

  return (
    <div className="app">
      {
        <TopBar
          goToHome={() => setScreen(`home`)}
          goToAdd={!user ? () => setShowLogin(true) : () => setScreen(`add`)}
          goToAccount={
            !user ? () => setShowLogin(true) : () => setShowProfile(true)
          }
        />
      }

      {showLogin && <LoginModal close={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal close={() => setShowProfile(false)} />}

      {/* {
        <NavBar
          goToHome={() => setScreen(`home`)}
          goToAdd={!user ? () => setShowLogin(true) : () => setScreen(`add`)}
          goToAccount={
            !user ? () => setShowLogin(true) : () => setShowProfile(true)
          }
        />
      } */}

      {screen === `add` ? (
        <AddScreen
          prayerText={prayerText}
          setPrayerText={setPrayerText}
          publicPrayer={publicPrayer}
          setPublicPrayer={setPublicPrayer}
          categories={categories}
          onCategoryCreated={handleCategoryCreated}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryDeleted={handleCategoryDeleted}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          savePrayer={savePrayer}
        />
      ) : screen === `home` ? (
        <HomeScreen
          goToPublic={() => loadScreen(`public`)}
          goToShared={
            !user ? () => setShowLogin(true) : () => loadScreen(`shared`)
          }
          goToSaved={
            !user ? () => setShowLogin(true) : () => loadScreen(`saved`)
          }
        />
      ) : screen === `saved` ? (
        <SavedScreen
          prayers={savedPrayers}
          deletePrayer={deletePrayer}
          changePrayer={changePrayer}
          publicPrayer={publicPrayer}
          setPublicPrayer={setPublicPrayer}
          categories={categories}
          onCategoryChanged={handleCategoryChanged}
          onCategoryCreated={handleCategoryCreated}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryDeleted={handleCategoryDeleted}
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
