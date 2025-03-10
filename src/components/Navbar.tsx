import { useContext, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { v4 as uuidv4 } from "uuid";
import { FilterContext } from "../contexts/FilterContext";
import { TaskContext } from "../contexts/TaskContext";

const Navbar = () => {
  const filterContext = useContext(FilterContext);
  const taskContext = useContext(TaskContext);

  if (!filterContext || !taskContext) {
    throw new Error(
      "Navbar must be used within FilterProvider and TaskProvider"
    );
  }

  const { priority, setPriority } = filterContext;
  const { addTask } = taskContext;

  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  const handleAddTask = () => {
    if (newTask.title.trim() === "" || newTask.description.trim() === "") {
      alert("Please enter both a title and description.");
      return;
    }

    addTask({ id: uuidv4(), ...newTask });
    setNewTask({ title: "", description: "", priority: "Low" });
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="filter_group">
        <span className="filter_label">Filter by priority:</span>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority_filter"
        >
          <option value="All">All Tasks</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
      </div>

      <button onClick={() => setIsOpen(true)} className="add-task-button">
        <Plus className="w-5 h-5 mr-2" />
        Add Task
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger />
        <DialogContent className="dialog_content">
          <div className="dialog_header">
            <DialogTitle className="dialog_title">Add New Task</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="close_button">
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form>
            <div className="form_group">
              <label className="form_label">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="form_input"
                placeholder="Enter task title"
              />
            </div>

            <div className="form_group">
              <label className="form_label">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="form_textarea"
                placeholder="Enter task description"
              />
            </div>

            <div className="form_group">
              <label className="form_label">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="form_select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form_footer">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTask}
                className="btn btn_primary"
              >
                Add Task
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
