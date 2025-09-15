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

  const addTaskToCategory = (catIdx, task) => {
    if (!task) return;
    setMemos(memos =>
      memos.map((memo, i) =>
        i === catIdx
          ? { ...memo, tasks: [...memo.tasks, { id: uuidv4(), text: task, done: false }] }
          : memo
      )
    );
    const newInputs = [...taskInputs];
    newInputs[catIdx] = "";
    setTaskInputs(newInputs);
  };

  const toogleTaskDone = (catIdx, taskId) => {
    setMemos(memos =>
      memos.map((memo, i) =>
        i === catIdx
          ? {
              ...memo,
              tasks: memo.tasks.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task
              ),
            }
          : memo
      )
    );
  };

  const deleteTask = (catIdx, taskId) => {
    setMemos(memos =>
      memos.map((memo, i) =>
        i === catIdx
          ? { ...memo, tasks: memo.tasks.filter((task) => task.id !== taskId) }
          : memo
      )
    );
  };

  const deleteMemo = (catIdx) => {
    setMemos(memos => memos.filter((_, i) => i !== catIdx));
    setTaskInputs(inputs => inputs.filter((_, i) => i !== catIdx));
  };

  // DnD Kit用
  const handleDragStart = (event) => {
    const { active } = event;
    const task = memos
      .flatMap(cat => cat.tasks)
      .find(task => task.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setTimeout(() => setActiveTask(null), 0);
      return;
    }

    const activeCategoryIndex = memos.findIndex(cat => cat.id === active.id);
    const overCategoryIndex = memos.findIndex(cat => cat.id === over.id);
    if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
      const newMemos = arrayMove(memos, activeCategoryIndex, overCategoryIndex);
      setMemos(newMemos);
      localStorage.setItem("memos", JSON.stringify(newMemos));
      setTimeout(() => setActiveTask(null), 0);
      return;
    }

    const fromCategoryIndex = memos.findIndex(cat =>
      cat.tasks.some(task => task.id === active.id)
    );
    if (fromCategoryIndex === -1) {
      setTimeout(() => setActiveTask(null), 0);
      return;
    }

    let toCategoryIndex = memos.findIndex(cat =>
      cat.tasks.some(task => task.id === over.id)
    );
    let overIndex = -1;

    if (toCategoryIndex !== -1) {
      overIndex = memos[toCategoryIndex].tasks.findIndex(t => t.id === over.id);
    } else {
      toCategoryIndex = memos.findIndex(cat => cat.id === over.id);
      overIndex = memos[toCategoryIndex]?.tasks.length ?? -1;
      if (toCategoryIndex === -1) {
        setTimeout(() => setActiveTask(null), 0);
        return;
      }
    }

    if (fromCategoryIndex === toCategoryIndex) {
      const oldIndex = memos[fromCategoryIndex].tasks.findIndex(t => t.id === active.id);
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

    const task = memos[fromCategoryIndex].tasks.find(task => task.id === active.id);
    if (!task) {
      setActiveTask(null);
      return;
    }
    const newFromTasks = memos[fromCategoryIndex].tasks.filter(t => t.id !== active.id);
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

  const handleDragCancel = () => setActiveTask(null);

  // カテゴリごとのタスクinput表示状態
  const [showTaskInput, setShowTaskInput] = useState({});
  const toggleTaskInput = (categoryIndex) => {
    setShowTaskInput((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }));
  };

  // カテゴリ追加input表示状態
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // カラートグル（ローカル保存付き）
  const [isAltColor, setIsAltColor] = useState(() => {
    const saved = localStorage.getItem("isAltColor");
    return saved ? JSON.parse(saved) : false;
  });
  useEffect(() => {
    localStorage.setItem("isAltColor", JSON.stringify(isAltColor));
  }, [isAltColor]);

  return {
    text, setText,
    taskInputs, setTaskInputs,
    memos, setMemos,
    addCategory,
    addTaskToCategory,
    toogleTaskDone,
    deleteTask,
    deleteMemo,
    showTaskInput,
    setShowTaskInput,
    toggleTaskInput,
    showCategoryInput,
    setShowCategoryInput,
    isAltColor,
    setIsAltColor,
    activeTask,
    setActiveTask,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}