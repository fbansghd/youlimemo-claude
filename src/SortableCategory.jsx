import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "./App.module.scss";

function SortableCategory({ id, label, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={false}
      animate={{ opacity: 1, y: 0 }} // ← 常に1に戻す
      transition={{ duration: 0.18 }}
      className={styles.sortableCategory}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
        marginBottom: "16px",
        zIndex: isDragging ? 10 : "auto",
        boxShadow: isDragging
          ? "0 8px 24px 0 #3282B888, 0 0 0 2px #3282B8"
          : "none",
        scale: isDragging ? 1.03 : 1,
        opacity: isDragging ? 1 : 1, // ← ドラッグ中だけ0.7、通常は1
      }}
      {...attributes}
    >
      <div
        className={styles.categoryHandle}
        style={{ cursor: "grab", fontWeight: "bold", userSelect: "none" }}
        {...listeners}
      >
        {label}
      </div>
      {children}
    </motion.div>
  );
}

export default SortableCategory;