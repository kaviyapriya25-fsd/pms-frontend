import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TaskForm from "../../components/forms/TaskForm";

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";

import "./task.css";

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const handleSave = async (task) => {

    try {

      if (selectedTask) {

        await updateTask(selectedTask.id, task);
        toast.success("Task Updated Successfully");

      } else {

        await addTask(task);
        toast.success("Task Added Successfully");

      }

      setSelectedTask(null);
      setShowForm(false);

      loadTasks();

    } catch {

      toast.error("Operation Failed");

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Task?")) return;

    try {

      await deleteTask(id);

      toast.success("Task Deleted");

      loadTasks();

    } catch {

      toast.error("Delete Failed");

    }

  };

  const filteredTasks = tasks.filter((task) => {

    const keyword = search.toLowerCase();

    return (
      task.title?.toLowerCase().includes(keyword) ||
      task.assignedTo?.toLowerCase().includes(keyword) ||
      task.assignedBy?.toLowerCase().includes(keyword)
    );

  });

  return (

    <DashboardLayout>

      <div className="tasks-page">

        <div className="tasks-header">

          <h1>Tasks</h1>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedTask(null);
              setShowForm(true);
            }}
          >
            + Add Task
          </button>

        </div>

        <div className="task-stats">

          <div className="stat-card">
            <h3>{tasks.length}</h3>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card active-card">
            <h3>{tasks.filter(t => t.status === "Pending").length}</h3>
            <p>Pending</p>
          </div>

          <div className="stat-card completed-card">
            <h3>{tasks.filter(t => t.status === "Completed").length}</h3>
            <p>Completed</p>
          </div>

          <div className="stat-card pending-card">
            <h3>{tasks.filter(t => t.status === "In Progress").length}</h3>
            <p>In Progress</p>
          </div>

        </div>

        <input
          className="search-box"
          placeholder="Search Task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showForm && (

          <TaskForm
            onSave={handleSave}
            selectedTask={selectedTask}
            onCancel={() => {
              setSelectedTask(null);
              setShowForm(false);
            }}
          />

        )}

        <table className="task-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Assigned By</th>
              <th>Project ID</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredTasks.length > 0 ? (

              filteredTasks.map((task) => (

                <tr key={task.id}>

                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.assignedBy}</td>
                  <td>{task.projectId}</td>

                  <td>
                    <span className={task.status.toLowerCase().replace(" ", "-")}>
                      {task.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Tasks Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}

export default Tasks;