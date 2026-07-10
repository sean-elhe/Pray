import { useState } from "react";
import { useToast } from "../context/ToastContext";
import type { Prayer } from "../types";

export function usePrayerNavigation(prayers: Prayer[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { showToast } = useToast();

  const next = () => {
    if (prayers.length === 0) return;

    setDirection(1);
    setCurrentIndex((i) => {
      const nextIndex = (i + 1) % prayers.length;

      if (nextIndex === 0) {
        showToast("All prayers completed");
      }

      return nextIndex;
    });
  };

  const previous = () => {
    if (prayers.length === 0) return;

    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + prayers.length) % prayers.length);
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
