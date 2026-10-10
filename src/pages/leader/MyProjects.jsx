import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaderLayout from "../../components/layout/LeaderLayout";
import { getProjects } from "../../services/projectService";
import { getTeamLeaders } from "../../services/teamLeaderService";
import { FaProjectDiagram, FaCalendarAlt, FaUserTie, FaFlag, FaArrowRight, FaSpinner, FaCheckCircle, FaClock } from "react-icons/fa";

function MyProjects() {
  const navigate = useNavigate();
  const leaderEmail = localStorage.getItem("email") || "";
  const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "";

  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [leaders, allProjects] = await Promise.all([
        getTeamLeaders(),
        getProjects(),
      ]);

      const me = leaders.find((l) => 
        (leaderEmail && l.email?.toLowerCase() === leaderEmail.toLowerCase()) || 
        (leaderName && l.name?.toLowerCase() === leaderName.toLowerCase())
      );

      // Find all projects where this leader is assigned
      const myAssignedProjects = allProjects.filter((p) => {
        const matchesLeaderName = p.leader && leaderName && p.leader.toLowerCase() === leaderName.toLowerCase();
        const matchesLeaderEmail = p.leader && leaderEmail && p.leader.toLowerCase() === leaderEmail.toLowerCase();
        const matchesTeamLeaderId = me && p.teamLeaderId && p.teamLeaderId === me.id;
        const matchesLeaderProject = me && me.project && p.projectName && p.projectName.toLowerCase() === me.project.toLowerCase();

        return matchesLeaderName || matchesLeaderEmail || matchesTeamLeaderId || matchesLeaderProject;
      });

      setProjectsList(myAssignedProjects);
    } catch (err) {
      console.error("Error loading assigned projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      case "HIGH":
        return { bg: "#fff7ed", color: "#c2410c", border: "#ffedd5" };
      case "MEDIUM":
        return { bg: "#fefce8", color: "#a16207", border: "#fef9c3" };
      default:
        return { bg: "#f0fdf4", color: "#15803d", border: "#dcfce7" };
    }
  };

  return (
    <LeaderLayout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              My Assigned Projects
            </h1>
            <p style={{ color: "#64748b", margin: "6px 0 0 0", fontSize: "14px" }}>
              Enterprise projects assigned under your leadership ({projectsList.length} active {projectsList.length === 1 ? "project" : "projects"}).
            </p>
          </div>

          <button
            onClick={() => navigate("/leader/assign-tasks")}
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              padding: "11px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
            }}
          >
            Assign Team Tasks <FaArrowRight />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <FaSpinner className="spinner" style={{ fontSize: "28px", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading assigned projects...</p>
          </div>
        ) : projectsList.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(520px, 1fr))", gap: "24px" }}>
            {projectsList.map((project) => {
              const priorityStyle = getPriorityStyle(project.priority);
              const isCompleted = project.status === "COMPLETED";

              return (
                <div
                  key={project.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "26px 28px",
                    boxShadow: "0 4px 12px -2px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                >
                  <div>
                    {/* Header Badges */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <span style={{
                        background: "#e0e7ff",
                        color: "#3730a3",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Project #{project.id}
                      </span>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {/* Priority Badge */}
                        <span style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: priorityStyle.bg,
                          color: priorityStyle.color,
                          border: `1px solid ${priorityStyle.border}`
                        }}>
                          <FaFlag style={{ marginRight: "4px", fontSize: "10px" }} />
                          {project.priority || "MEDIUM"}
                        </span>

                        {/* Status Badge */}
                        <span style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: isCompleted ? "#dcfce7" : "#e0f2fe",
                          color: isCompleted ? "#15803d" : "#0369a1"
                        }}>
                          {isCompleted ? <FaCheckCircle style={{ marginRight: "4px" }} /> : <FaClock style={{ marginRight: "4px" }} />}
                          {project.status || "ACTIVE"}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px 0" }}>
                      {project.projectName}
                    </h2>
                    <p style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      margin: "0 0 20px 0",
                      minHeight: "44px"
                    }}>
                      {project.description || "Enterprise project assigned by organization administrator."}
                    </p>
                  </div>

                  {/* Footer Meta Grid */}
                  <div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: "16px",
                      marginBottom: "18px",
                      fontSize: "13px"
                    }}>
                      <div>
                        <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FaUserTie /> Team Leader:
                        </span>
                        <strong style={{ color: "#0f172a", marginTop: "3px", display: "block" }}>
                          {project.leader || leaderName}
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FaCalendarAlt /> Timeline Duration:
                        </span>
                        <strong style={{ color: "#0f172a", marginTop: "3px", display: "block" }}>
                          {project.startDate || "N/A"} → {project.endDate || "N/A"}
                        </strong>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate("/leader/assign-tasks")}
                      style={{
                        width: "100%",
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        padding: "10px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <FaProjectDiagram /> View & Assign Tasks for this Project
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            background: "#ffffff",
            padding: "60px 40px",
            textAlign: "center",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
          }}>
            <FaProjectDiagram style={{ fontSize: "42px", color: "#cbd5e1", marginBottom: "14px" }} />
            <h3 style={{ fontSize: "18px", color: "#1e293b", margin: "0 0 6px 0" }}>No Projects Assigned Yet</h3>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Your administrator has not assigned any active projects to your account ({leaderEmail}).
            </p>
          </div>
        )}

      </div>
    </LeaderLayout>
  );
}

export default MyProjects;
