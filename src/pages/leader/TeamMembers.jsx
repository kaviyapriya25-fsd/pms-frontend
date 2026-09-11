import { useEffect, useState } from "react";
import LeaderLayout from "../../components/layout/LeaderLayout";
import SearchBar from "../../components/common/SearchBar";
import { getEmployees } from "../../services/employeeService";
import { getTasks } from "../../services/taskService";
import { FaUsers, FaEnvelope, FaPhone, FaBriefcase, FaCheckCircle, FaTasks } from "react-icons/fa";

function TeamMembers() {
  const leaderEmail = localStorage.getItem("email") || "";
  const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "";

  const [team, setTeam] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const allEmployees = await getEmployees();
      const myTeam = allEmployees.filter(
        (e) => e.teamLeader === leaderName || e.teamLeader === leaderEmail
      );
      setTeam(myTeam);

      const allTasks = await getTasks();
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const [search, setSearch] = useState("");

  const filteredTeam = team.filter((member) => {
    const keyword = search.toLowerCase();
    return (
      !search ||
      member.name?.toLowerCase().includes(keyword) ||
      member.email?.toLowerCase().includes(keyword) ||
      member.designation?.toLowerCase().includes(keyword) ||
      member.phone?.toLowerCase().includes(keyword) ||
      member.status?.toLowerCase().includes(keyword)
    );
  });

  return (
    <LeaderLayout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            My Team Members
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            List of all employees working under your leadership.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "24px" }}>
          <SearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            onSearch={() => {}}
            onClear={() => setSearch("")}
            placeholder="Search team members by name, email, designation, phone, or status..."
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredTeam.length > 0 ? (
            filteredTeam.map((member) => {
              const memberTasks = tasks.filter((t) => t.employee === member.name);
              const completedMemberTasks = memberTasks.filter((t) => t.status === "COMPLETED").length;

              return (
                <div key={member.id} style={{ background: "#ffffff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px" }}>
                      {member.name ? member.name.charAt(0).toUpperCase() : "E"}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>{member.name}</h3>
                      <span style={{ fontSize: "13px", color: "#64748b" }}>{member.designation || "Team Member"}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.8", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                    <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaEnvelope style={{ color: "#818cf8" }} /> {member.email}
                    </p>
                    <p style={{ margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaPhone style={{ color: "#818cf8" }} /> {member.phone || "N/A"}
                    </p>
                    <p style={{ margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaBriefcase style={{ color: "#818cf8" }} /> Status: <span style={{ color: member.status === "ACTIVE" ? "#16a34a" : "#dc2626", fontWeight: "600" }}>{member.status}</span>
                    </p>
                  </div>

                  <div style={{ marginTop: "16px", background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#475569" }}>
                    <span><FaTasks /> Tasks Assigned: <strong>{memberTasks.length}</strong></span>
                    <span><FaCheckCircle style={{ color: "#16a34a" }} /> Completed: <strong>{completedMemberTasks}</strong></span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: "1 / -1", background: "#fff", padding: "40px", textAlign: "center", borderRadius: "14px", color: "#64748b" }}>
              No employees assigned to your team yet.
            </div>
          )}
        </div>

      </div>
    </LeaderLayout>
  );
}

export default TeamMembers;
