import "./bottomsheet.css";
import { motion } from "framer-motion";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({
  open,
  onClose,
  children,
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <motion.div
        className="bottom-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
}
