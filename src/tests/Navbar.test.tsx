import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../components/Navbar";
import { FilterContext } from "../contexts/FilterContext";
import { TaskContext } from "../contexts/TaskContext";

// Mock UUID generation
jest.mock("uuid", () => ({ v4: () => "mocked-uuid" }));

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

  it("renders navigation elements correctly", () => {
    renderNavbar();

   
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("updates priority filter when selection changes", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const filterSelect = screen.getByRole("combobox");
    await user.selectOptions(filterSelect, "Medium");

    expect(mockSetPriority).toHaveBeenCalledWith("Medium");
  });

  describe("Task Dialog", () => {
    it("opens and closes the dialog correctly", async () => {
      const user = userEvent.setup();
      renderNavbar();

      // Open dialog
      await user.click(screen.getByRole("button", { name: /add task/i }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Close dialog
      await user.click(screen.getByTestId("x-icon"));
    });

    it("submits valid task form", async () => {
      const user = userEvent.setup();
      renderNavbar();

      await user.click(screen.getByRole("button", { name: /add task/i }));

      const dialog = screen.getByRole("dialog");
      await user.type(
        within(dialog).getByPlaceholderText("Enter task title"),
        "New Task"
      );
      await user.type(
        within(dialog).getByPlaceholderText("Enter task description"),
        "Task details"
      );
      await user.selectOptions(within(dialog).getByRole("combobox"), "High");

      await user.click(
        within(dialog).getByRole("button", { name: /add task/i })
      );

      expect(mockAddTask).toHaveBeenCalledWith({
        id: "mocked-uuid",
        title: "New Task",
        description: "Task details",
        priority: "High",
      });
    });

    it("shows validation errors for empty fields", async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();
      renderNavbar();

      await user.click(screen.getByRole("button", { name: /add task/i }))
      const dialog = screen.getByRole("dialog");

      // Test empty title
      await user.type(
        within(dialog).getByPlaceholderText("Enter task description"),
        "Description"
      );
      await user.click(
        within(dialog).getByRole("button", { name: /add task/i })
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter both a title and description."
      );

      // Test empty description
      await user.clear(
        within(dialog).getByPlaceholderText("Enter task description")
      );
      await user.type(
        within(dialog).getByPlaceholderText("Enter task title"),
        "Title"
      );
      await user.click(
        within(dialog).getByRole("button", { name: /add task/i })
      );
      expect(window.alert).toHaveBeenCalledTimes(2);
    });
  });

  it("throws error when used outside context providers", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<Navbar />)).toThrow(
      "Navbar must be used within FilterProvider and TaskProvider"
    );

    consoleError.mockRestore();
  });
});
