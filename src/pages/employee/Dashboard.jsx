import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import { getTasks, updateTaskStatus, uploadWorkSubmission, addTaskComment } from "../../services/taskService";
import { getEmployees } from "../../services/employeeService";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaArrowRight,
  FaProjectDiagram,
  FaCalendarAlt,
  FaUser,
  FaBell,
  FaFileUpload,
  FaComments,
  FaExclamationTriangle,
  FaTimes,
  FaUserTie,
  FaBuilding,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const employeeEmail = localStorage.getItem("email") || "";
  const employeeName = localStorage.getItem("name") || "Employee";

  const [tasks, setTasks] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [activeWorkTask, setActiveWorkTask] = useState(null);
  const [workInput, setWorkInput] = useState("");
  const [activeCommentTask, setActiveCommentTask] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    loadEmployeeDashboard();
  }, []);

  const loadEmployeeDashboard = async () => {
    try {
      setLoading(true);

      // 1. Fetch my tasks
      const allTasks = await getTasks();
      const myTasks = allTasks.filter(
        (t) => t.employee === employeeName || (t.employee && t.employee.toLowerCase() === employeeName.toLowerCase()) || (t.employee === employeeEmail)
      );
      setTasks(myTasks);

      // 2. Fetch employee profile for inherited project
      const allEmployees = await getEmployees();
      const me = allEmployees.find(
        (e) => e.email === employeeEmail || e.name === employeeName
      );
      setEmployeeInfo(me || null);

      // 3. Fetch notifications
      const notifs = await getNotifications();
      setNotifications(Array.isArray(notifs) ? notifs : []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success("Task Status Updated!");
      loadEmployeeDashboard();
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleUploadWorkSubmit = async (e) => {
    e.preventDefault();
    if (!workInput.trim()) {
      toast.error("Please enter deliverable links or submission notes.");
      return;
    }

    try {
      await uploadWorkSubmission(activeWorkTask.id, workInput);
      toast.success("Work Deliverable Submitted Successfully!");
      setActiveWorkTask(null);
      setWorkInput("");
      loadEmployeeDashboard();
    } catch (err) {
      toast.error("Failed to submit work deliverable.");
    }
  };

  const handleAddCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Please type a comment.");
      return;
    }

    try {
      const updatedTask = await addTaskComment(activeCommentTask.id, commentInput, employeeName);
      toast.success("Comment added!");
      setCommentInput("");
      // Update the modal task so new comment is immediately visible
      if (updatedTask) {
        setActiveCommentTask(updatedTask);
      }
      loadEmployeeDashboard();
    } catch (err) {
      toast.error("Failed to post comment.");
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const inheritedProject = employeeInfo?.project || "Unassigned";
  const teamLeaderName = employeeInfo?.teamLeader || "Direct Employee";

  // Deadline calculation
  const urgentDeadlineTasks = tasks.filter((t) => t.priority === "HIGH" || t.priority === "URGENT" || t.status !== "COMPLETED");

  return (
    <EmployeeLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top Welcome Banner */}
        <div style={{ background: "linear-gradient(135deg, #059669 0%, #064e3b 100%)", borderRadius: "16px", padding: "28px 32px", color: "#fff", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px -5px rgba(6, 95, 70, 0.3)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>
                Employee Portal
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800" }}>Welcome, {employeeName} 👋</h1>
            <p style={{ margin: "6px 0 0 0", color: "#a7f3d0", fontSize: "14px" }}>
              Project: <strong style={{ color: "#ffffff" }}>{inheritedProject}</strong> • Team Leader: <strong style={{ color: "#ffffff" }}>{teamLeaderName}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", fontSize: "18px" }}
              title="Notifications"
            >
              <FaBell />
              {notifications.length > 0 && (
                <span style={{ position: "absolute", top: "6px", right: "6px", background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: "800", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaUser /> My Profile
            </button>

            {/* Kanban Board Link */}
            <button
              onClick={() => navigate("/employee/my-tasks")}
              style={{ background: "#10b981", color: "#ffffff", padding: "11px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaTasks /> Kanban Board
            </button>
          </div>
        </div>

        {/* Feature 1: My Inherited Project Banner Card */}
        <div style={{ background: "#ffffff", padding: "24px 28px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "28px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <span style={{ background: "#d1fae5", color: "#047857", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>
                My Assigned Project
              </span>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "10px 0 4px 0" }}>
                {inheritedProject}
              </h2>
            </div>
            <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: "#f0fdf4", color: "#16a34a" }}>
              Active Project
            </span>
          </div>

          <div style={{ display: "flex", gap: "30px", borderTop: "1px solid #f1f5f9", paddingTop: "14px", fontSize: "13px", color: "#475569" }}>
            <div><FaUserTie style={{ color: "#059669" }} /> <strong>Team Leader:</strong> {teamLeaderName}</div>
            <div><FaBuilding style={{ color: "#059669" }} /> <strong>Department:</strong> {employeeInfo?.department || "Engineering"}</div>
            <div><FaTasks style={{ color: "#059669" }} /> <strong>Your Assigned Tasks:</strong> {tasks.length} Items</div>
          </div>
        </div>

        {/* Feature 2: Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "28px" }}>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#f0fdf4", color: "#059669", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaTasks />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Assigned Tasks</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{tasks.length}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#fef3c7", color: "#d97706", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaClock />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>To Do</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{todoTasks.length}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#e0f2fe", color: "#0284c7", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaSpinner />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>In Progress</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{inProgressTasks.length}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#dcfce7", color: "#16a34a", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaCheckCircle />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Completed</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{completedTasks.length}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Feature 3: Task Completion Progress Bar */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "15px" }}>Task Completion Progress</span>
            <span style={{ fontWeight: "700", color: "#059669", fontSize: "15px" }}>{progressPercent}% Completed</span>
          </div>
          <div style={{ height: "12px", width: "100%", background: "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg, #059669 0%, #10b981 100%)", transition: "width 0.4s ease" }}></div>
          </div>
        </div>

        {/* Feature 4 & 5: Deadlines Alert & Work Calendar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

          {/* Urgent Deadlines Widget */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaExclamationTriangle style={{ color: "#dc2626" }} /> Deadlines & Pending Alerts
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {urgentDeadlineTasks.length > 0 ? (
                urgentDeadlineTasks.slice(0, 4).map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fef2f2", borderRadius: "10px", border: "1px solid #fecaca" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: "700", color: "#991b1b" }}>{t.taskName}</h4>
                      <span style={{ fontSize: "11px", color: "#b91c1c" }}>Due: {t.dueDate || "Asap"}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: "#dc2626", color: "#fff" }}>
                      {t.priority || "HIGH"}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#16a34a", fontWeight: "600", fontSize: "13px" }}>
                  🎉 All deadlines clear! No urgent pending tasks.
                </div>
              )}
            </div>
          </div>

          {/* Work Calendar Timeline */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaCalendarAlt style={{ color: "#059669" }} /> Work Calendar Timeline
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tasks.slice(0, 4).map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <FaClock style={{ color: "#059669", fontSize: "14px" }} />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{t.taskName}</h5>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{t.startDate || "Today"} → {t.dueDate || "End of Sprint"}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: "#e0f2fe", color: "#0369a1" }}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Feature 8, 9, 10: Task Table with Status Update, Work Upload, & Comments */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              📝 My Assigned Tasks & Deliverable Submissions
            </h3>
            <button onClick={() => navigate("/employee/my-tasks")} style={{ background: "none", border: "none", color: "#059669", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              Kanban Board <FaArrowRight />
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Task Title</th>
                <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Project</th>
                <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Status Update</th>
                <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Work Deliverables</th>
                <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 14px", fontWeight: "700", color: "#0f172a" }}>
                      {t.taskName}
                      {t.priority === "URGENT" && (
                        <span style={{ marginLeft: "6px", background: "#fef2f2", color: "#dc2626", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>URGENT</span>
                      )}
                    </td>

                    <td style={{ padding: "14px 14px", fontSize: "13px", color: "#475569" }}>
                      <span style={{ background: "#f0fdf4", color: "#059669", padding: "4px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: "600" }}>
                        {t.project || "General"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 14px" }}>
                      <select
                        value={t.status || "TODO"}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        style={{
                          padding: "6px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                          background:
                            t.status === "COMPLETED" ? "#dcfce7" :
                            t.status === "REVIEW" ? "#f3e8ff" :
                            t.status === "BLOCKED" ? "#fee2e2" :
                            t.status === "IN_TESTING" ? "#cff4fc" :
                            t.status === "IN_PROGRESS" ? "#e0f2fe" : "#fef3c7",
                          color:
                            t.status === "COMPLETED" ? "#15803d" :
                            t.status === "REVIEW" ? "#6b21a8" :
                            t.status === "BLOCKED" ? "#991b1b" :
                            t.status === "IN_TESTING" ? "#0891b2" :
                            t.status === "IN_PROGRESS" ? "#0369a1" : "#b45309"
                        }}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="IN_TESTING">IN TESTING / QA</option>
                        <option value="BLOCKED">BLOCKED / ON HOLD</option>
                        <option value="REVIEW">IN REVIEW</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px 14px", fontSize: "12px", color: "#475569" }}>
                      {t.workSubmission ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ color: "#059669", fontWeight: "700" }}>✓ Deliverable Attached</span>
                          {t.workSubmission.startsWith("http") ? (
                            <a
                              href={t.workSubmission}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#2563eb", textDecoration: "underline", fontSize: "11px" }}
                            >
                              🔗 View Link
                            </a>
                          ) : (
                            <span title={t.workSubmission} style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px", display: "block" }}>
                              {t.workSubmission}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>No work uploaded</span>
                      )}
                    </td>

                    <td style={{ padding: "14px 14px", display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setActiveWorkTask(t);
                          setWorkInput(t.workSubmission || "");
                        }}
                        style={{ background: "#059669", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
                        title="Upload Work Deliverable"
                      >
                        <FaFileUpload /> Upload
                      </button>

                      <button
                        onClick={() => setActiveCommentTask(t)}
                        style={{ background: "#e0e7ff", color: "#3730a3", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
                        title="Task Comments"
                      >
                        <FaComments /> Notes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                    No assigned tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal 1: Upload Work Deliverables Modal */}
        {activeWorkTask && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "480px", maxWidth: "90%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Upload Work Deliverables</h3>
                <button onClick={() => setActiveWorkTask(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}><FaTimes /></button>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px 0" }}>
                Task: <strong>{activeWorkTask.taskName}</strong>
              </p>

              <form onSubmit={handleUploadWorkSubmit}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Deliverable Links / Notes *</label>
                <textarea
                  placeholder="Paste GitHub pull request link, Figma URL, or deliverable notes..."
                  value={workInput}
                  onChange={(e) => setWorkInput(e.target.value)}
                  rows={4}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                  required
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                  <button type="submit" style={{ background: "#059669", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}>
                    Submit Deliverables
                  </button>
                  <button type="button" onClick={() => setActiveWorkTask(null)} style={{ background: "#e2e8f0", color: "#334155", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Task Comments Modal */}
        {activeCommentTask && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "500px", maxWidth: "90%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Task Discussion & Notes</h3>
                <button onClick={() => setActiveCommentTask(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}><FaTimes /></button>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px 0" }}>
                Task: <strong>{activeCommentTask.taskName}</strong>
              </p>

              {/* Comment Thread Display */}
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", maxHeight: "200px", overflowY: "auto", marginBottom: "16px", fontSize: "13px", color: "#334155" }}>
                {!activeCommentTask.comments ? (
                  <span style={{ color: "#94a3b8" }}>No comments posted yet. Add a note below.</span>
                ) : (
                  activeCommentTask.comments.split("\n").filter((l) => l.trim().length > 0).map((line, idx) => {
                    const match = line.match(/^\[(.*?)\] (.*?): (.*)$/);
                    if (match) {
                      const [, time, author, text] = match;
                      return (
                        <div key={idx} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                            <strong style={{ color: "#1e293b", fontSize: "12px" }}>{author}</strong>
                            <span style={{ color: "#94a3b8", fontSize: "11px" }}>{time}</span>
                          </div>
                          <div style={{ color: "#334155" }}>{text}</div>
                        </div>
                      );
                    }
                    return <div key={idx} style={{ marginBottom: "6px" }}>{line}</div>;
                  })
                )}
              </div>

              <form onSubmit={handleAddCommentSubmit}>
                <input
                  type="text"
                  placeholder="Type a comment or work update..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                  <button type="submit" style={{ background: "#3730a3", color: "#fff", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}>
                    Post Comment
                  </button>
                  <button type="button" onClick={() => setActiveCommentTask(null)} style={{ background: "#e2e8f0", color: "#334155", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Employee Profile Modal */}
        {showProfileModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "440px", maxWidth: "90%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Employee Profile</h3>
                <button onClick={() => setShowProfileModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}><FaTimes /></button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800" }}>
                  {employeeName ? employeeName.charAt(0).toUpperCase() : "E"}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>{employeeName}</h4>
                  <span style={{ fontSize: "13px", color: "#059669", fontWeight: "600" }}>{employeeInfo?.designation || "Employee"}</span>
                </div>
              </div>

              <div style={{ lineHeight: "2", fontSize: "14px", color: "#334155" }}>
                <p style={{ margin: 0 }}><strong>Email:</strong> {employeeEmail}</p>
                <p style={{ margin: 0 }}><strong>Phone:</strong> {employeeInfo?.phone || "N/A"}</p>
                <p style={{ margin: 0 }}><strong>Team Leader:</strong> {teamLeaderName}</p>
                <p style={{ margin: 0 }}><strong>Inherited Project:</strong> {inheritedProject}</p>
                <p style={{ margin: 0 }}><strong>Status:</strong> {employeeInfo?.status || "ACTIVE"}</p>
              </div>

              <button
                onClick={() => setShowProfileModal(false)}
                style={{ marginTop: "24px", width: "100%", background: "#374151", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

        {/* Modal 4: Notifications Modal */}
        {showNotificationsModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "520px", maxWidth: "90%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaBell style={{ color: "#059669" }} /> Notifications & System Alerts
                </h3>
                <button onClick={() => setShowNotificationsModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}><FaTimes /></button>
              </div>

              {notifications.some(n => !n.isRead && !n.read) && (
                <button
                  onClick={async () => {
                    try {
                      await markAllAsRead();
                      toast.success("All notifications marked as read!");
                      loadEmployeeDashboard();
                    } catch (e) {
                      toast.error("Failed to mark all as read");
                    }
                  }}
                  style={{ width: "100%", marginBottom: "14px", background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", padding: "8px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                >
                  ✓ Mark All as Read
                </button>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "350px", overflowY: "auto" }}>
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const isUnread = !n.isRead && !n.read;
                    return (
                      <div key={n.id} style={{ background: isUnread ? "#f0fdf4" : "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: isUnread ? "1px solid #bbf7d0" : "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                            {n.title}
                            {isUnread && <span style={{ marginLeft: "8px", background: "#059669", color: "#fff", padding: "2px 6px", borderRadius: "10px", fontSize: "10px" }}>NEW</span>}
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>{n.message}</p>
                          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "6px" }}>{n.time || "Recently"}</span>
                        </div>
                        {isUnread && (
                          <button
                            onClick={async () => {
                              try {
                                await markAsRead(n.id);
                                toast.success("Marked as read");
                                loadEmployeeDashboard();
                              } catch (e) {
                                toast.error("Failed to update status");
                              }
                            }}
                            style={{ background: "#d1fae5", color: "#065f46", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: "600", whiteSpace: "nowrap" }}
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>No notifications at this time.</div>
                )}
              </div>

              <button
                onClick={() => setShowNotificationsModal(false)}
                style={{ marginTop: "20px", width: "100%", background: "#059669", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}
              >
                Close Notifications
              </button>
            </div>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}

export default Dashboard;