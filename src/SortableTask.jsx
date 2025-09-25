import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "./App.module.scss";

function SortableTask({ id, text, done, onToggle, onDelete, isOverlay, isParentOverlay  }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={
        isOverlay
          ? { opacity: 1, scale: 1, y: 10 }
          : false
      }
      animate={
        isOverlay
          ? isParentOverlay 
            ? { opacity: 1, scale: 1, y: 0, boxShadow: "none", background: "#b89d19ff" } 
            : { opacity: 1, scale: 1, y: 0, boxShadow: "0 8px 24px #3282B888, 0 0 0 2px #3282B8", background: "#68afdf" }
          : { opacity: 1, scale: 1, y: 0, boxShadow: "none" }
      }
      exit={
        isOverlay
          ? { opacity: 0, scale: 1, y: -20 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{ duration: 0.18 }}
      className={`${styles.taskItem} ${done ? styles.done : ""} ${isDragging ? styles.dragging : ""} ${isParentOverlay ? styles.isParentOverlay : ""}`}
      style={{
        minHeight: isOverlay ? 40 : 40, // ← ここで直接指定
        borderRadius: isOverlay ? "4px" : "4px", 
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
      {!isOverlay && (
        <span className={styles.taskIcons}>
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
        </span>
      )}
    </motion.div>
  );
}

export default SortableTask;