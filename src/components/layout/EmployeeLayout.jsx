import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaTasks,
  FaProjectDiagram,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaBell,
} from "react-icons/fa";
import NotificationBell from "../notifications/NotificationBell";

function EmployeeLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const employeeName = localStorage.getItem("name") || "Employee";

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/employee/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/employee/dashboard", icon: <FaChartPie /> },
    { label: "My Tasks", path: "/employee/my-tasks", icon: <FaTasks /> },
    { label: "My Project", path: "/employee/my-project", icon: <FaProjectDiagram /> },
    { label: "Notifications", path: "/employee/notifications", icon: <FaBell /> },
    { label: "My Profile", path: "/employee/profile", icon: <FaUser /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>

      {/* Employee Sidebar */}
      <div style={{ width: "260px", background: "#064e3b", color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaUsers style={{ fontSize: "24px", color: "#6ee7b7" }} />
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Employee Portal</h3>
            <span style={{ fontSize: "11px", color: "#a7f3d0" }}>Project Management System</span>
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
                  color: isActive ? "#ffffff" : "#a7f3d0",
                  background: isActive ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "transparent",
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
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Employee Workspace
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <NotificationBell />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#d1fae5", padding: "6px 14px", borderRadius: "20px" }}>
              <FaUser style={{ color: "#047857" }} />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#065f46" }}>{employeeName}</span>
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

export default EmployeeLayout;
