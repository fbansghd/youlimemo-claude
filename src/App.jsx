import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
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
    isAltColor,
    setIsAltColor,
    activeTask,
    activeCategory,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useMemos();

  const [showSidebar, setShowSidebar] = useState(false);

  // カテゴリー折りたたみ状態をlocalStorageで保存・復元
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    const saved = localStorage.getItem("collapsedCategories");
    return saved ? JSON.parse(saved) : [];
  });

  // 保存
  useEffect(() => {
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsedCategories));
  }, [collapsedCategories]);

  // 折りたたみトグル関数
  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
          <div className={styles.toggleContainer}>
            <div>Sidebar</div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={showSidebar}
                onChange={() => setShowSidebar((prev) => !prev)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.body}>
        {/* サイドバー */}
        {showSidebar && (
          <div className={styles.sidebar}>
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
            {memos
              .filter(cat => collapsedCategories.includes(cat.id))
              .map(cat => (
                <div
                  key={cat.id}
                  className={styles.sidebarCategory}
                  onClick={() => toggleCategoryCollapse(cat.id)}
                >
                  {cat.category}
                </div>
              ))}
          </div>
        )}

        {/* メイン */}
        <div className={styles.category}>
          <DndContext
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={memos.map(cat => cat.id)}
              strategy={verticalListSortingStrategy}
            >
              {memos.map((categoryItem, categoryIndex) =>
                !collapsedCategories.includes(categoryItem.id) && (
                  <SortableCategory
                    key={categoryItem.id}
                    id={categoryItem.id}
                    label={categoryItem.category}
                  >
                    <div className={styles.categoryContainer}>
                      <div>
                        <div className={styles.deleteBtn}>
                          {/* 閉じるボタン */}
                          <span
                            className={styles.collapseBtn}
                            onClick={() => toggleCategoryCollapse(categoryItem.id)}
                            tabIndex={0}
                            role="button"
                            aria-label="カテゴリをたたむ"
                          >
                            ー
                          </span>
                          {/* xボタン */}
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
                          {categoryItem.tasks
                            .slice() // 配列をコピー
                            .sort((a, b) => a.done - b.done) // 未完了が上、完了が下
                            .map((taskItem, taskIndex) => (
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
                ))
              }
            </SortableContext>
            <DragOverlay>
              {activeTask ? (
                <SortableTask
                  id={activeTask.id}
                  text={activeTask.text}
                  done={activeTask.done}
                  onToggle={() => {}}
                  onDelete={() => {}}
                  isOverlay={true}
                />
              ) : activeCategory ? (
                <SortableCategory
                  id={activeCategory.id}
                  label={activeCategory.label}
                  isOverlay={true}
                >
                  <div
                    className={`${styles.categoryContainer} ${styles.categoryContainerOverlay}`}
                  >
                    {activeCategory.tasks?.map((taskItem) => (
                      <SortableTask
                        key={taskItem.id}
                        id={taskItem.id}
                        text={taskItem.text}
                        done={taskItem.done}
                        onToggle={() => {}}
                        onDelete={() => {}}
                        isParentOverlay={true}
                      />
                    ))}
                  </div>
                </SortableCategory>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;
