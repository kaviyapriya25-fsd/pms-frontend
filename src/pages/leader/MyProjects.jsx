import { useEffect, useState } from "react";
import LeaderLayout from "../../components/layout/LeaderLayout";
import { getProjects } from "../../services/projectService";
import { getTeamLeaders } from "../../services/teamLeaderService";
import { FaProjectDiagram, FaCalendarAlt, FaUserTie, FaCheckCircle, FaSpinner } from "react-icons/fa";

function MyProjects() {
  const leaderEmail = localStorage.getItem("email") || "";
  const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "";

  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const leaders = await getTeamLeaders();
      const me = leaders.find((l) => l.email === leaderEmail || l.name === leaderName);

      if (me && me.project) {
        const allProjects = await getProjects();
        const found = allProjects.find((p) => p.projectName === me.project || p.leader === leaderName);
        setProjectDetails(found || { projectName: me.project, status: "ACTIVE", leader: leaderName });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LeaderLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            My Assigned Project
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            Details and status of the project assigned to you by the Admin.
          </p>
        </div>

        {projectDetails ? (
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>
                  Assigned Project
                </span>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "12px 0 6px 0" }}>
                  {projectDetails.projectName}
                </h2>
                <p style={{ color: "#64748b", fontSize: "14px" }}>{projectDetails.description || "No description provided."}</p>
              </div>

              <span style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700",
                background: projectDetails.status === "COMPLETED" ? "#dcfce7" : "#e0f2fe",
                color: projectDetails.status === "COMPLETED" ? "#15803d" : "#0369a1"
              }}>
                {projectDetails.status || "ACTIVE"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
              <div>
                <span style={{ fontSize: "13px", color: "#64748b" }}><FaUserTie /> Team Leader:</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700", color: "#0f172a" }}>{projectDetails.leader || leaderName}</p>
              </div>

              <div>
                <span style={{ fontSize: "13px", color: "#64748b" }}><FaCalendarAlt /> Timeline:</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700", color: "#0f172a" }}>
                  {projectDetails.startDate || "N/A"} to {projectDetails.endDate || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "40px", textAlign: "center", borderRadius: "14px", color: "#64748b" }}>
            No project currently assigned to you by the Admin.
          </div>
        )}

      </div>
    </LeaderLayout>
  );
}

export default MyProjects;
