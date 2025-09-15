import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect } from "react";
import styles from "./App.module.scss";
import SortableTask from "./SortableTask";
import { useMemos } from "./useMemos";
import SortableCategory from "./SortableCategory";

function App() {
  const {
    text,
    setText,
    taskInputs,
    setTaskInputs,
    memos,
    addCategory,
    addTaskToCategory,
    toogleTaskDone,
    deleteTask,
    deleteMemo,
    showTaskInput,
    toggleTaskInput,
    showCategoryInput,
    setShowCategoryInput,
    isAltColor,
    setIsAltColor,
    activeTask,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useMemos();

  useEffect(() => {
    document.body.classList.remove(styles.themeA, styles.themeB);
    document.body.classList.add(isAltColor ? styles.themeB : styles.themeA);
  }, [isAltColor]);

  return (
    <div className={`${isAltColor ? styles.themeB : styles.themeA} ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.title}>Todo List</div>
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
          <div className={styles.changeCategory}>
            <div className={styles.addCategory}>
              <div>Category+</div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={showCategoryInput}
                  onChange={() => setShowCategoryInput(prev => !prev)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            {showCategoryInput && (
              <div className={styles.categoryInputStyle}>
                <input
                  className={styles.categoryInput}
                  placeholder="  input category here"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCategory()}
                />
                <button
                  className={styles.categoryAddBtn}
                  onClick={addCategory}
                >
                  add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <br />
      <div className={styles.category}>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={memos.map(cat => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            {memos.map((categoryItem, categoryIndex) => (
              <SortableCategory
                key={categoryItem.id}
                id={categoryItem.id}
                label={categoryItem.category}
              >
                <div className={styles.categoryContainer}>
                  <div>
                    <div className={styles.deleteBtn}>
                      <span
                        className={styles.deleteIcon}
                        onClick={() => {
                          if (window.confirm("本当にこのカテゴリを削除しますか？")) {
                            deleteMemo(categoryIndex);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label="カテゴリ削除"
                        onKeyDown={e =>
                          (e.key === "Enter" || e.key === " ") &&
                          window.confirm("本当にこのカテゴリを削除しますか？") &&
                          deleteMemo(categoryIndex)
                        }
                      >
                        ｘ
                      </span>
                    </div>
                    <SortableContext
                      items={categoryItem.tasks.map(task => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {categoryItem.tasks.map((taskItem, taskIndex) => (
                        <SortableTask
                          key={taskItem.id}
                          id={taskItem.id}
                          text={taskItem.text}
                          done={taskItem.done}
                          onToggle={() => toogleTaskDone(categoryIndex, taskItem.id)}
                          onDelete={() => deleteTask(categoryIndex, taskItem.id)}
                        />
                      ))}
                    </SortableContext>
                    <div className={styles.inputBtnContainer}>
                      <div className={styles.inputBtn}>
                        <span
                          className={styles.inputToggleIcon}
                          onClick={() => toggleTaskInput(categoryIndex)}
                          tabIndex={0}
                          role="button"
                          aria-label="タスク入力欄の表示切替"
                          style={{ marginTop: "0.5rem" }}
                        >
                          {showTaskInput[categoryIndex] ? "−" : "+"}
                        </span>
                      </div>
                      <div>
                        {showTaskInput[categoryIndex] && (
                          <div className={styles.memoInputStyle}>
                            <input
                              className={styles.memoInput}
                              placeholder="input task"
                              value={taskInputs[categoryIndex] || ""}
                              onChange={e => {
                                const newInputs = [...taskInputs];
                                newInputs[categoryIndex] = e.target.value;
                                setTaskInputs(newInputs);
                              }}
                              onKeyDown={e =>
                                e.key === "Enter" &&
                                addTaskToCategory(categoryIndex, taskInputs[categoryIndex])
                              }
                            />
                            <button
                              className={styles.addBtn}
                              onClick={() =>
                                addTaskToCategory(categoryIndex, taskInputs[categoryIndex])
                              }
                            >
                              add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SortableCategory>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeTask ? (
              <SortableTask
                id={activeTask.id}
                text={activeTask.text}
                done={activeTask.done}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
