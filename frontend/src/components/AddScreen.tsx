// import "./modals/prayercard.css";
import { useState } from "react";
import CategoryModal from "../modals/CategoryModal";
import "./components.css";
import type { Category } from "../types";
import CollapsibleSection from "../profile/CollapsibleSection";

type AddScreenProps = {
  prayerText: string;
  setPrayerText: React.Dispatch<React.SetStateAction<string>>;

  publicPrayer: boolean;
  setPublicPrayer: React.Dispatch<React.SetStateAction<boolean>>;

  categories: Category[];
  onCategoryCreated: (category: Category) => void;
  onCategoryUpdated: (category: Category) => Promise<void>;
  onCategoryDeleted: (id: number) => Promise<void>;

  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;

  savePrayer: () => void;
};

function AddScreen({
  prayerText,
  setPrayerText,
  publicPrayer,
  setPublicPrayer,
  categories,
  onCategoryCreated,
  onCategoryUpdated,
  onCategoryDeleted,
  selectedCategory,
  setSelectedCategory,
  savePrayer,
}: AddScreenProps) {
  const handlePublic = () => {
    setPublicPrayer((prev) => !prev);
  };
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <>
      <div className="background-glow" />

      <main>
        <div className="prayer-card">
          <textarea
            className="prayer-edit"
            value={prayerText}
            placeholder={`Our Father in heaven, \n\nHallowed be Your name, Your kingdom come, Your will be done, on earth as it is in heaven.\n\nGive us today our daily bread. And forgive us our debts, as we also have forgiven our debtors.\n\nAnd lead us not into temptation, but deliver us from the evil one.
                `}
            onChange={(e) => setPrayerText(e.target.value)}
          />
        </div>
      </main>

      <section>
        <CollapsibleSection title="Save">
          <button
            className="category-picker"
            style={{
              borderLeft: selectedCategory
                ? `6px solid ${selectedCategory.color}`
                : "6px solid transparent",
            }}
            onClick={() => setShowCategoryModal(true)}
          >
            {selectedCategory?.name ?? "No Category"}
          </button>

          <div className="visiblity">
            <button className="visiblity-picker" onClick={handlePublic}>
              {publicPrayer === false ? "Make public" : "Make private"}
            </button>
          </div>

          <button className="save-btn" onClick={savePrayer}>
            Save Prayer
          </button>
        </CollapsibleSection>
      </section>

      {showCategoryModal && (
        <CategoryModal
          close={() => setShowCategoryModal(false)}
          categories={categories}
          selectedCategoryId={() => {}}
          onSelect={(category) => {
            setSelectedCategory(category);
            setShowCategoryModal(false);
          }}
          onCreated={onCategoryCreated}
          onUpdated={onCategoryUpdated}
          onDeleted={onCategoryDeleted}
        />
      )}
    </>
  );
}

export default AddScreen;
