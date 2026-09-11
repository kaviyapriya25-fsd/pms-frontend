import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import KanbanBoard from "../../components/agile/KanbanBoard";
import TaskDetailModal from "../../components/agile/TaskDetailModal";
import { getTasks, deleteTask } from "../../services/taskService";
import { FaTasks, FaClock, FaSpinner, FaCheckCircle, FaSearch, FaFilter, FaTrash, FaChevronLeft, FaChevronRight, FaInfoCircle, FaThLarge, FaTable } from "react-icons/fa";

import "./project.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("KANBAN"); // "KANBAN" | "TABLE"
  const [selectedTask, setSelectedTask] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Tasks");
      setTasks([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Task?")) return;

    try {
      await deleteTask(id);
      toast.success("Task Deleted");
      loadTasks();
    } catch {
      toast.error("Delete Failed");
    }
  };

  // Filter Logic
  const filteredTasks = tasks.filter((task) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      task.taskName?.toLowerCase().includes(keyword) ||
      task.project?.toLowerCase().includes(keyword) ||
      task.employee?.toLowerCase().includes(keyword) ||
      task.teamLeader?.toLowerCase().includes(keyword) ||
      task.status?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <DashboardLayout>
      <div className="projects-page">

        {/* Header */}
        <div className="projects-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h1>Task Oversight & Monitoring</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Monitor task deliverables across your company's team leaders and employees.</p>
          </div>

          {/* View Toggle */}
          <div style={{ display: "flex", background: "#e2e8f0", padding: "3px", borderRadius: "8px" }}>
            <button
              onClick={() => setViewMode("KANBAN")}
              style={{
                padding: "8px 14px",
                border: "none",
                borderRadius: "6px",
                background: viewMode === "KANBAN" ? "#2563eb" : "transparent",
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
                background: viewMode === "TABLE" ? "#2563eb" : "transparent",
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
        </div>

        {/* Informational Banner */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 18px", borderRadius: "10px", color: "#1e40af", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <FaInfoCircle style={{ fontSize: "16px", color: "#2563eb" }} />
          <span>Note: Tasks are created and assigned directly by Team Leaders within their Leader Consoles. Admin monitors overall deliverables and completion status.</span>
        </div>

        {/* Stats */}
        <div className="project-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" }}>

          <div className="stat-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaTasks style={{ fontSize: "24px", color: "#2563eb" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{tasks.length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="stat-card active-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaClock style={{ fontSize: "24px", color: "#d97706" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{tasks.filter((t) => t.status === "TODO").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>To Do</p>
              </div>
            </div>
          </div>

          <div className="stat-card pending-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaSpinner style={{ fontSize: "24px", color: "#0284c7" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{tasks.filter((t) => t.status === "IN_PROGRESS").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>In Progress</p>
              </div>
            </div>
          </div>

          <div className="stat-card completed-card" style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaCheckCircle style={{ fontSize: "24px", color: "#16a34a" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "22px" }}>{tasks.filter((t) => t.status === "COMPLETED").length}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Completed</p>
              </div>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
          
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            onSearch={() => setCurrentPage(1)}
            onClear={() => setCurrentPage(1)}
            placeholder="Search by task title, project, team leader, or assigned employee..."
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "10px 16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <FaFilter style={{ color: "#6b7280", fontSize: "14px" }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}
            >
              <option value="ALL">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

        </div>

        {/* Conditional View: KANBAN vs TABLE */}
        {viewMode === "KANBAN" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdated={loadTasks}
            onSelectTask={(task) => setSelectedTask(task)}
            role="admin"
          />
        ) : (
          <>
            <div style={{ overflowX: "auto", width: "100%", borderRadius: "10px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <table className="project-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task Title</th>
                    <th>Project</th>
                    <th>Team Leader</th>
                    <th>Assigned Employee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Deliverable</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentTasks.length > 0 ? (
                    currentTasks.map((task) => (
                      <tr key={task.id} style={{ cursor: "pointer" }} onClick={() => setSelectedTask(task)}>
                        <td>{task.id}</td>
                        <td><strong>{task.taskName}</strong></td>
                        <td>
                          <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                            {task.project || "General"}
                          </span>
                        </td>
                        <td>{task.teamLeader || "-"}</td>
                        <td>
                          <span style={{ background: "#f0f9ff", color: "#0369a1", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                            {task.employee || "Unassigned"}
                          </span>
                        </td>

                        <td>
                          <span className={(task.priority || "medium").toLowerCase()}>
                            {task.priority || "MEDIUM"}
                          </span>
                        </td>

                        <td>
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

                        <td style={{ maxWidth: "180px" }}>
                          {task.workSubmission ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>✓ Submitted</span>
                              {task.workSubmission.startsWith("http") ? (
                                <a href={task.workSubmission} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: "11px", color: "#2563eb", textDecoration: "underline", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100px", display: "inline-block" }}>View Link</a>
                              ) : (
                                <span title={task.workSubmission} style={{ fontSize: "11px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "90px", display: "inline-block" }}>{task.workSubmission.slice(0, 20)}...</span>
                              )}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not submitted</span>
                          )}
                        </td>

                        <td>{task.dueDate || "-"}</td>

                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(task.id)}
                            title="Delete Task"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                        No Tasks Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", background: "#fff", padding: "12px 20px", borderRadius: "10px" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTasks.length)} of {filteredTasks.length} Tasks
                </span>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: currentPage === 1 ? "#f3f4f6" : "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                  >
                    <FaChevronLeft />
                  </button>

                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: currentPage === totalPages ? "#f3f4f6" : "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Task Details & Work Logger Modal */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskUpdated={loadTasks}
            role="admin"
          />
        )}

      </div>
    </DashboardLayout>
  );
}

export default Tasks;
