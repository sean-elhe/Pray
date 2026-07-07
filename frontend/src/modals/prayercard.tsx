import "./prayercard.css";
import type { Prayer } from "../types";
import { motion } from "framer-motion";

type PrayerCardProps = {
  prayer: Prayer;
  onNext: () => void;
  onPrevious: () => void;
  direction: number;
};

export default function PrayerCard({
  prayer,
  onNext,
  onPrevious,
  direction,
}: PrayerCardProps) {
  return (
    <motion.div
      className="saved-card"
      initial={{
        opacity: 0,
        x: direction > 0 ? 150 : -150,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: direction > 0 ? -150 : 150,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) {
          onNext();
        }

        if (info.offset.x > 100) {
          onPrevious();
        }
      }}
    >
      <p>{prayer.content}</p>

      <small>By {prayer.name}</small>

      {prayer.is_answered && <p className="answered">✅ Answered</p>}
    </motion.div>
  );
}
