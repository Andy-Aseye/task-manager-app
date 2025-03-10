import { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { FilterContext } from "../contexts/FilterContext";
import TaskItem from "./TaskItem";
import { ClipboardList } from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskInt } from "../interface";

const TaskList = () => {
  const taskContext = useContext(TaskContext);
  const filterContext = useContext(FilterContext);

  if (!taskContext)
    throw new Error("TaskList must be used within a TaskProvider");
  if (!filterContext)
    throw new Error("TaskList must be used within a FilterProvider");

  const { tasks, reorderTasks } = taskContext;
  const { priority } = filterContext;

  // Apply filtering
  const filteredTasks =
    priority === "All"
      ? tasks
      : tasks.filter((task) => task.priority === priority);

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);

    if (oldIndex !== newIndex) {
      reorderTasks(oldIndex, newIndex);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <div className="task_list_container">
      {filteredTasks.length === 0 ? (
        <div className="empty_list">
          <ClipboardList size={48} className="empty_list_icon" />
          <p>No tasks found</p>
          <p>Add a new task to get started</p>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={filteredTasks}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {filteredTasks.map((task) => (
                <SortableTaskItem key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

// Wrapping TaskItem with Sortable Logic
const SortableTaskItem = ({ task }: { task: TaskInt }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "dragging" : ""}
    >
      <TaskItem task={task} />
    </div>
  );
};

export default TaskList;
