import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "./App.module.scss";

function SortableCategory({ id, label, children, isOverlay, transform: overlayTransform, onDelete, onCollapse }) {
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
          ? "3px solid var(--category-border-overlay)"
          : "3px solid var(--category-border)",
      }}
      {...attributes}
    >
      <div
        className={styles.categoryHandle}
        style={{
          cursor: "grab",
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative", // ← 追加
        }}
      >
        {/* ドラッグ領域 */}
        <span
          {...listeners}
          {...attributes}
          style={{
            flex: 1,
            minWidth: 0,
            paddingRight: "2.5em",
            cursor: "grab",
            display: "block",
            zIndex: 2, // ← 追加
            pointerEvents: "auto", // ← 追加
          }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", zIndex: 3 }}>
          <span
            className={styles.collapseBtn}
            tabIndex={0}
            role="button"
            aria-label="カテゴリをたたむ"
            style={{
              marginRight: "0.5em",
              cursor: "pointer",
              fontSize: "1.1rem",
              zIndex: 3, // ← 追加
              pointerEvents: "auto", // ← 追加
            }}
            onClick={onCollapse}
          >
            ー
          </span>
          <span
            className={styles.deleteIcon}
            onClick={onDelete}
            tabIndex={0}
            role="button"
            aria-label="カテゴリ削除"
            style={{
              marginLeft: "0",
              cursor: "pointer",
              fontSize: "1.3rem",
              zIndex: 3, // ← 追加
              pointerEvents: "auto", // ← 追加
            }}
          >
            ｘ
          </span>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default SortableCategory;