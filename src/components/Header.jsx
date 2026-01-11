import styles from "../App.module.scss";

function Header({ isAltColor, setIsAltColor, isSidebarVisible, setIsSidebarVisible }) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>SortNote</div>
      <div className={styles.headerContainer}>
        <div className={styles.toggleContainer}>
          <div>Theme Color</div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={isAltColor}
              onChange={() => setIsAltColor((prev) => !prev)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleContainer}>
          <div>MemoBox</div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={isSidebarVisible}
              onChange={() => setIsSidebarVisible((prev) => !prev)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Header;
