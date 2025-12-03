import { DndContext, DragOverlay, pointerWithin, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import styles from "./App.module.scss";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNavigation from "./components/MobileNavigation";
import CategoryList from "./components/CategoryList";
import SortableCategory from "./components/SortableCategory";
import SortableTask from "./components/SortableTask";
import { useTheme } from "./hooks/useTheme";
import { useCategoryManagement } from "./hooks/useCategoryManagement";
import { useTaskManagement } from "./hooks/useTaskManagement";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useMobileView } from "./hooks/useMobileView";

function App() {
  const { isAltColor, setIsAltColor } = useTheme();
  const {
    text,
    setText,
    categories,
    setCategories,
    addCategory,
    deleteCategory,
    toggleCategoryCollapse,
    isSidebarVisible,
    setIsSidebarVisible,
  } = useCategoryManagement();

  const {
    taskInputs,
    isTaskInputVisible,
    handleToggleTaskInput,
    toggleTaskDone,
    deleteTask,
    handleTaskInputChange,
    handleTaskKeyDown,
    handleTaskAddClick,
  } = useTaskManagement(categories, setCategories);

  const { activeTask, activeCategory, handleDragStart, handleDragEnd, handleDragCancel } =
    useDragAndDrop(categories, setCategories);

  const { isMobile, mobileCategoryIndex, handlePrevCategory, handleNextCategory } = useMobileView(
    categories
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className={`${isAltColor ? styles.themeB : styles.themeA} ${styles.container}`}>
      <Header
        isAltColor={isAltColor}
        setIsAltColor={setIsAltColor}
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />
      <br />
      <div className={styles.body}>
        {isSidebarVisible && (
          <Sidebar
            text={text}
            setText={setText}
            addCategory={addCategory}
            categories={categories}
            toggleCategoryCollapse={toggleCategoryCollapse}
          />
        )}

        <div className={styles.mainContainer}>
          {isMobile && categories.length > 1 && !isSidebarVisible && (
            <MobileNavigation direction="prev" onClick={handlePrevCategory} />
          )}

          <div className={styles.category}>
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <CategoryList
                categories={categories}
                isMobile={isMobile}
                mobileCategoryIndex={mobileCategoryIndex}
                isSidebarVisible={isSidebarVisible}
                deleteCategory={deleteCategory}
                toggleCategoryCollapse={toggleCategoryCollapse}
                toggleTaskDone={toggleTaskDone}
                deleteTask={deleteTask}
                isTaskInputVisible={isTaskInputVisible}
                handleToggleTaskInput={handleToggleTaskInput}
                taskInputs={taskInputs}
                handleTaskInputChange={handleTaskInputChange}
                handleTaskKeyDown={handleTaskKeyDown}
                handleTaskAddClick={handleTaskAddClick}
              />

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
                    <div className={`${styles.categoryContainer} ${styles.categoryContainerOverlay}`}>
                      {activeCategory.tasks?.map((taskItem) => (
                        <SortableTask
                          key={taskItem.id}
                          id={taskItem.id}
                          text={taskItem.text}
                          done={taskItem.done}
                          onToggle={() => {}}
                          onDelete={() => {}}
                        />
                      ))}
                    </div>
                  </SortableCategory>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {isMobile && categories.length > 1 && !isSidebarVisible && (
            <MobileNavigation direction="next" onClick={handleNextCategory} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
