export interface TaskProps {
    task: TaskInt;
}


export interface TaskInt {
    id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
}

export interface FilterContextType {
  priority: string;
  setPriority: (priority: string) => void;
}


export interface TaskContextType {
  tasks: TaskInt[];
  addTask: (task: TaskInt) => void;
  deleteTask: (id: string) => void;
  updateTask: (updatedTask: TaskInt) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}
