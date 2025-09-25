import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "./App.module.scss";

function SortableCategory({ id, label, children, isOverlay, transform: overlayTransform }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const appliedTransform = isOverlay ? overlayTransform : transform;

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={isOverlay ? { opacity: 1, scale: 1, y: 10 } : false}
      animate={
        isOverlay
          ? {
              opacity: 1,
              scale: 1.0,
              y: 0,
              boxShadow: "0 8px 24px #3282B888, 0 0 0 2px #3282B8",
              background: "var(--category-bg)",
            }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: "none",
              background: "var(--main-bg)",
            }
      }
      exit={isOverlay ? { opacity: 0, scale: 1, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={styles.sortableCategory}
      style={{
        transform: appliedTransform ? CSS.Transform.toString(appliedTransform) : undefined,
        transition: transition || "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
        marginBottom: "16px",
        zIndex: isDragging || isOverlay ? 10 : "auto",
        minHeight: 100,
        pointerEvents: isOverlay ? "none" : undefined,
        borderRadius: isOverlay ? "18px" : "18px",
        border: isOverlay
      ? "3px solid var(--category-border-overlay)" // オーバーレイ時のボーダー
      : "3px solid var(--category-border)",   // 通常時のボーダー
      }}
      {...attributes}
    >
      <div
        className={styles.categoryHandle}
        {...listeners} // ←ここだけにリスナーを渡す
        {...attributes}
        style={{ cursor: "grab", userSelect: "none" }}
      >
        {label}
      </div>
      {children}
    </motion.div>
  );
}

export default SortableCategory;