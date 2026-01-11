import styles from "../App.module.scss";

function TaskInput({
  categoryIndex,
  mobileCategoryIndex,
  isMobile,
  isTaskInputVisible,
  onToggleTaskInput,
  taskInputs,
  onInputChange,
  onKeyDown,
  onAddClick,
}) {
  const currentIdx = isMobile ? mobileCategoryIndex : categoryIndex;

  return (
    <div className={styles.inputBtnContainer}>
      <div className={styles.inputBtn}>
        <span
          className={styles.inputToggleIcon}
          onClick={() => onToggleTaskInput(categoryIndex)}
          tabIndex={0}
          role="button"
          aria-label="タスク入力欄の表示切替"
          style={{ marginTop: "0.5rem" }}
        >
          {isTaskInputVisible[categoryIndex] ? "−" : "+"}
        </span>
      </div>
      <div>
        {isTaskInputVisible[categoryIndex] && (
          <div className={styles.memoInputStyle}>
            <input
              className={styles.memoInput}
              placeholder="input task"
              value={taskInputs[currentIdx] || ""}
              onChange={(e) => onInputChange(currentIdx, e.target.value)}
              onKeyDown={(e) => onKeyDown(currentIdx, e)}
            />
            <button className={styles.addBtn} onClick={() => onAddClick(currentIdx)}>
              add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskInput;
