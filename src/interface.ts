export interface TaskProps {
    task: TaskInt;
}


export interface TaskInt {
    id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
}