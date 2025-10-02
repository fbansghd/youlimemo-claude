import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

export function useMemos() {
  const [text, setText] = useState("");
  const [taskInputs, setTaskInputs] = useState([]);
  const [memos, setMemos] = useState(() => {
    const saved = localStorage.getItem("memos");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTask, setActiveTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // サイドバー表示
  const [showSidebar, setShowSidebar] = useState(false);

  // モバイル判定
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // モバイル用カテゴリー切り替え（閉じているカテゴリーはスキップ）
  const [mobileCategoryIndex, setMobileCategoryIndex] = useState(0);

  // カテゴリー折りたたみ状態
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    const saved = localStorage.getItem("collapsedCategories");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsedCategories));
  }, [collapsedCategories]);

  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getOpenCategoryIndexes = () =>
    memos
      .map((cat, idx) => (!collapsedCategories.includes(cat.id) ? idx : null))
      .filter(idx => idx !== null);

  const handlePrevCategory = () => {
    const openIndexes = getOpenCategoryIndexes();
    if (openIndexes.length === 0) return;
    const currentIdx = openIndexes.indexOf(mobileCategoryIndex);
    const prevIdx = (currentIdx - 1 + openIndexes.length) % openIndexes.length;
    setMobileCategoryIndex(openIndexes[prevIdx]);
  };

  const handleNextCategory = () => {
    const openIndexes = getOpenCategoryIndexes();
    if (openIndexes.length === 0) return;
    const currentIdx = openIndexes.indexOf(mobileCategoryIndex);
    const nextIdx = (currentIdx + 1) % openIndexes.length;
    setMobileCategoryIndex(openIndexes[nextIdx]);
  };

  // localStorageから復元
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // memosが変わるたびに保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const addCategory = () => {
    if (!text) return;
    setMemos([...memos, { id: uuidv4(), category: text, tasks: [] }]);
    setText("");
    setTaskInputs([...taskInputs, ""]);
  };

  const sortTasks = (tasks) => {
    return tasks.slice().sort((a, b) => a.done - b.done);
  };

  // タスク追加
  const addTaskToCategory = (catIdx, task) => {
    if (!task) return;
    setMemos((prev) => {
      const newMemos = [...prev];
      const tasks = [...newMemos[catIdx].tasks, { id: uuidv4(), text: task, done: false }];
      newMemos[catIdx].tasks = sortTasks(tasks);
      return newMemos;
    });
    const newInputs = [...taskInputs];
    newInputs[catIdx] = "";
    setTaskInputs(newInputs);
  };

  // タスク完了切り替え
  const toogleTaskDone = (catIdx, taskId) => {
    setMemos((prev) => {
      const newMemos = [...prev];
      const tasks = newMemos[catIdx].tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      newMemos[catIdx].tasks = sortTasks(tasks);
      return newMemos;
    });
  };

  // タスク削除
  const deleteTask = (catIdx, taskId) => {
    setMemos((prev) => {
      const newMemos = [...prev];
      const tasks = newMemos[catIdx].tasks.filter((task) => task.id !== taskId);
      newMemos[catIdx].tasks = sortTasks(tasks);
      return newMemos;
    });
  };

  const deleteMemo = (catIdx) => {
    setMemos((memos) => memos.filter((_, i) => i !== catIdx));
    setTaskInputs((inputs) => inputs.filter((_, i) => i !== catIdx));
  };

  // DnD Kit用
  const handleDragStart = (event) => {
    const { active } = event;
    // タスク
    const task = memos
      .flatMap((cat) => cat.tasks)
      .find((task) => task.id === active.id);
    setActiveTask(task);

    // カテゴリ
    const category = memos.find((cat) => cat.id === active.id);
    if (category) {
      setActiveCategory({
        id: category.id,
        label: category.category,
        tasks: category.tasks,
      });
    } else {
      setActiveCategory(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setTimeout(() => setActiveTask(null), 0);
      setTimeout(() => setActiveCategory(null), 0);
      return;
    }

    const activeCategoryIndex = memos.findIndex((cat) => cat.id === active.id);
    const overCategoryIndex = memos.findIndex((cat) => cat.id === over.id);
    if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
      const newMemos = arrayMove(memos, activeCategoryIndex, overCategoryIndex);
      setMemos(newMemos);
      localStorage.setItem("memos", JSON.stringify(newMemos));
      setTimeout(() => setActiveTask(null), 0);
      return;
    }

    const fromCategoryIndex = memos.findIndex((cat) =>
      cat.tasks.some((task) => task.id === active.id)
    );
    if (fromCategoryIndex === -1) {
      setTimeout(() => setActiveTask(null), 0);
      return;
    }

    let toCategoryIndex = memos.findIndex((cat) =>
      cat.tasks.some((task) => task.id === over.id)
    );
    let overIndex = -1;

    if (toCategoryIndex !== -1) {
      overIndex = memos[toCategoryIndex].tasks.findIndex((t) => t.id === over.id);
    } else {
      toCategoryIndex = memos.findIndex((cat) => cat.id === over.id);
      overIndex = memos[toCategoryIndex]?.tasks.length ?? -1;
      if (toCategoryIndex === -1) {
        setTimeout(() => setActiveTask(null), 0);
        return;
      }
    }

    if (fromCategoryIndex === toCategoryIndex) {
      const oldIndex = memos[fromCategoryIndex].tasks.findIndex((t) => t.id === active.id);
      const newIndex = overIndex;
      const newMemos = [...memos];
      newMemos[fromCategoryIndex] = {
        ...newMemos[fromCategoryIndex],
        tasks: arrayMove(memos[fromCategoryIndex].tasks, oldIndex, newIndex),
      };
      setMemos(newMemos);
      localStorage.setItem("memos", JSON.stringify(newMemos));
      setTimeout(() => setActiveTask(null), 0);
      return;
    }

    const task = memos[fromCategoryIndex].tasks.find((task) => task.id === active.id);
    if (!task) {
      setActiveTask(null);
      return;
    }
    const newFromTasks = memos[fromCategoryIndex].tasks.filter((t) => t.id !== active.id);
    const newToTasks = [
      ...memos[toCategoryIndex].tasks.slice(0, overIndex),
      task,
      ...memos[toCategoryIndex].tasks.slice(overIndex),
    ];

    const newMemos = memos.map((cat, idx) => {
      if (idx === fromCategoryIndex) {
        return { ...cat, tasks: newFromTasks };
      }
      if (idx === toCategoryIndex) {
        return { ...cat, tasks: newToTasks };
      }
      return cat;
    });

    setMemos(newMemos);
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setActiveCategory(null);
  };

  // カテゴリごとのタスクinput表示状態
  const [showTaskInput, setShowTaskInput] = useState({});
  const toggleTaskInput = (categoryIndex) => {
    setShowTaskInput((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }));
  };

  // カラートグル（ローカル保存付き）
  const [isAltColor, setIsAltColor] = useState(() => {
    const saved = localStorage.getItem("isAltColor");
    return saved ? JSON.parse(saved) : false;
  });
  useEffect(() => {
    localStorage.setItem("isAltColor", JSON.stringify(isAltColor));
  }, [isAltColor]);

  return {
    text,
    setText,
    taskInputs,
    setTaskInputs,
    memos,
    setMemos,
    addCategory,
    addTaskToCategory,
    toogleTaskDone,
    deleteTask,
    deleteMemo,
    showTaskInput,
    setShowTaskInput,
    toggleTaskInput,
    isAltColor,
    setIsAltColor,
    activeTask,
    setActiveTask,
    activeCategory,
    setActiveCategory,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    collapsedCategories,
    setCollapsedCategories,
    toggleCategoryCollapse,
    showSidebar,
    setShowSidebar,
    isMobile,
    setIsMobile,
    mobileCategoryIndex,
    setMobileCategoryIndex,
    getOpenCategoryIndexes,
    handlePrevCategory,
    handleNextCategory,
  };
}