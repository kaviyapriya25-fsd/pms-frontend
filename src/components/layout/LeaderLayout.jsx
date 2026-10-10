import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaTasks,
  FaUsers,
  FaProjectDiagram,
  FaSignOutAlt,
  FaUserTie,
  FaBell,
  FaHome,
} from "react-icons/fa";
import NotificationBell from "../notifications/NotificationBell";

function LeaderLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const leaderName = localStorage.getItem("name") || localStorage.getItem("leaderName") || "Team Leader";

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/leader/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/leader/dashboard", icon: <FaChartPie /> },
    { label: "Assign Tasks", path: "/leader/assign-tasks", icon: <FaTasks /> },
    { label: "My Team", path: "/leader/team-members", icon: <FaUsers /> },
    { label: "My Project", path: "/leader/my-project", icon: <FaProjectDiagram /> },
    { label: "Notifications", path: "/leader/notifications", icon: <FaBell /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>

      {/* Leader Sidebar */}
      <div style={{ width: "260px", background: "#1e1b4b", color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaUserTie style={{ fontSize: "24px", color: "#818cf8" }} />
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Leader Console</h3>
            <span style={{ fontSize: "11px", color: "#a5b4fc" }}>Project Management System</span>
          </div>
        </div>

        <nav style={{ padding: "20px 12px", flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  color: isActive ? "#ffffff" : "#c7d2fe",
                  background: isActive ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" : "transparent",
                  textDecoration: "none",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "14px",
                  marginBottom: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#fca5a5",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ marginLeft: "260px", flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Top Header Navbar */}
        <div style={{ height: "64px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Team Leader Management Portal
            </h2>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "rgba(99,102,241,0.1)",
                color: "#4f46e5",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              <FaHome /> Go to Home
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <NotificationBell />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#e0e7ff", padding: "6px 14px", borderRadius: "20px" }}>
              <FaUserTie style={{ color: "#4338ca" }} />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#3730a3" }}>{leaderName}</span>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div style={{ padding: "28px", flex: 1 }}>
          {children}
        </div>
      </div>

    </div>
  );
}

export default LeaderLayout;
