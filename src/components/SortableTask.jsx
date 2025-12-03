import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "../App.module.scss";
import { ANIMATION_DURATION_LONG, ANIMATION_EASING } from "../constants";

function SortableTask({ id, text, done, onToggle, onDelete, isOverlay }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const taskClass = `${styles.taskItem} ${done ? styles.done : ""} ${isDragging ? styles.dragging : ""} ${isOverlay ? styles.overlay : ""}`;
  const textClass = `${done ? styles.done : ""} ${styles.grab} ${styles.taskText} ${isOverlay ? styles.overlay : ""}`;

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={isOverlay ? { opacity: 1, scale: 1, y: 10 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={isOverlay ? { opacity: 0, scale: 1, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION_LONG }}
      className={taskClass}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition || `transform ${ANIMATION_DURATION_LONG * 1000}ms ${ANIMATION_EASING}`,
      }}
      {...attributes}
    >
      <span
        className={textClass}
        {...(!isOverlay && listeners)}
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
