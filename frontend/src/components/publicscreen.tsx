import "./savedscreen.css";
import { useState } from "react";
import type { Prayer } from "../types";
import { AnimatePresence } from "framer-motion";
import PrayerCard from "../modals/prayercard";

type PublicScreenProps = {
  prayers: Prayer[];
};

export default function PublicScreen({ prayers }: PublicScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (prayers.length === 0) {
    return (
      <>
        <div className="header">
          <div className="header-card">
            <h2>Public Prayers</h2>
          </div>
        </div>

        <main>
          <p>There was a problem connecting.</p>
        </main>
      </>
    );
  }

  const next = () => {
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, prayers.length - 1));
  };

  const previous = () => {
    setDirection(-1);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const currentPrayer = prayers[currentIndex];

  return (
    <>
      <header>
        <h1>Public Prayers</h1>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <PrayerCard
            key={currentPrayer.id}
            prayer={currentPrayer}
            onNext={next}
            onPrevious={previous}
            direction={direction}
          />
        </AnimatePresence>
      </main>

      {/* Temporary controls while testing */}
      {/* <div className="controls">
        <button onClick={previous} disabled={currentIndex === 0}>
          Previous
        </button>

        <span>
          {currentIndex + 1} / {prayers.length}
        </span>

        <button onClick={next} disabled={currentIndex === prayers.length - 1}>
          Next
        </button>
      </div> */}
    </>
  );
}
