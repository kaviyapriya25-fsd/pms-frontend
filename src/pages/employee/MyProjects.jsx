import { useEffect, useState } from "react";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import { getEmployees } from "../../services/employeeService";
import { FaProjectDiagram, FaUserTie, FaBuilding, FaCheckCircle } from "react-icons/fa";

function MyProjects() {
  const employeeEmail = localStorage.getItem("email") || "";
  const employeeName = localStorage.getItem("name") || "Employee";

  const [employeeInfo, setEmployeeInfo] = useState(null);

  useEffect(() => {
    loadMyProjectInfo();
  }, []);

  const loadMyProjectInfo = async () => {
    try {
      const allEmployees = await getEmployees();
      const me = allEmployees.find(
        (e) => e.email === employeeEmail || e.name === employeeName
      );
      if (me) {
        setEmployeeInfo(me);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EmployeeLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            My Assigned Project
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            Details about your current project inherited from your Team Leader.
          </p>
        </div>

        {employeeInfo && employeeInfo.project ? (
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <span style={{ background: "#d1fae5", color: "#047857", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>
              Inherited Project
            </span>

            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "12px 0 6px 0" }}>
              {employeeInfo.project}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
              <div>
                <span style={{ fontSize: "13px", color: "#64748b" }}><FaUserTie /> Team Leader:</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700", color: "#0f172a" }}>
                  {employeeInfo.teamLeader || "None (Direct Employee)"}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "13px", color: "#64748b" }}><FaBuilding /> Department:</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700", color: "#0f172a" }}>
                  {employeeInfo.department || "General"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "40px", textAlign: "center", borderRadius: "14px", color: "#64748b" }}>
            No project currently assigned to you. When your Team Leader is assigned to a project, it will automatically appear here.
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}

export default MyProjects;
