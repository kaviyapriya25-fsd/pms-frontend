import { useEffect, useState } from "react";
import "../../styles/taskform.css";

function TaskForm({ onSave, selectedTask, onCancel }) {

  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    assignedBy: "",
    projectId: "",
    status: "Pending",
  });

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(task);

    setTask({
      title: "",
      description: "",
      assignedTo: "",
      assignedBy: "",
      projectId: "",
      status: "Pending",
    });

  };

  return (

    <div className="task-form-container">

      <h2>

        {selectedTask ? "Edit Task" : "Add Task"}

      </h2>

      <form
        className="task-form"
        onSubmit={handleSubmit}
      >

        <input
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          required
        />

        <input
          name="assignedTo"
          placeholder="Assigned To"
          value={task.assignedTo}
          onChange={handleChange}
          required
        />

        <input
          name="assignedBy"
          placeholder="Assigned By"
          value={task.assignedBy}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="projectId"
          placeholder="Project ID"
          value={task.projectId}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={task.status}
          onChange={handleChange}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <div className="form-buttons">

          <button type="submit">

            {selectedTask ? "Update" : "Save"}

          </button>

          {selectedTask && (

            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

          )}

        </div>

      </form>

    </div>

  );

}

export default TaskForm;