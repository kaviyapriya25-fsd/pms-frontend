import { useState, useEffect } from "react";
import { FaTimes, FaClock, FaCommentAlt, FaPlus, FaEye, FaFileUpload, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./TaskDetailModal.css";

// role: "employee" | "leader" | "admin"
// Only employees can log work. Leaders and admins view work logs (read-only) and can post comments.
function TaskDetailModal({ task, onClose, onTaskUpdated, role = "employee" }) {
  const [localTask, setLocalTask] = useState(task);
  const [activeTab, setActiveTab] = useState("worklog");
  const [hoursSpent, setHoursSpent] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [worklogs, setWorklogs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [showDeliverableInput, setShowDeliverableInput] = useState(false);

  const canLogWork = role === "employee";

  useEffect(() => {
    if (task && task.id) {
      setLocalTask(task);
      fetchLatestTask(task.id);
      loadWorklogs(task.id);
    }
  }, [task]);

  const fetchLatestTask = async (id) => {
    try {
      const res = await api.get(`/tasks/${id}`);
      if (res.data) setLocalTask(res.data);
    } catch (err) {
      console.error("Failed to fetch task details:", err);
    }
  };

  const loadWorklogs = async (id) => {
    const targetId = id || (localTask && localTask.id);
    if (!targetId) return;
    try {
      const res = await api.get(`/tasks/${targetId}/worklog`);
      setWorklogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogWork = async (e) => {
    e.preventDefault();
    if (!hoursSpent || isNaN(hoursSpent) || Number(hoursSpent) <= 0) {
      toast.error("Please enter valid hours spent.");
      return;
    }

    setLoading(true);
    try {
      const userName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "Team Member";
      const userEmail = localStorage.getItem("email") || "user@company.com";

      await api.post(`/tasks/${localTask.id}/worklog`, {
        hoursSpent: Number(hoursSpent),
        userName,
        userEmail,
        workDescription: workDesc,
      });

      toast.success(`Logged ${hoursSpent} hours`);
      setHoursSpent("");
      setWorkDesc("");
      loadWorklogs(localTask.id);
      fetchLatestTask(localTask.id);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to log work");
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const author = localStorage.getItem("name") || localStorage.getItem("leaderName") || "User";
      const res = await api.post(`/tasks/${localTask.id}/comments`, {
        comment: newComment,
        author,
      });

      if (res.data) {
        setLocalTask(res.data);
      }
      toast.success("Comment posted successfully!");
      setNewComment("");
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDeliverable = async () => {
    if (!deliverableInput.trim()) {
      toast.error("Please enter a deliverable URL or note.");
      return;
    }
    try {
      await api.patch(`/tasks/${localTask.id}/work`, { workSubmission: deliverableInput });
      toast.success("Deliverable submitted successfully!");
      setShowDeliverableInput(false);
      fetchLatestTask(localTask.id);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit deliverable.");
    }
  };

  if (!localTask) return null;

  const est = localTask.estimatedHours || 8.0;
  const logged = localTask.loggedHours || 0.0;
  const pct = Math.min(100, Math.round((logged / est) * 100));

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="task-modal-header">
          <div>
            <span className="task-modal-tag">{localTask.project} • {localTask.sprintName || "Sprint 1"}</span>
            <h2 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "#0f172a" }}>{localTask.taskName}</h2>
          </div>
          <button className="task-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Modal Grid */}
        <div className="task-modal-grid">

          {/* Main Content Area */}
          <div className="task-modal-main">
            <div className="task-section">
              <h4>Description</h4>
              <p>{localTask.description || "No description provided."}</p>
            </div>

            {/* Work Deliverable Section */}
            <div className="task-section" style={{ background: "#f8fafc", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaFileUpload style={{ color: "#059669" }} /> Work Deliverable / Submission
                </h4>
                {localTask.workSubmission && (
                  <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                    ✓ Submitted
                  </span>
                )}
              </div>

              {localTask.workSubmission ? (
                <div style={{ fontSize: "13px", color: "#334155", background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", wordBreak: "break-all" }}>
                  {localTask.workSubmission.startsWith("http") ? (
                    <a
                      href={localTask.workSubmission}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", fontWeight: "600", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    >
                      <FaExternalLinkAlt style={{ fontSize: "12px" }} /> Open Link ({localTask.workSubmission})
                    </a>
                  ) : (
                    <span>{localTask.workSubmission}</span>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>
                  No deliverables uploaded for this task yet.
                </div>
              )}

              {canLogWork && (
                <div style={{ marginTop: "10px" }}>
                  {showDeliverableInput ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Paste GitHub PR, Figma URL, or deliverable notes..."
                        value={deliverableInput}
                        onChange={(e) => setDeliverableInput(e.target.value)}
                        style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                      <button
                        type="button"
                        onClick={handleUploadDeliverable}
                        style={{ background: "#059669", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeliverableInput(false)}
                        style={{ background: "#e2e8f0", color: "#475569", border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setDeliverableInput(localTask.workSubmission || "");
                        setShowDeliverableInput(true);
                      }}
                      style={{ background: "#059669", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <FaFileUpload /> {localTask.workSubmission ? "Update Deliverable" : "Upload Deliverable"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="task-tabs">
              <button
                className={`tab-btn ${activeTab === "worklog" ? "active" : ""}`}
                onClick={() => setActiveTab("worklog")}
              >
                {canLogWork ? <FaClock /> : <FaEye />}
                {canLogWork
                  ? `Work Logs (${worklogs.length})`
                  : `View Work Logs (${worklogs.length})`}
              </button>
              <button
                className={`tab-btn ${activeTab === "comments" ? "active" : ""}`}
                onClick={() => setActiveTab("comments")}
              >
                <FaCommentAlt /> Activity & Discussion
              </button>
            </div>

            {/* Worklog Tab */}
            {activeTab === "worklog" && (
              <div>
                {/* Log Work form — visible only to employees */}
                {canLogWork ? (
                  <form onSubmit={handleLogWork} className="worklog-form">
                    <h5>Log Work Executed</h5>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="Hours (e.g. 2.5)"
                        value={hoursSpent}
                        onChange={(e) => setHoursSpent(e.target.value)}
                        required
                        style={{ width: "130px" }}
                      />
                      <input
                        type="text"
                        placeholder="Work description / notes..."
                        value={workDesc}
                        onChange={(e) => setWorkDesc(e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>
                    <button type="submit" className="log-btn" disabled={loading}>
                      <FaPlus /> {loading ? "Logging..." : "Log Work"}
                    </button>
                  </form>
                ) : (
                  /* Read-only notice for admin / leader */
                  <div style={{
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    marginBottom: "14px",
                    fontSize: "13px",
                    color: "#0369a1",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <FaEye />
                    <span>
                      Work logs are submitted by the assigned employee.
                      You are viewing in <strong>read-only</strong> mode.
                    </span>
                  </div>
                )}

                <div className="worklog-list">
                  {worklogs.length === 0 ? (
                    <div style={{ fontSize: "13px", color: "#94a3b8", padding: "10px 0" }}>
                      No work logs recorded yet.
                    </div>
                  ) : (
                    worklogs.map((w) => (
                      <div key={w.id} className="worklog-item">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <strong>{w.userName}</strong>
                          <span style={{ color: "#2563eb", fontWeight: "700" }}>+{w.hoursSpent}h</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                          {w.workDescription || "Logged progress"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div>
                <form onSubmit={handlePostComment} style={{ marginBottom: "16px" }}>
                  <textarea
                    rows="3"
                    placeholder="Add a comment or update..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="log-btn"
                    disabled={loading}
                    style={{ marginTop: "8px" }}
                  >
                    Post Comment
                  </button>
                </form>

                {/* Formatted Discussion Thread */}
                <div className="comments-list">
                  {!localTask.comments ? (
                    <div style={{ fontSize: "13px", color: "#94a3b8", padding: "10px 0" }}>
                      No comments posted yet.
                    </div>
                  ) : (
                    localTask.comments
                      .split("\n")
                      .filter((l) => l.trim().length > 0)
                      .map((line, idx) => {
                        const match = line.match(/^\[(.*?)\] (.*?): (.*)$/);
                        if (match) {
                          const [, time, author, text] = match;
                          return (
                            <div
                              key={idx}
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "4px",
                                  fontSize: "12px",
                                }}
                              >
                                <strong style={{ color: "#1e293b" }}>{author}</strong>
                                <span style={{ color: "#94a3b8", fontSize: "11px" }}>{time}</span>
                              </div>
                              <div style={{ fontSize: "13px", color: "#334155" }}>{text}</div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={idx}
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              padding: "10px 14px",
                              borderRadius: "10px",
                              marginBottom: "8px",
                              fontSize: "13px",
                              color: "#334155",
                            }}
                          >
                            {line}
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Meta Sidebar */}
          <div className="task-modal-sidebar">
            <div className="meta-card">
              <h5>Task Overview</h5>

              <div className="meta-row">
                <span>Status:</span>
                <strong style={{ color: "#2563eb" }}>{localTask.status}</strong>
              </div>
              <div className="meta-row">
                <span>Priority:</span>
                <strong>{localTask.priority}</strong>
              </div>
              <div className="meta-row">
                <span>Assignee:</span>
                <strong>{localTask.employee || "Unassigned"}</strong>
              </div>
              <div className="meta-row">
                <span>Leader:</span>
                <strong>{localTask.teamLeader || "Unassigned"}</strong>
              </div>
              <div className="meta-row">
                <span>Story Points:</span>
                <strong>{localTask.storyPoints || 3} SP</strong>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  <span>Logged vs Estimated</span>
                  <span>{pct}%</span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: pct >= 100 ? "#16a34a" : "#2563eb",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "4px",
                    textAlign: "right",
                  }}
                >
                  {logged}h of {est}h
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;
