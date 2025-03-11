import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../components/TaskItem";
import { TaskContext } from "../contexts/TaskContext";
import "@testing-library/jest-dom";


// Mock icons and dialog as before
jest.mock("lucide-react", () => ({
  Pencil: () => <div data-testid="pencil-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

// Update Dialog mock in TaskItem.test.tsx
jest.mock("@radix-ui/react-dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => children,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => children,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div role="dialog">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));
describe("TaskItem Component", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "Task description",
    priority: "Medium" as const,
  };

  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();

  const renderComponent = () =>
    render(
      <TaskContext.Provider
        value={{
          tasks: [mockTask],
          addTask: jest.fn(),
          deleteTask: mockDeleteTask,
          updateTask: mockUpdateTask,
          reorderTasks: jest.fn(),
        }}
      >
        <TaskItem task={mockTask} />
      </TaskContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task content correctly", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: mockTask.title })
    ).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText(mockTask.priority)).toBeInTheDocument();
  });

  it.each(["Low", "Medium", "High"])(
    "applies correct priority class for %s priority",
    (priority) => {
      const testTask = {
        ...mockTask,
        priority: priority as typeof mockTask.priority,
      };

      const { container } = render(
        <TaskContext.Provider
          value={{
            tasks: [testTask],
            addTask: jest.fn(),
            deleteTask: mockDeleteTask,
            updateTask: mockUpdateTask,
            reorderTasks: jest.fn(),
          }}
        >
          <TaskItem task={testTask} />
        </TaskContext.Provider>
      );

      const indicator = container.querySelector(
        `.priority_${priority.toLowerCase()}`
      );
      expect(indicator).toBeInTheDocument();
    }
  );

  describe("Task Actions", () => {
    it("deletes task when delete button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const deleteButton = screen.getByRole("button", { name: /delete task/i });
      await user.click(deleteButton);

      expect(mockDeleteTask).toHaveBeenCalledWith(mockTask.id);
    });

    it("opens edit dialog when edit button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const editButton = screen.getByRole("button", { name: /edit task/i });
      await user.click(editButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /edit task/i })
      ).toBeInTheDocument();
    });
  });

  describe("Edit Dialog", () => {
    const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
      renderComponent();
      await user.click(screen.getByRole("button", { name: /edit task/i }));
    };

    it("updates task when form is submitted", async () => {
      const user = userEvent.setup();
      await openDialog(user);

      const saveButton = screen.getByRole("button", { name: /save/i });

      await user.click(saveButton);

      expect(mockUpdateTask).toHaveBeenCalledWith({
        ...mockTask,
        title: "Updated Title",
        description: "Updated Description",
        priority: "High",
      });
    });

    it("closes dialog when cancel button is clicked", async () => {
      const user = userEvent.setup();
      await openDialog(user);

      const closeButton = screen.getByTestId("x-icon").closest("button");
      await user.click(closeButton!);

    });
  });

  it("throws error when used outside TaskContext", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TaskItem task={mockTask} />)).toThrow(
      "TaskItem must be used within a TaskProvider"
    );

    consoleError.mockRestore();
  });
});
