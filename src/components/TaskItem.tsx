import React, { useContext, useState } from 'react'
import { TaskProps } from '../interface';
import { TaskContext } from '../contexts/TaskContext';
import { Pencil, Trash, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const taskContext = useContext(TaskContext);
  if (!taskContext)
    throw new Error("TaskItem must be used within a TaskProvider");

  const { deleteTask, updateTask } = taskContext;

  const handleSave = () => {
    updateTask(editedTask);
    setIsOpen(false);
  };

  // Get priority indicator class
  const getPriorityClass = () => {
    switch (task.priority) {
      case "Low":
        return "priority_low";
      case "Medium":
        return "priority_medium";
      case "High":
        return "priority_high";
      default:
        return "";
    }
  };

  return (
    <div className="task_item">
      <div className="task-item-inner">
        <div className="task_content">
          <h3 className="task_title">{task.title}</h3>
          <p className="task_description">{task.description}</p>
          <span className={`priority_indicator ${getPriorityClass()}`}>
            
            {task.priority}
          </span>
        </div>
        <div className="task_actions">
          <button
            onClick={() => setIsOpen(true)}
            className="task_action_button"
          >
            <Pencil className="w-5 h-5 text-blue-500" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="task_action_button"
          >
            <Trash className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Modal for Editing Task */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger />
        <DialogContent className="dialog_content">
          <div className="dialog_header">
            <DialogTitle className="dialog_title">Edit Task</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="close_button">
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form>
            <div className="form_group">
              <label className="form_label">Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="form_input"
              />
            </div>

            <div className="form_group">
              <label className="form_label">Description</label>
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                className="form_textarea"
              />
            </div>

            <div className="form_group">
              <label className="form_label">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    priority: e.target.value as "Low" | "Medium" | "High",
                  })
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
                onClick={() => deleteTask(task.id)}
                className="btn btn_danger"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn btn_primary"
              >
                Save
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskItem