import { DndContext, DragOverlay, pointerWithin, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import styles from "./App.module.scss";
import SortableTask from "./SortableTask";
import { useMemos } from "./useMemos";
import SortableCategory from "./SortableCategory";
import React from "react";

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
    collapsedCategories,
    toggleCategoryCollapse,
    showSidebar,
    setShowSidebar,
    isMobile,
    mobileCategoryIndex,
    handlePrevCategory,
    handleNextCategory,
  } = useMemos();

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // テーマ切り替え
  React.useEffect(() => {
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
                placeholder=" input category here"
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
        <div className={styles.mainContainer}>
          {/* モバイル時だけカテゴリー切り替えボタン */}
          {isMobile && memos.length > 1 && !showSidebar && (
            <div className={styles.categorySwitchArrows}>
              <button
                className={styles.categoryArrowBtn}
                onClick={handlePrevCategory}
                aria-label="前のカテゴリー"
              >
                ←
              </button>
            </div>
          )}
          <div className={styles.category}>
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={memos.map(cat => cat.id)}
                strategy={verticalListSortingStrategy}
              >
                {memos
                  .filter((_, idx) =>
                    !isMobile
                      || (!showSidebar && idx === mobileCategoryIndex)
                      || (!showSidebar && !isMobile)
                  )
                  .map((categoryItem, categoryIndex) =>
                    !collapsedCategories.includes(categoryItem.id) && (
                      <SortableCategory
                        key={categoryItem.id}
                        id={categoryItem.id}
                        label={categoryItem.category}
                        onDelete={() => {
                          if (window.confirm("本当にこのカテゴリを削除しますか？")) {
                            deleteMemo(categoryIndex);
                          }
                        }}
                        onCollapse={() => toggleCategoryCollapse(categoryItem.id)}
                      >
                        <div className={styles.categoryContainer}>
                          <div>
                            <SortableContext
                              items={categoryItem.tasks.map(task => task.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {categoryItem.tasks
                                .slice()
                                .sort((a, b) => a.done - b.done)
                                .map((taskItem) => (
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
                                      value={
                                        isMobile
                                          ? taskInputs[mobileCategoryIndex] || ""
                                          : taskInputs[categoryIndex] || ""
                                      }
                                      onChange={e => {
                                        const idx = isMobile ? mobileCategoryIndex : categoryIndex;
                                        const newInputs = [...taskInputs];
                                        newInputs[idx] = e.target.value;
                                        setTaskInputs(newInputs);
                                      }}
                                      onKeyDown={e => {
                                        if (e.key === "Enter") {
                                          const idx = isMobile ? mobileCategoryIndex : categoryIndex;
                                          addTaskToCategory(idx, taskInputs[idx]);
                                        }
                                      }}
                                    />
                                    <button
                                      className={styles.addBtn}
                                      onClick={() => {
                                        const idx = isMobile ? mobileCategoryIndex : categoryIndex;
                                        addTaskToCategory(idx, taskInputs[idx]);
                                      }}
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
          {isMobile && memos.length > 1 && !showSidebar && (
            <div className={styles.categorySwitchArrows}>
              <button
                className={styles.categoryArrowBtn}
                onClick={handleNextCategory}
                aria-label="次のカテゴリー"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
