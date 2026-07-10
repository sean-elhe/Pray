import "./prayercard.css";
import type { Prayer } from "../types";
import { motion } from "framer-motion";
import { useRef, type SetStateAction } from "react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type PrayerCardProps = {
  prayer: Prayer;
  onNext: () => void;
  onPrevious: () => void;
  onLongPress: () => void;
  direction: number;
  editing: boolean;
  publicPrayer: boolean;
  setPublicPrayer: React.Dispatch<SetStateAction<boolean>>;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
  savedScreen: boolean;
};

export default function PrayerCard({
  prayer,
  onNext,
  onPrevious,
  onLongPress,
  direction,
  editing,
  publicPrayer,
  setPublicPrayer,
  onSaveEdit,
  onCancelEdit,
  savedScreen,
}: PrayerCardProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const wasDragging = useRef(false);
  const longPressed = useRef(false);

  const startPress = () => {
    longPressed.current = false;

    timer.current = setTimeout(() => {
      longPressed.current = true;
      onLongPress();
    }, 600);
  };

  const endPress = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editing) return;

    startX.current = e.clientX;
    startY.current = e.clientY;
    wasDragging.current = false;

    startPress();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = Math.abs(e.clientX - startX.current);
    const dy = Math.abs(e.clientY - startY.current);

    if (dx > 10 || dy > 10) {
      wasDragging.current = true;
      endPress();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    endPress();

    if (editing) return;
    if (wasDragging.current) return;
    if (longPressed.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const EDGE_PERCENT = 0.2;

    if (x < rect.width * EDGE_PERCENT) {
      onPrevious();
    } else if (x > rect.width * (1 - EDGE_PERCENT)) {
      onNext();
    }
  };

  const handlePublic = () => {
    if (publicPrayer === false) {
      setPublicPrayer(true);
    } else {
      setPublicPrayer(false);
    }
  };

  const formatted = dayjs(prayer.created_at).format("MMMM D, YYYY - h:mm a");

  const [text, setText] = useState(prayer.content);

  useEffect(() => {
    setText(prayer.content);
  }, [prayer]);

  return (
    <div className="main">
      <motion.div
        className="saved-card"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={endPress}
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
        drag={editing ? false : "x"}
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
        {editing ? (
          <>
            <textarea
              className="prayer-edit"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </>
        ) : (
          <p className="prayer-body">{prayer.content}</p>
        )}

        <small className="prayer-name">
          {savedScreen === false ? "By " + prayer.name : formatted}
        </small>

        {prayer.is_answered && <p className="answered">✅ Answered</p>}
      </motion.div>

      {editing && (
        <div className="card-actions">
          <button className="edit-cancel" onClick={onCancelEdit}>
            X
          </button>
          <button className="edit-public" onClick={handlePublic}>
            {publicPrayer === false ? "🌐" : "🔒"}
          </button>
          <button className="edit-save" onClick={() => onSaveEdit(text)}>
            ✓
          </button>
        </div>
      )}
    </div>
  );
}
