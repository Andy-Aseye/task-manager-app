import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../components/TaskItem";
import { TaskContext } from "../contexts/TaskContext";

// Mock the Dialog component from @radix-ui/react-dialog
jest.mock("@radix-ui/react-dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (
    <div data-testid="mock-dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
}));

// Mock the Lucide React icons
jest.mock("lucide-react", () => ({
  Pencil: () => <div data-testid="pencil-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

describe("TaskItem Component", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "Task description",
    priority: "Medium" as "Low" | "Medium" | "High",
  };

  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();

  const renderTaskItem = () => {
    return render(
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task title and description correctly", () => {
    renderTaskItem();
    expect(screen.getByText("Test Task")).not.toBeNull();
    expect(screen.getByText("Task description")).not.toBeNull();
  });

  it("displays the correct priority indicator class for different priorities", () => {
    const testPriorities = ["Low", "Medium", "High"] as const;

    testPriorities.forEach((priority) => {
      const taskWithPriority = { ...mockTask, priority };
      render(
        <TaskContext.Provider
          value={{
            tasks: [taskWithPriority],
            addTask: jest.fn(),
            deleteTask: mockDeleteTask,
            updateTask: mockUpdateTask,
            reorderTasks: jest.fn(),
          }}
        >
          <TaskItem task={taskWithPriority} />
        </TaskContext.Provider>
      );

      const priorityIndicator = document.querySelector(".priority_indicator");
      expect(priorityIndicator).not.toBeNull();
      expect(priorityIndicator?.textContent).toBe(priority);
    });
  });

  it("calls deleteTask when delete button is clicked", () => {
    renderTaskItem();
    const deleteButton = screen.getByTestId("trash-icon").closest("button");
    expect(deleteButton).not.toBeNull();
    fireEvent.click(deleteButton!);
    expect(mockDeleteTask).toHaveBeenCalledWith("1");
  });

  it("toggles the edit dialog when edit button is clicked", () => {
    const { container } = renderTaskItem();
    const editButton = screen.getByTestId("pencil-icon").closest("button");

    expect(editButton).not.toBeNull();
    expect(container.querySelector('[data-open="true"]')).toBeNull();

    fireEvent.click(editButton!);

    expect(
      container.querySelector('[data-testid="mock-dialog"]')
    ).not.toBeNull();
    expect(container.querySelector('[data-open="true"]')).not.toBeNull();
  });

  it("calls updateTask with edited values when save button is clicked", () => {
    renderTaskItem();
    const editButton = screen.getByTestId("pencil-icon").closest("button");
    expect(editButton).not.toBeNull();
    fireEvent.click(editButton!);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      "Priority"
    ) as HTMLSelectElement;
    const saveButton = screen.getByText("Save");

    expect(titleInput).not.toBeNull();
    expect(descriptionInput).not.toBeNull();
    expect(prioritySelect).not.toBeNull();
    expect(saveButton).not.toBeNull();

    userEvent.clear(titleInput);
    userEvent.type(titleInput, "Updated Title");
    userEvent.clear(descriptionInput);
    userEvent.type(descriptionInput, "Updated Description");
    userEvent.selectOptions(prioritySelect, "High");

    fireEvent.click(saveButton);

    expect(mockUpdateTask).toHaveBeenCalledWith({
      id: "1",
      title: "Updated Title",
      description: "Updated Description",
      priority: "High",
    });
  });

  it("throws an error if not within TaskContext", () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TaskItem task={mockTask} />);
    }).toThrow("TaskItem must be used within a TaskProvider");

    console.error = originalError;
  });
});
