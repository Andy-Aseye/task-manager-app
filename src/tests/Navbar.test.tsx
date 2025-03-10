import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { FilterContext } from "../contexts/FilterContext";
import { TaskContext } from "../contexts/TaskContext";

// Mock UUID generation
jest.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

// Mock Lucide Icons
jest.mock("lucide-react", () => ({
  Plus: () => <div data-testid="plus-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

describe("Navbar Component", () => {
  const mockSetPriority = jest.fn();
  const mockAddTask = jest.fn();

  const renderNavbar = () => {
    return render(
      <FilterContext.Provider
        value={{ priority: "All", setPriority: mockSetPriority }}
      >
        <TaskContext.Provider
          value={{
            tasks: [],
            addTask: mockAddTask,
            deleteTask: jest.fn(),
            updateTask: jest.fn(),
            reorderTasks: jest.fn(),
          }}
        >
          <Navbar />
        </TaskContext.Provider>
      </FilterContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the priority filter and add task button", () => {
    renderNavbar();

    expect(screen.getByText("Filter by priority:")).not.toBeNull();
    expect(screen.getByRole("combobox")).not.toBeNull();
    expect(screen.getByText("Add Task")).not.toBeNull();
  });

  it("updates priority when a new option is selected", () => {
    renderNavbar();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Medium" } });

    expect(mockSetPriority).toHaveBeenCalledWith("Medium");
  });

  it("opens and closes the add task modal", () => {
    renderNavbar();

    // Modal should be closed initially
    expect(screen.queryByText("Add New Task")).toBeNull();

    // Click the add task button
    fireEvent.click(screen.getByText("Add Task"));

    // Modal should be open now
    expect(screen.getByText("Add New Task")).not.toBeNull();

    // Click the close button
    fireEvent.click(screen.getByTestId("x-icon"));

    // Modal should be closed again
    expect(screen.queryByText("Add New Task")).toBeNull();
  });

  it("adds a new task when form is submitted", () => {
    renderNavbar();

    fireEvent.click(screen.getByText("Add Task"));

    const titleInput = screen.getByPlaceholderText("Enter task title");
    const descriptionInput = screen.getByPlaceholderText(
      "Enter task description"
    );
    const prioritySelect = screen.getByRole("combobox");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, { target: { value: "Task details" } });
    fireEvent.change(prioritySelect, { target: { value: "High" } });

    fireEvent.click(screen.getByText("Add Task"));

    expect(mockAddTask).toHaveBeenCalledWith({
      id: "mocked-uuid",
      title: "New Task",
      description: "Task details",
      priority: "High",
    });
  });

  it("does not add a task if title or description is empty", () => {
    global.alert = jest.fn();
    renderNavbar();

    fireEvent.click(screen.getByText("Add Task"));

    const titleInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(titleInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("Add Task"));

    expect(mockAddTask).not.toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith(
      "Please enter both a title and description."
    );
  });

  it("throws an error if not within FilterContext or TaskContext", () => {
    const originalError = console.error;
    console.error = jest.fn(); // Suppress React context error logs

    expect(() => {
      render(<Navbar />);
    }).toThrow("Navbar must be used within FilterProvider and TaskProvider");

    console.error = originalError; // Restore console.error
  });
});
