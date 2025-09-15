import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "./App.module.scss";

function SortableTask({ id, text, done, onToggle, onDelete, isOverlay }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={
        isOverlay
          ? { opacity: 1, scale: 0.98, y: 10 }
          : false
      }
      animate={
        isOverlay
          ? { opacity: 1, scale: 1.04, y: 0, boxShadow: "0 8px 24px #3282B888, 0 0 0 2px #3282B8" }
          : { opacity: 1, scale: 1, y: 0, boxShadow: "none" }
      }
      exit={
        isOverlay
          ? { opacity: 0, scale: 1, y: -20 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{ duration: 0.18 }}
      className={`${styles.taskItem} ${isDragging ? styles.dragging : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
        zIndex: isOverlay ? 100 : undefined,
        pointerEvents: isOverlay ? "none" : undefined,
      }}
      {...attributes}
      // listenersはここでは付与しない
    >
      <span
        className={`${done ? styles.done : ""} ${styles.grab} ${styles.taskText}`}
        // ドラッグハンドルとしてlistenersをここに付与
        {...(!isOverlay && listeners)}
        style={{ cursor: !isOverlay ? "grab" : "default", userSelect: "none" }}
      >
        {text}
      </span>
      <span className={styles.taskIcons}>
        {!isOverlay && (
          <>
            <span
              className={styles.doneIcon}
              onClick={onToggle}
              tabIndex={0}
              role="button"
              aria-label="タスク完了切替"
            >
              ✓
            </span>
            <span
              className={styles.deleteIcon}
              onClick={() => onDelete(id)}
              tabIndex={0}
              role="button"
              aria-label="タスク削除"
            >
              ×
            </span>
          </>
        )}
      </span>
    </motion.div>
  );
}

export default SortableTask;