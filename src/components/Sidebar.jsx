import styles from "../App.module.scss";

function Sidebar({ text, setText, addCategory, categories, toggleCategoryCollapse }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.categoryInputStyle}>
        <input
          className={styles.categoryInput}
          placeholder=" input category here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.isComposing) {
              addCategory();
            }
          }}
        />
        <button className={styles.categoryAddBtn} onClick={addCategory}>
          add
        </button>
      </div>
      {categories
        .filter((cat) => cat.collapsed)
        .map((cat) => (
          <div
            key={cat.id}
            className={styles.sidebarCategory}
            onClick={() => toggleCategoryCollapse(cat.id)}
          >
            {cat.category}
          </div>
        ))}
    </div>
  );
}

export default Sidebar;
