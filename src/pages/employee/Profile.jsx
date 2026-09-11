import { useEffect, useState } from "react";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import { getEmployees } from "../../services/employeeService";
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaUserTie, FaProjectDiagram } from "react-icons/fa";

function Profile() {
  const employeeEmail = localStorage.getItem("email") || "";
  const employeeName = localStorage.getItem("name") || "Employee";

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const all = await getEmployees();
      const me = all.find((e) => e.email === employeeEmail || e.name === employeeName);
      if (me) {
        setProfile(me);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EmployeeLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            My Profile
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            View your personal employee profile details.
          </p>
        </div>

        {profile ? (
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "28px" }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : "E"}
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{profile.name}</h2>
                <span style={{ fontSize: "14px", color: "#059669", fontWeight: "600" }}>{profile.designation || "Employee"}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "24px", fontSize: "14px", color: "#334155" }}>
              <div>
                <span style={{ color: "#64748b", fontSize: "13px" }}><FaEnvelope /> Email Address</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700" }}>{profile.email}</p>
              </div>

              <div>
                <span style={{ color: "#64748b", fontSize: "13px" }}><FaPhone /> Phone Number</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700" }}>{profile.phone || "N/A"}</p>
              </div>

              <div>
                <span style={{ color: "#64748b", fontSize: "13px" }}><FaUserTie /> Team Leader</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700" }}>{profile.teamLeader || "None (Direct)"}</p>
              </div>

              <div>
                <span style={{ color: "#64748b", fontSize: "13px" }}><FaProjectDiagram /> Assigned Project</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700" }}>{profile.project || "Unassigned"}</p>
              </div>

              <div>
                <span style={{ color: "#64748b", fontSize: "13px" }}><FaBriefcase /> Status</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "700", color: profile.status === "ACTIVE" ? "#16a34a" : "#dc2626" }}>{profile.status}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "40px", textAlign: "center", borderRadius: "14px", color: "#64748b" }}>
            Loading Profile...
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}

export default Profile;
