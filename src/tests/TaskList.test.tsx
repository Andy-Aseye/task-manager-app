import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskContext } from "../contexts/TaskContext";
import { FilterContext } from "../contexts/FilterContext";
import TaskList from "../components/TaskList";
import { DndContext } from "@dnd-kit/core";

// Mock TaskItem component
jest.mock("../components/TaskItem", () => ({
  __esModule: true,
  default: ({ task }: { task: { title: string } }) => (
    <div data-testid="task-item">{task.title}</div>
  ),
}));

// Mock Lucide Icons
jest.mock("lucide-react", () => ({
  ClipboardList: () => <div data-testid="clipboard-icon" />,
}));

describe("TaskList Component", () => {
  const mockReorderTasks = jest.fn();

  const tasks: any = [
    { id: "1", title: "Task One", priority: "High" },
    { id: "2", title: "Task Two", priority: "Medium" },
    { id: "3", title: "Task Three", priority: "Low" },
  ];

  const renderTaskList = (priority = "All") => {
    return render(
      <TaskContext.Provider value={{ tasks, reorderTasks: mockReorderTasks }}>
        <FilterContext.Provider value={{ priority, setPriority: jest.fn() }}>
          <TaskList />
        </FilterContext.Provider>
      </TaskContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders tasks correctly", () => {
    renderTaskList();

    expect(screen.getByText("Task One")).not.toBeNull();
    expect(screen.getByText("Task Two")).not.toBeNull();
    expect(screen.getByText("Task Three")).not.toBeNull();
  });

  it("filters tasks by priority", () => {
    renderTaskList("High");

    expect(screen.getByText("Task One")).not.toBeNull();
    expect(screen.queryByText("Task Two")).toBeNull();
    expect(screen.queryByText("Task Three")).toBeNull();
  });

  it("shows empty state when no tasks match filter", () => {
    renderTaskList("Urgent");

    expect(screen.getByText("No tasks found")).not.toBeNull();
    expect(screen.getByText("Add a new task to get started")).not.toBeNull();
    expect(screen.getByTestId("clipboard-icon")).not.toBeNull();
  });

  it("handles drag-and-drop reordering", () => {
    renderTaskList();

    // Simulate drag end event
    fireEvent.dragEnd(screen.getByText("Task One"), {
      active: { id: "1" },
      over: { id: "3" },
    });

    expect(mockReorderTasks).toHaveBeenCalledWith(0, 2);
  });

  it("throws an error if used outside required providers", () => {
    const originalError = console.error;
    console.error = jest.fn(); // Suppress React context error logs

    expect(() => {
      render(<TaskList />);
    }).toThrow("TaskList must be used within a TaskProvider");

    console.error = originalError; // Restore console.error
  });
});
