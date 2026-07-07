import "./prayercard.css";
import type { Prayer } from "../types";
import { motion } from "framer-motion";
import { useRef } from "react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type PrayerCardProps = {
  prayer: Prayer;
  onNext: () => void;
  onPrevious: () => void;
  onLongPress: () => void;
  direction: number;
  editing: boolean;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
};

export default function PrayerCard({
  prayer,
  onNext,
  onPrevious,
  onLongPress,
  direction,
  editing,
  onSaveEdit,
  onCancelEdit,
}: PrayerCardProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    timer.current = setTimeout(() => {
      onLongPress();
    }, 600);
  };

  const endPress = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
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
        onPointerDown={startPress}
        onPointerUp={endPress}
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

            {/* <div className="card-actions">
              <button className="edit-cancel" onClick={onCancelEdit}>
                <X size={22}></X>
              </button>
              <button className="edit-save" onClick={() => onSaveEdit(text)}>
                <Check size={22}></Check>
              </button>
            </div> */}
          </>
        ) : (
          <p className="prayer-body">{prayer.content}</p>
        )}

        <small className="prayer-date">{formatted}</small>

        {prayer.is_answered && <p className="answered">✅ Answered</p>}
      </motion.div>

      {editing && (
        <div className="card-actions">
          <button className="edit-cancel" onClick={onCancelEdit}>
            <X size={22}></X>
          </button>
          <button className="edit-save" onClick={() => onSaveEdit(text)}>
            <Check size={22}></Check>
          </button>
        </div>
      )}
    </div>
  );
}
