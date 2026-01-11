import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useTaskManagement(categories, setCategories) {
  const [taskInputs, setTaskInputs] = useState([]);
  const [isTaskInputVisible, setIsTaskInputVisible] = useState({});

  const sortTasks = (tasks) => tasks.slice().sort((a, b) => a.done - b.done);

  const addTaskToCategory = (catIdx, task) => {
    if (!task) return;
    setCategories((prev) => {
      const newCategories = [...prev];
      const tasks = [...newCategories[catIdx].tasks, { id: uuidv4(), text: task, done: false }];
      newCategories[catIdx].tasks = sortTasks(tasks);
      return newCategories;
    });
    const newInputs = [...taskInputs];
    newInputs[catIdx] = "";
    setTaskInputs(newInputs);
  };

  const toggleTaskDone = (catIdx, taskId) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const tasks = newCategories[catIdx].tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      newCategories[catIdx].tasks = sortTasks(tasks);
      return newCategories;
    });
  };

  const deleteTask = (catIdx, taskId) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const tasks = newCategories[catIdx].tasks.filter((task) => task.id !== taskId);
      newCategories[catIdx].tasks = sortTasks(tasks);
      return newCategories;
    });
  };

  const handleToggleTaskInput = (categoryIndex) => {
    setIsTaskInputVisible((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }));
  };

  const handleTaskInputChange = (currentIdx, value) => {
    setTaskInputs((prev) => {
      const newInputs = [...prev];
      newInputs[currentIdx] = value;
      return newInputs;
    });
  };

  const handleTaskKeyDown = (currentIdx, e) => {
    if (e.key === "Enter" && !e.isComposing) {
      addTaskToCategory(currentIdx, taskInputs[currentIdx]);
    }
  };

  const handleTaskAddClick = (currentIdx) => {
    addTaskToCategory(currentIdx, taskInputs[currentIdx]);
  };

  return {
    taskInputs,
    setTaskInputs,
    isTaskInputVisible,
    handleToggleTaskInput,
    addTaskToCategory,
    toggleTaskDone,
    deleteTask,
    handleTaskInputChange,
    handleTaskKeyDown,
    handleTaskAddClick,
  };
}
