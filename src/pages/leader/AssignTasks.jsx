import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LeaderLayout from "../../components/layout/LeaderLayout";
import SearchBar from "../../components/common/SearchBar";
import KanbanBoard from "../../components/agile/KanbanBoard";
import TaskDetailModal from "../../components/agile/TaskDetailModal";
import { getTasks, addTask, updateTask, deleteTask } from "../../services/taskService";
import { getEmployees } from "../../services/employeeService";
import { getTeamLeaders } from "../../services/teamLeaderService";
import { FaPlus, FaTasks, FaEdit, FaTrash, FaCheckCircle, FaSpinner, FaClipboardList, FaThLarge, FaTable } from "react-icons/fa";

function AssignTasks() {
  const leaderEmail = localStorage.getItem("email") || "";
  const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "";

  const [tasks, setTasks] = useState([]);
  const [teamEmployees, setTeamEmployees] = useState([]);
  const [assignedProject, setAssignedProject] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [viewMode, setViewMode] = useState("KANBAN"); // "KANBAN" | "TABLE"

  const [form, setForm] = useState({
    taskName: "",
    description: "",
    employee: "",
    priority: "MEDIUM",
    status: "TODO",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  });

  useEffect(() => {
    loadLeaderData();
  }, []);

  const loadLeaderData = async () => {
    try {
      // 1. Fetch team leader's project
      const leaders = await getTeamLeaders();
      const me = leaders.find((l) => l.email === leaderEmail || l.name === leaderName);
      if (me && me.project) {
        setAssignedProject(me.project);
      }

      // 2. Fetch employees under this team leader
      const allEmployees = await getEmployees();
      const myTeam = allEmployees.filter(
        (e) => e.teamLeader === leaderName || e.teamLeader === leaderEmail
      );
      setTeamEmployees(myTeam);

      // 3. Fetch tasks created by / assigned to this team leader
      const allTasks = await getTasks();
      const leaderTasks = allTasks.filter(
        (t) => t.teamLeader === leaderName || t.teamLeader === leaderEmail || (me && me.project && t.project === me.project)
      );
      setTasks(leaderTasks);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load task management data");
    }
  };

  const handleOpenAdd = () => {
    setSelectedTask(null);
    setForm({
      taskName: "",
      description: "",
      employee: teamEmployees.length > 0 ? teamEmployees[0].name : "",
      priority: "MEDIUM",
      status: "TODO",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: "",
    });
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setForm({
      taskName: task.taskName || "",
      description: task.description || "",
      employee: task.employee || "",
      priority: task.priority || "MEDIUM",
      status: task.status || "TODO",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.taskName.trim()) {
      toast.error("Task Name is required");
      return;
    }
    if (!form.employee) {
      toast.error("Please assign an employee from your team");
      return;
    }

    const payload = {
      ...form,
      project: assignedProject || "General",
      teamLeader: leaderName,
    };

    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, payload);
        toast.success("Task Updated Successfully");
      } else {
        await addTask(payload);
        toast.success("Task Created & Assigned Successfully");
      }

      setShowForm(false);
      loadLeaderData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Task Operation Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      toast.success("Task Deleted");
      loadLeaderData();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const keyword = search.toLowerCase();
    return (
      !search ||
      task.taskName?.toLowerCase().includes(keyword) ||
      task.description?.toLowerCase().includes(keyword) ||
      task.employee?.toLowerCase().includes(keyword) ||
      task.priority?.toLowerCase().includes(keyword) ||
      task.status?.toLowerCase().includes(keyword)
    );
  });

  return (
    <LeaderLayout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Create & Assign Tasks
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
              Project: <strong>{assignedProject || "No Project Assigned Yet"}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* View Toggle */}
            <div style={{ display: "flex", background: "#e2e8f0", padding: "3px", borderRadius: "8px" }}>
              <button
                onClick={() => setViewMode("KANBAN")}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  background: viewMode === "KANBAN" ? "#4f46e5" : "transparent",
                  color: viewMode === "KANBAN" ? "#ffffff" : "#475569",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaThLarge /> Kanban Board
              </button>
              <button
                onClick={() => setViewMode("TABLE")}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  background: viewMode === "TABLE" ? "#4f46e5" : "transparent",
                  color: viewMode === "TABLE" ? "#ffffff" : "#475569",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaTable /> Table View
              </button>
            </div>

            <button
              onClick={handleOpenAdd}
              style={{ background: "#4f46e5", color: "#fff", padding: "12px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaPlus /> Create New Task
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <SearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            onSearch={() => {}}
            onClear={() => setSearch("")}
            placeholder="Search team tasks by title, assigned employee, priority, or status..."
          />
        </div>

        {/* Task Form Modal / Box */}
        {showForm && (
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "28px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 18px 0", color: "#1e1b4b" }}>
              {selectedTask ? "Edit Task" : "Create New Task for Your Team"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Develop User Profile Component"
                  value={form.taskName}
                  onChange={(e) => setForm({ ...form, taskName: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                  required
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Task Description</label>
                <textarea
                  placeholder="Provide task requirements and instructions..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Assign to Team Member *</label>
                <select
                  value={form.employee}
                  onChange={(e) => setForm({ ...form, employee: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                  required
                >
                  <option value="">-- Select Team Member --</option>
                  {teamEmployees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
                {teamEmployees.length === 0 && (
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>No employees assigned under your team yet.</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  style={{ background: "#4f46e5", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}
                >
                  {selectedTask ? "Save Task Changes" : "Assign Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ background: "#e2e8f0", color: "#334155", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Conditional View: KANBAN vs TABLE */}
        {viewMode === "KANBAN" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdated={loadLeaderData}
            onSelectTask={(task) => setActiveTaskModal(task)}
            role="leader"
          />
        ) : (
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Task ID</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Task Name</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Assigned Employee</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Priority</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Due Date</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Status</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Deliverable</th>
                  <th style={{ padding: "14px 18px", fontSize: "13px", color: "#475569" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }} onClick={() => setActiveTaskModal(task)}>
                      <td style={{ padding: "14px 18px", fontSize: "14px", color: "#64748b" }}>#{task.id}</td>
                      <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{task.taskName}</td>
                      <td style={{ padding: "14px 18px", fontSize: "14px", color: "#334155" }}>
                        <span style={{ background: "#f0f9ff", color: "#0369a1", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                          {task.employee || "Unassigned"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700",
                          background: task.priority === "URGENT" || task.priority === "HIGH" ? "#fef2f2" : "#f0fdf4",
                          color: task.priority === "URGENT" || task.priority === "HIGH" ? "#dc2626" : "#16a34a"
                        }}>
                          {task.priority || "MEDIUM"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "#64748b" }}>{task.dueDate || "N/A"}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                          background:
                            task.status === "COMPLETED" ? "#dcfce7" :
                            task.status === "REVIEW" ? "#f3e8ff" :
                            task.status === "BLOCKED" ? "#fee2e2" :
                            task.status === "IN_TESTING" ? "#cff4fc" :
                            task.status === "IN_PROGRESS" ? "#e0f2fe" : "#fef3c7",
                          color:
                            task.status === "COMPLETED" ? "#15803d" :
                            task.status === "REVIEW" ? "#6b21a8" :
                            task.status === "BLOCKED" ? "#991b1b" :
                            task.status === "IN_TESTING" ? "#0891b2" :
                            task.status === "IN_PROGRESS" ? "#0369a1" : "#b45309"
                        }}>
                          {task.status ? task.status.replace("_", " ") : "TODO"}
                        </span>
                      </td>

                      {/* Deliverable submitted by employee */}
                      <td style={{ padding: "14px 18px", maxWidth: "200px" }}>
                        {task.workSubmission ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block", width: "fit-content" }}>
                              ✓ Submitted
                            </span>
                            {task.workSubmission.startsWith("http") ? (
                              <a
                                href={task.workSubmission}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: "12px", color: "#2563eb", textDecoration: "underline" }}
                              >
                                🔗 Open Link
                              </a>
                            ) : (
                              <span
                                title={task.workSubmission}
                                style={{ fontSize: "11px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "block" }}
                              >
                                {task.workSubmission}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not submitted yet</span>
                        )}
                      </td>

                      <td style={{ padding: "14px 18px" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(task)}
                          style={{ background: "#e0e7ff", color: "#4338ca", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "6px" }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          style={{ background: "#fef2f2", color: "#dc2626", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "28px", color: "#94a3b8" }}>
                      No tasks created yet. Click "+ Create New Task" above to assign work to your team.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Task Worklog & Detail Modal */}
        {activeTaskModal && (
          <TaskDetailModal
            task={activeTaskModal}
            onClose={() => setActiveTaskModal(null)}
            onTaskUpdated={loadLeaderData}
            role="leader"
          />
        )}

      </div>
    </LeaderLayout>
  );
}

export default AssignTasks;
