import "./prayercard.css";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useRef, useState, type SetStateAction } from "react";
import type { Prayer } from "../types";

type PrayerCardProps = {
  prayer: Prayer;
  onNext: () => void;
  onPrevious: () => void;
  onDoubleTap: () => void;
  onCategoryClick: () => void;
  direction: number;
  editing: boolean;
  publicPrayer: boolean;
  setPublicPrayer: React.Dispatch<SetStateAction<boolean>>;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
  isSavedScreen: boolean;
};

export default function PrayerCard({
  prayer,
  onNext,
  onPrevious,
  onDoubleTap,
  onCategoryClick,
  direction,
  editing,
  publicPrayer,
  setPublicPrayer,
  onSaveEdit,
  onCancelEdit,
  isSavedScreen,
}: PrayerCardProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const wasDragging = useRef(false);
  const lastTap = useRef(0);

  const [text, setText] = useState(prayer.content);

  const formattedDate = dayjs(prayer.created_at).format(
    "MMMM D, YYYY - h:mm a",
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editing) return;

    startX.current = e.clientX;
    startY.current = e.clientY;
    wasDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const movedX = Math.abs(e.clientX - startX.current);
    const movedY = Math.abs(e.clientY - startY.current);

    if (movedX > 10 || movedY > 10) {
      wasDragging.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editing || wasDragging.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const EDGE_PERCENT = 0.2;

    if (x < rect.width * EDGE_PERCENT) {
      onPrevious();
    } else if (x > rect.width * (1 - EDGE_PERCENT)) {
      onNext();
    }
  };

  const handleClick = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      onDoubleTap();
    }

    lastTap.current = now;
  };

  const togglePublic = () => {
    setPublicPrayer((current) => !current);
  };

  return (
    <div className="card-container">
      <motion.div
        className="prayer-card"
        style={{
          border: prayer.category_color
            ? `6px solid ${prayer.category_color}`
            : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
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
          } else if (info.offset.x > 100) {
            onPrevious();
          }
        }}
      >
        {editing ? (
          <textarea
            className="prayer-edit"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <p className="prayer-body">{prayer.content}</p>
        )}

        <div className="footer">
          <small className="prayer-name">
            {isSavedScreen ? formattedDate : `By ${prayer.name}`}
          </small>

          {prayer.category_name && (
            <button
              className="category-label"
              onClick={onCategoryClick}
              style={{
                backgroundColor: prayer.category_color ?? undefined,
              }}
            >
              {prayer.category_name}
            </button>
          )}
        </div>

        {prayer.is_answered && <p className="answered">✅ Answered</p>}
      </motion.div>

      {editing && (
        <div className="card-actions">
          <button className="edit-cancel" onClick={onCancelEdit}>
            X
          </button>

          <button className="edit-public" onClick={togglePublic}>
            {publicPrayer ? "🔒" : "🌐"}
          </button>

          <button className="edit-save" onClick={() => onSaveEdit(text)}>
            ✓
          </button>
        </div>
      )}
    </div>
  );
}
