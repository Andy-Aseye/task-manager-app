import { createContext, useState, useEffect, ReactNode } from "react";
import { TaskContextType, TaskInt } from "../interface";

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskInt[]>(() => {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: TaskInt) => setTasks((prev) => [...prev, task]);
  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));
  const updateTask = (updatedTask: TaskInt) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(startIndex, 1);
    reorderedTasks.splice(endIndex, 0, movedTask);
    setTasks(reorderedTasks);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, deleteTask, updateTask, reorderTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
