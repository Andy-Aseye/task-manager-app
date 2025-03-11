import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TaskContext } from "../contexts/TaskContext";
import { FilterContext } from "../contexts/FilterContext";
import TaskList from "../components/TaskList";
import { TaskInt } from "../interface";

// Mock TaskItem with proper typing
jest.mock("../components/TaskItem", () => ({
  __esModule: true,
  default: ({ task }: { task: { title: string } }) => (
    <div data-testid="task-item">{task.title}</div>
  ),
}));

jest.mock("lucide-react", () => ({
  ClipboardList: () => <div role="img" aria-label="clipboard-icon" />,
}));

// Mock dnd-kit components
// Update DnD mock in TaskList.test.tsx
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => children,
  useSensor: jest.fn(),
  useSensors: jest.fn().mockImplementation(() => ([jest.fn()])),
  closestCenter: jest.fn(),
}));

jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
  }),
}));

describe("TaskList Component", () => {
 const mockTasks: TaskInt[] = [
   {
     id: "1",
     title: "Task One",
     description: "Description One",
     priority: "High",
   },
   {
     id: "2",
     title: "Task Two",
     description: "Description Two",
     priority: "Medium",
   },
   {
     id: "3",
     title: "Task Three",
     description: "Description Three",
     priority: "Low",
   },
 ];

  const mockReorderTasks = jest.fn();

  const renderComponent = (priority = "All") =>
    render(
      <TaskContext.Provider
        value={{
          tasks: mockTasks,
          reorderTasks: mockReorderTasks,
          addTask: jest.fn(),
          deleteTask: jest.fn(),
          updateTask: jest.fn(),
        }}
      >
        <FilterContext.Provider value={{ priority, setPriority: jest.fn() }}>
          <TaskList />
        </FilterContext.Provider>
      </TaskContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tasks when no filter is applied", () => {
    renderComponent();

    const items = screen.getAllByTestId("task-item");
    expect(items).toHaveLength(3);
    expect(items.map((i) => i.textContent)).toEqual([
      "Task One",
      "Task Two",
      "Task Three",
    ]);
  });

  describe("Task Filtering", () => {
    it.each([
      ["High", 1],
      ["Medium", 1],
      ["Low", 1],
      ["All", 3],
    ])("filters tasks for %s priority", (priority, expectedCount) => {
      renderComponent(priority as string);

      const items = screen.queryAllByTestId("task-item");
      expect(items).toHaveLength(expectedCount);
    });

    it("shows empty state when no tasks match filter", () => {
      renderComponent("High");

    expect(screen.getByRole("img", { name: "No tasks" })).toBeInTheDocument();
      expect(screen.getByText("No tasks found")).toBeInTheDocument();
      expect(
        screen.getByText("Add a new task to get started")
      ).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    it("reorders tasks on successful drag", () => {
      renderComponent();

      const activeTask = screen.getByText("Task One");
      const overTask = screen.getByText("Task Three");

      fireEvent.dragStart(activeTask);
      fireEvent.dragOver(overTask);
      fireEvent.drop(overTask);
      fireEvent.dragEnd(activeTask, {
        active: { id: "1" },
        over: { id: "3" },
      });

      expect(mockReorderTasks).toHaveBeenCalledWith(0, 2);
    });

    it("does nothing when dragging over invalid target", () => {
      renderComponent();

      const activeTask = screen.getByText("Task One");
      fireEvent.dragEnd(activeTask, {
        active: { id: "1" },
        over: null,
      });

      expect(mockReorderTasks).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("throws error when missing TaskContext", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() =>
        render(
          <FilterContext.Provider
            value={{ priority: "All", setPriority: jest.fn() }}
          >
            <TaskList />
          </FilterContext.Provider>
        )
      ).toThrow("TaskList must be used within a TaskProvider");

      consoleError.mockRestore();
    });

    it("throws error when missing FilterContext", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TaskContext.Provider
            value={{
              tasks: [],
              reorderTasks: jest.fn(),
              addTask: jest.fn(),
              deleteTask: jest.fn(),
              updateTask: jest.fn(),
            }}
          >
            <TaskList />
          </TaskContext.Provider>
        )
      ).toThrow("TaskList must be used within a FilterProvider");

      consoleError.mockRestore();
    });
  });
});
