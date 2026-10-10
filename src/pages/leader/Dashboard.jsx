import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaderLayout from "../../components/layout/LeaderLayout";
import { getLeaderDashboardCounts } from "../../services/dashboardService";
import { getTasks, updateTaskStatus } from "../../services/taskService";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import {
  FaTasks,
  FaUsers,
  FaProjectDiagram,
  FaCheckCircle,
  FaSpinner,
  FaPlus,
  FaArrowRight,
  FaUserTie,
  FaBell,
  FaExclamationTriangle,
  FaClock,
  FaChartPie,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaUser,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const leaderEmail = localStorage.getItem("email") || "";
  const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "Team Leader";
  const department = localStorage.getItem("department") || "Engineering";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  useEffect(() => {
    loadLeaderDashboard();
  }, []);

  const loadLeaderDashboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderDashboardCounts();
      setDashboardData(data);
    } catch (err) {
      console.error("Leader Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      loadLeaderDashboard();
    } catch (err) {
      console.error("Status Change Error:", err);
    }
  };

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  // Metrics extraction with safety fallbacks
  const assignedProjects = dashboardData?.assignedProjects || [];
  const currentProject = assignedProjects[selectedProjectIndex] || (assignedProjects.length > 0 ? assignedProjects[0] : null);

  const assignedProjectName = currentProject ? currentProject.projectName : (dashboardData?.assignedProjectName || "Unassigned");
  const assignedProjectStatus = currentProject ? currentProject.status : (dashboardData?.assignedProjectStatus || "ACTIVE");
  const assignedProjectStartDate = currentProject ? currentProject.startDate : (dashboardData?.assignedProjectStartDate || "N/A");
  const assignedProjectEndDate = currentProject ? currentProject.endDate : (dashboardData?.assignedProjectEndDate || "N/A");
  const assignedProjectDescription = currentProject ? currentProject.description : (dashboardData?.assignedProjectDescription || "No description provided.");
  const assignedProjectPriority = currentProject ? currentProject.priority : (dashboardData?.assignedProjectPriority || "MEDIUM");

  const teamMembersCount = dashboardData?.teamMembersCount || 0;
  const totalTasks = dashboardData?.totalTasks || 0;
  const todoTasks = dashboardData?.todoTasks || 0;
  const inProgressTasks = dashboardData?.inProgressTasks || 0;
  const completedTasks = dashboardData?.completedTasks || 0;
  const urgentTasks = dashboardData?.urgentTasks || 0;
  const completionPercentage = dashboardData?.completionPercentage || 0;

  const teamMembers = dashboardData?.teamMembers || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const notifications = dashboardData?.notifications || [];

  return (
    <LeaderLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top Welcome Header Bar */}
        <div style={{ background: "linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)", borderRadius: "16px", padding: "28px 32px", color: "#fff", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px -5px rgba(49, 27, 146, 0.3)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Team Leader Workspace
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800" }}>Welcome Back, {leaderName} 👋</h1>
            <p style={{ margin: "6px 0 0 0", color: "#c7d2fe", fontSize: "14px" }}>
              {assignedProjects.length > 1 ? (
                <>
                  Assigned Projects ({assignedProjects.length}):{" "}
                  <strong style={{ color: "#ffffff" }}>
                    {assignedProjects.map((p) => p.projectName).join(" • ")}
                  </strong>
                </>
              ) : (
                <>
                  Assigned Project: <strong style={{ color: "#ffffff" }}>{assignedProjectName}</strong>
                </>
              )}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* View All Projects Button if multiple */}
            {assignedProjects.length > 1 && (
              <button
                onClick={() => navigate("/leader/my-project")}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FaProjectDiagram /> View All ({assignedProjects.length})
              </button>
            )}

            {/* Profile Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaUserTie /> Profile
            </button>

            {/* Assign Task Button */}
            <button
              onClick={() => navigate("/leader/assign-tasks")}
              style={{ background: "#4f46e5", color: "#ffffff", padding: "11px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(79,70,229,0.4)" }}
            >
              <FaPlus /> Assign New Task
            </button>
          </div>

        </div>

        {/* Feature 1: Assigned Project Banner Card */}
        {assignedProjects.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#475569" }}>
              Active Project View:
            </span>
            {assignedProjects.map((p, idx) => (
              <button
                key={p.id || idx}
                onClick={() => setSelectedProjectIndex(idx)}
                style={{
                  background: selectedProjectIndex === idx ? "#4f46e5" : "#ffffff",
                  color: selectedProjectIndex === idx ? "#ffffff" : "#475569",
                  border: selectedProjectIndex === idx ? "1px solid #4f46e5" : "1px solid #cbd5e1",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: selectedProjectIndex === idx ? "0 2px 6px rgba(79,70,229,0.25)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <FaProjectDiagram style={{ fontSize: "11px" }} /> {p.projectName}
              </button>
            ))}
          </div>
        )}

        <div style={{ background: "#ffffff", padding: "24px 28px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "28px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>
                  Assigned Project
                </span>
                {assignedProjects.length > 1 && (
                  <span style={{ background: "#f1f5f9", color: "#64748b", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                    Project {selectedProjectIndex + 1} of {assignedProjects.length}
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "10px 0 4px 0" }}>
                {assignedProjectName}
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>{assignedProjectDescription}</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: "#f0fdf4", color: "#16a34a" }}>
                Status: {assignedProjectStatus}
              </span>
              <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: "#fef2f2", color: "#dc2626" }}>
                Priority: {assignedProjectPriority}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "30px", borderTop: "1px solid #f1f5f9", paddingTop: "16px", fontSize: "13px", color: "#475569" }}>
            <div><strong>Start Date:</strong> {assignedProjectStartDate || "N/A"}</div>
            <div><strong>Target Completion:</strong> {assignedProjectEndDate || "N/A"}</div>
            <div><strong>Assigned Team Size:</strong> {teamMembersCount} Members</div>
          </div>
        </div>

        {/* Feature 2: Metrics Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "28px" }}>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#f0f9ff", color: "#0284c7", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaUsers />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Assigned Employees</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{teamMembersCount}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#e0e7ff", color: "#4f46e5", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaTasks />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Total Tasks</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{totalTasks}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#fef3c7", color: "#d97706", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaClock />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>To Do Tasks</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{todoTasks}</p>
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
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{inProgressTasks}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "12px", borderRadius: "10px", fontSize: "22px" }}>
                <FaCheckCircle />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Completed</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{completedTasks}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Feature 3: Progress & Interactive Charts Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "28px" }}>

          {/* Progress & Task Distribution */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaChartPie style={{ color: "#4f46e5" }} /> Team Progress & Status Distribution
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Overall Completion</span>
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#4f46e5" }}>{completionPercentage}% Done</span>
              </div>
              <div style={{ height: "12px", width: "100%", background: "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${completionPercentage}%`, background: "linear-gradient(90deg, #4f46e5 0%, #10b981 100%)", transition: "width 0.5s ease" }}></div>
              </div>
            </div>

            {/* Visual Task Status Bar */}
            <div style={{ marginTop: "24px" }}>
              <h4 style={{ fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>Task Breakdown</h4>
              <div style={{ height: "24px", display: "flex", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ width: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%`, background: "#f59e0b" }} title={`TODO: ${todoTasks}`}></div>
                <div style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%`, background: "#0ea5e9" }} title={`In Progress: ${inProgressTasks}`}></div>
                <div style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`, background: "#16a34a" }} title={`Completed: ${completedTasks}`}></div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "12px" }}>
                <span style={{ color: "#b45309", fontWeight: "600" }}>● To Do ({todoTasks})</span>
                <span style={{ color: "#0369a1", fontWeight: "600" }}>● In Progress ({inProgressTasks})</span>
                <span style={{ color: "#15803d", fontWeight: "600" }}>● Completed ({completedTasks})</span>
              </div>
            </div>
          </div>

          {/* Priority Breakdown & Urgent Alert Chart */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaExclamationTriangle style={{ color: "#dc2626" }} /> Priority Breakdown
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fef2f2", borderRadius: "10px", border: "1px solid #fecaca" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#991b1b" }}>High / Urgent Tasks</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#dc2626" }}>{urgentTasks}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f0f9ff", borderRadius: "10px", border: "1px solid #bae6fd" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#0369a1" }}>Medium Priority</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#0284c7" }}>{totalTasks - urgentTasks}</span>
              </div>

            </div>
          </div>

        </div>

        {/* Feature 4: Employee Monitoring Section */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              👥 Employee Monitoring & Progress
            </h3>
            <button onClick={() => navigate("/leader/team-members")} style={{ background: "none", border: "none", color: "#4f46e5", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              View All Members <FaArrowRight />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {teamMembers.length > 0 ? (
              teamMembers.map((emp) => {
                const empPercent = emp.totalTasks > 0 ? Math.round((emp.completedTasks / emp.totalTasks) * 100) : 0;
                return (
                  <div key={emp.id} style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>
                        {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{emp.name}</h4>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{emp.designation || "Team Member"}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", color: "#475569", marginBottom: "10px" }}>
                      Tasks Done: <strong>{emp.completedTasks} / {emp.totalTasks}</strong> ({empPercent}%)
                    </div>

                    <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${empPercent}%`, background: "#10b981" }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                No employees assigned to your team yet.
              </div>
            )}
          </div>
        </div>

        {/* Feature 5: Recent Activity & Notifications Timeline */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
            🕒 Recent Team Activities
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4f46e5" }}></div>
                  <div style={{ flex: 1, fontSize: "14px", color: "#334155" }}>{act.title}</div>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{act.time}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>No recent activity.</div>
            )}
          </div>
        </div>

        {/* Modal 1: Team Leader Profile Modal */}
        {showProfileModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "450px", maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Team Leader Profile</h3>
                <button onClick={() => setShowProfileModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}><FaTimes /></button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800" }}>
                  {leaderName ? leaderName.charAt(0).toUpperCase() : "L"}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>{leaderName}</h4>
                  <span style={{ fontSize: "13px", color: "#4f46e5", fontWeight: "600" }}>Team Leader</span>
                </div>
              </div>

              <div style={{ lineHeight: "2", fontSize: "14px", color: "#334155" }}>
                <p style={{ margin: 0 }}><strong>Email:</strong> {leaderEmail}</p>
                <p style={{ margin: 0 }}><strong>Department:</strong> {department}</p>
                <p style={{ margin: 0 }}><strong>Assigned Project:</strong> {assignedProjectName}</p>
                <p style={{ margin: 0 }}><strong>Role:</strong> TEAM_LEADER</p>
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

        {/* Modal 2: Notifications Modal */}
        {showNotificationsModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "520px", maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaBell style={{ color: "#4f46e5" }} /> Team Leader Notifications
                </h3>
                <button onClick={() => setShowNotificationsModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}><FaTimes /></button>
              </div>

              {notifications.some(n => !n.isRead && !n.read) && (
                <button
                  onClick={async () => {
                    try {
                      await markAllAsRead();
                      loadLeaderDashboard();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  style={{ width: "100%", marginBottom: "14px", background: "#e0e7ff", color: "#3730a3", border: "1px solid #c7d2fe", padding: "8px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                >
                  ✓ Mark All as Read
                </button>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "350px", overflowY: "auto" }}>
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const isUnread = !n.isRead && !n.read;
                    return (
                      <div key={n.id} style={{ background: isUnread ? "#eef2ff" : "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: isUnread ? "1px solid #c7d2fe" : "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                            {n.title}
                            {isUnread && <span style={{ marginLeft: "8px", background: "#4f46e5", color: "#fff", padding: "2px 6px", borderRadius: "10px", fontSize: "10px" }}>NEW</span>}
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{n.message}</p>
                          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "6px" }}>{n.time || "Recently"}</span>
                        </div>
                        {isUnread && (
                          <button
                            onClick={async () => {
                              try {
                                await markAsRead(n.id);
                                loadLeaderDashboard();
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            style={{ background: "#e0e7ff", color: "#3730a3", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: "600", whiteSpace: "nowrap" }}
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
                style={{ marginTop: "20px", width: "100%", background: "#4f46e5", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}
              >
                Close Notifications
              </button>
            </div>
          </div>
        )}

      </div>
    </LeaderLayout>
  );
}

export default Dashboard;