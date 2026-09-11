import { useState } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaClipboardList,
  FaArrowRight,
  FaArrowLeft,
  FaUser,
  FaStar,
  FaLock,
  FaInfoCircle,
  FaFileUpload,
  FaVial,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./KanbanBoard.css";

/**
 * role = "employee" → Forward-only (→ only). Cannot roll back a task.
 * role = "leader"   → Full control (← →). Can reset or advance tasks.
 * role = "admin"    → Read-only view. No buttons at all.
 */
function KanbanBoard({ tasks = [], onTaskUpdated, onSelectTask, role = "employee" }) {
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const isAdmin    = role === "admin";
  const isEmployee = role === "employee";
  const isLeader   = role === "leader";

  const STATUS_ORDER = ["TODO", "IN_PROGRESS", "IN_TESTING", "BLOCKED", "REVIEW", "COMPLETED"];

  const columns = [
    { key: "TODO",        title: "To Do",         color: "#64748b", icon: <FaClipboardList /> },
    { key: "IN_PROGRESS", title: "In Progress",    color: "#2563eb", icon: <FaSpinner className="spin" /> },
    { key: "IN_TESTING",  title: "In Testing",     color: "#06b6d4", icon: <FaVial /> },
    { key: "BLOCKED",     title: "Blocked",        color: "#ef4444", icon: <FaExclamationCircle /> },
    { key: "REVIEW",      title: "In Review",      color: "#8b5cf6", icon: <FaClock /> },
    { key: "COMPLETED",   title: "Completed",      color: "#16a34a", icon: <FaCheckCircle /> },
  ];

  const handleStatusChange = async (taskId, currentStatus, direction) => {
    if (isAdmin) return; // admins never move tasks

    const currentIndex = STATUS_ORDER.indexOf(currentStatus.toUpperCase());
    const targetIndex  = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= STATUS_ORDER.length) return;

    // Employees cannot move tasks backward — enforce on the frontend
    if (isEmployee && direction === "prev") {
      toast.warning("Employees can only advance a task forward. Contact your Team Leader to reset it.");
      return;
    }

    const nextStatus = STATUS_ORDER[targetIndex];
    setUpdatingTaskId(taskId);

    try {
      await api.patch(`/tasks/${taskId}/status`, {
        status: nextStatus,
        requesterRole: role,   // send role so backend can also guard
      });
      toast.success(`Task moved to ${nextStatus.replace("_", " ")}`);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      // Show specific message when backend blocks the request
      if (err.response?.status === 403) {
        toast.error("You are not allowed to move this task backward.");
      } else {
        toast.error("Failed to update task status.");
      }
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":  return "priority-high";
      case "LOW":   return "priority-low";
      default:      return "priority-medium";
    }
  };

  return (
    <div className="kanban-board-container">

      {/* Admin read-only banner */}
      {isAdmin && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#fffbeb", border: "1px solid #fde68a",
          borderRadius: "8px", padding: "8px 14px", marginBottom: "14px",
          fontSize: "13px", color: "#92400e", fontWeight: "600",
        }}>
          <FaLock style={{ fontSize: "12px" }} />
          <span>
            You are viewing in <strong>read-only</strong> mode. Task status changes are managed
            by Team Leaders and Employees. Click any card to view details and post comments.
          </span>
        </div>
      )}

      {/* Employee forward-only notice */}
      {isEmployee && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#f0f9ff", border: "1px solid #bae6fd",
          borderRadius: "8px", padding: "8px 14px", marginBottom: "14px",
          fontSize: "13px", color: "#0369a1", fontWeight: "600",
        }}>
          <FaInfoCircle style={{ fontSize: "12px" }} />
          <span>
            You can only <strong>advance tasks forward</strong> (→). Your Team Leader has authority
            to reset or reassign tasks.
          </span>
        </div>
      )}

      <div className="kanban-grid">
        {columns.map((col) => {
          const colTasks = tasks.filter(
            (t) => (t.status || "TODO").toUpperCase() === col.key
          );
          const colStoryPoints = colTasks.reduce((sum, t) => sum + (t.storyPoints || 3), 0);

          return (
            <div key={col.key} className="kanban-column">

              {/* Column Header */}
              <div className="kanban-column-header" style={{ borderTopColor: col.color }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: col.color }}>{col.icon}</span>
                  <span className="col-title">{col.title}</span>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <span className="col-pts" title="Total Story Points">
                  <FaStar style={{ fontSize: "11px", color: "#eab308" }} /> {colStoryPoints} pts
                </span>
              </div>

              {/* Cards list */}
              <div className="kanban-card-list">
                {colTasks.length === 0 ? (
                  <div className="kanban-empty">No tasks in {col.title}</div>
                ) : (
                  colTasks.map((t) => {
                    const est    = t.estimatedHours || 8.0;
                    const logged = t.loggedHours || 0.0;
                    const pct    = Math.min(100, Math.round((logged / est) * 100));

                    return (
                      <div
                        key={t.id}
                        className="kanban-card"
                        onClick={() => onSelectTask && onSelectTask(t)}
                        style={{ cursor: onSelectTask ? "pointer" : "default" }}
                      >
                        <div className="card-top">
                          <span className={`priority-badge ${getPriorityBadgeClass(t.priority)}`}>
                            {t.priority || "MEDIUM"}
                          </span>
                          <span className="sprint-tag">{t.sprintName || "Sprint 1"}</span>
                        </div>

                        <h4 className="card-title">{t.taskName}</h4>
                        <p className="card-desc">
                          {t.description ? t.description.slice(0, 75) + "..." : "No description."}
                        </p>

                        <div className="card-meta">
                          <span className="project-badge">{t.project}</span>
                          <span className="pts-badge">{t.storyPoints || 3} SP</span>
                          {t.workSubmission && (
                            <span
                              style={{ background: "#dcfce7", color: "#15803d", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "3px" }}
                              title={t.workSubmission}
                            >
                              <FaFileUpload style={{ fontSize: "9px" }} /> Deliverable Attached
                            </span>
                          )}
                        </div>

                        {/* Hours Progress Bar */}
                        <div className="time-progress-box">
                          <div className="time-labels">
                            <span>Logged: {logged}h / {est}h</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${pct}%`, background: pct >= 100 ? "#16a34a" : "#2563eb" }}
                            />
                          </div>
                        </div>

                        {/* Card Footer with move controls */}
                        <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                          <div className="assignee-info">
                            <FaUser style={{ color: "#94a3b8", fontSize: "12px" }} />
                            <span>{t.employee || "Unassigned"}</span>
                          </div>

                          {!isAdmin && (
                            <div className="kanban-actions">
                              {/* ← Back button: Leaders only */}
                              {isLeader && col.key !== "TODO" && (
                                <button
                                  className="move-btn"
                                  title="Move Back (Leader Only)"
                                  disabled={updatingTaskId === t.id}
                                  onClick={() => handleStatusChange(t.id, col.key, "prev")}
                                >
                                  <FaArrowLeft />
                                </button>
                              )}

                              {/* → Forward button: Both Employee and Leader */}
                              {col.key !== "COMPLETED" && (
                                <button
                                  className="move-btn primary"
                                  title="Advance Task"
                                  disabled={updatingTaskId === t.id}
                                  onClick={() => handleStatusChange(t.id, col.key, "next")}
                                >
                                  <FaArrowRight />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanBoard;
