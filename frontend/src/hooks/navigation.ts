import { useState } from "react";
import type { Prayer } from "../types";

export function usePrayerNavigation(prayers: Prayer[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);

    setCurrentIndex((i) => Math.min(i + 1, prayers.length - 1));
  };

  const previous = () => {
    setDirection(-1);

    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const currentPrayer = prayers[currentIndex];

  return {
    currentPrayer,
    currentIndex,
    direction,
    next,
    previous,
  };
}
