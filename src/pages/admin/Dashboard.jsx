import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Statistics from "../../components/dashboard/Statistics";
import RecentProjects from "../../components/dashboard/RecentProjects";
import RecentActivity from "../../components/dashboard/RecentActivity";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import AiRiskWidget from "../../components/agile/AiRiskWidget";
import NotificationForm from "../../components/notifications/NotificationForm";

import { getDashboardCounts } from "../../services/dashboardService";
import { getNotifications, markAsRead, markAllAsRead, addNotification } from "../../services/notificationService";
import { getCompanyProfile } from "../../services/companyService";

import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaCheckCircle,
  FaSpinner,
  FaClipboardList,
  FaPlus,
  FaUserTie,
  FaSearch,
  FaBell,
  FaTimes,
  FaBuilding,
  FaBullhorn,
  FaShieldAlt,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const adminName = localStorage.getItem("name") || localStorage.getItem("adminName") || "Admin";
  const adminEmail = localStorage.getItem("email") || "admin@company.com";
  const storedCompanyName = localStorage.getItem("companyName") || "Enterprise Workspace";

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const [counts, setCounts] = useState({
    employees: 0,
    teamLeaders: 0,
    projects: 0,
    activeProjects: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    tasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    recentProjects: [],
    recentActivities: [],
    recentNotifications: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch dashboard metrics
      const data = await getDashboardCounts();
      setCounts(data);

      // 2. Fetch company profile details
      try {
        const comp = await getCompanyProfile();
        setCompanyInfo(comp);
      } catch (e) {
        console.warn("Company Profile fetch warning:", e);
      }

      // 3. Fetch live notifications
      try {
        const notifs = await getNotifications();
        setNotifications(Array.isArray(notifs) ? notifs : []);
      } catch (e) {
        console.warn("Notifications fetch warning:", e);
      }

    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read!");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleSaveBroadcastNotification = async (notificationData) => {
    try {
      await addNotification(notificationData);
      toast.success("📢 Broadcast Notification Sent Successfully!");
      setShowBroadcastModal(false);
      loadDashboardData();
    } catch (err) {
      console.error("Broadcast notification error:", err);
      toast.error("Failed to send broadcast notification.");
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const statCards = [
    {
      title: "Total Projects",
      value: counts.projects || 0,
      sub: `${counts.activeProjects || 0} active workspace projects`,
      icon: <FaProjectDiagram />,
      badgeColor: "#2563eb",
      bgColor: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      borderColor: "#bfdbfe",
    },
    {
      title: "Active Projects",
      value: counts.activeProjects || 0,
      sub: `${counts.inProgressProjects || 0} currently in progress`,
      icon: <FaSpinner />,
      badgeColor: "#0891b2",
      bgColor: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
      borderColor: "#a5f3fc",
    },
    {
      title: "Completed Projects",
      value: counts.completedProjects || 0,
      sub: `100% delivered & closed`,
      icon: <FaCheckCircle />,
      badgeColor: "#16a34a",
      bgColor: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      borderColor: "#bbf7d0",
    },
    {
      title: "Team Leaders",
      value: counts.teamLeaders || 0,
      sub: `Assigned project managers`,
      icon: <FaUserTie />,
      badgeColor: "#4f46e5",
      bgColor: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
      borderColor: "#c7d2fe",
    },
    {
      title: "Employees",
      value: counts.employees || 0,
      sub: `Registered team members`,
      icon: <FaUsers />,
      badgeColor: "#7c3aed",
      bgColor: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
      borderColor: "#ddd6fe",
    },
    {
      title: "Total Tasks",
      value: counts.tasks || 0,
      sub: `Across all company projects`,
      icon: <FaTasks />,
      badgeColor: "#ea580c",
      bgColor: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
      borderColor: "#fed7aa",
    },
    {
      title: "Pending Tasks",
      value: counts.pendingTasks || 0,
      sub: `Awaiting execution or in progress`,
      icon: <FaClipboardList />,
      badgeColor: "#d97706",
      bgColor: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      borderColor: "#fde68a",
    },
    {
      title: "Completed Tasks",
      value: counts.completedTasks || 0,
      sub: `Successfully completed deliverables`,
      icon: <FaCheckCircle />,
      badgeColor: "#059669",
      bgColor: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      borderColor: "#a7f3d0",
    },
  ];

  // Filtered recent projects based on search query
  const filteredRecentProjects = (counts.recentProjects || []).filter((p) =>
    search ? p.projectName?.toLowerCase().includes(search.toLowerCase()) || p.leader?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const displayCompanyName = companyInfo?.companyName || storedCompanyName;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1240px", margin: "0 auto", paddingBottom: "40px" }}>

        {/* 1. TOP HERO WELCOME BANNER */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
            borderRadius: "20px",
            padding: "30px 34px",
            color: "#ffffff",
            marginBottom: "28px",
            boxShadow: "0 12px 28px -6px rgba(15, 23, 42, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  background: "rgba(99, 102, 241, 0.3)",
                  border: "1px solid rgba(129, 140, 248, 0.4)",
                  color: "#c7d2fe",
                  padding: "4px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaShieldAlt style={{ color: "#818cf8" }} /> Organization Admin Portal
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Welcome Back, {adminName} 👋
            </h1>
            <p style={{ margin: "8px 0 0 0", color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Company Workspace: <strong style={{ color: "#ffffff" }}>{displayCompanyName}</strong> • Isolated Multi-Tenant Instance
            </p>
          </div>

          {/* Quick Action Header Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            
            {/* Notification Bell Trigger */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                fontSize: "18px",
                transition: "all 0.2s ease",
              }}
              title="View Company Notifications"
            >
              <FaBell />
              {unreadNotifCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 0 2px #0f172a",
                  }}
                >
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Profile & Organization Info Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <FaBuilding style={{ color: "#38bdf8" }} /> Organization Profile
            </button>

            {/* Broadcast Alert Button */}
            <button
              onClick={() => setShowBroadcastModal(true)}
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
              }}
            >
              <FaBullhorn /> Broadcast Alert
            </button>

            {/* Add Project */}
            <button
              onClick={() => navigate("/admin/projects")}
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              <FaPlus /> New Project
            </button>

          </div>
        </div>

        {/* 2. SEARCH & FILTER BAR */}
        <div
          style={{
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            background: "#ffffff",
            padding: "14px 20px",
            borderRadius: "14px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e2e8f0",
          }}
        >
          <FaSearch style={{ color: "#64748b", marginRight: "12px", fontSize: "16px" }} />
          <input
            type="text"
            placeholder="Search projects, team leaders, or company metrics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              color: "#1e293b",
              background: "transparent",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* 3. METRIC STAT CARDS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {statCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "22px 24px",
                border: `1px solid ${card.borderColor}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "14px",
                  background: card.bgColor,
                  color: card.badgeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              <div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  {card.title}
                </span>
                <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "4px 0 2px 0" }}>
                  {card.value}
                </h2>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
                  {card.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. AI DELAY & BOTTLENECK RISK PREDICTOR WIDGET */}
        <div style={{ marginBottom: "32px" }}>
          <AiRiskWidget />
        </div>

        {/* 5. VISUAL ANALYTICS & CHARTS SECTION */}
        <div style={{ marginBottom: "32px" }}>
          <AnalyticsChart />
        </div>

        <div style={{ marginBottom: "32px" }}>
          <Statistics />
        </div>

        {/* 6. BOTTOM FEEDS: RECENT PROJECTS & RECENT ACTIVITIES */}
        <div className="dashboard-bottom">
          <RecentProjects data={filteredRecentProjects} />
          <RecentActivity data={counts.recentActivities} />
        </div>

        {/* ============================================================ */}
        {/* MODAL 1: ORGANIZATION & ADMIN PROFILE MODAL                   */}
        {/* ============================================================ */}
        {showProfileModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1100,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "560px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "24px 28px",
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "rgba(56, 189, 248, 0.2)",
                      color: "#38bdf8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    <FaBuilding />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>Organization & Admin Profile</h3>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Enterprise Workspace Metadata</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    color: "#ffffff",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Admin Card */}
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      fontWeight: "800",
                    }}
                  >
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{adminName}</h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>{adminEmail}</p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "6px",
                        background: "#e0e7ff",
                        color: "#3730a3",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      System Admin
                    </span>
                  </div>
                </div>

                {/* Company Specs Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Company Name</span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                      {displayCompanyName}
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Industry</span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                      {companyInfo?.industry || "IT & Software"}
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Company Size</span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                      {companyInfo?.companySize || "11-50 Employees"}
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Contact Email</span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", fontWeight: "700", color: "#0f172a", wordBreak: "break-all" }}>
                      {companyInfo?.companyEmail || adminEmail}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    style={{
                      background: "#0f172a",
                      color: "#ffffff",
                      padding: "10px 22px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: NOTIFICATIONS DRAWER / MODAL                         */}
        {/* ============================================================ */}
        {showNotificationsModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1100,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "20px 24px",
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaBell style={{ color: "#38bdf8", fontSize: "20px" }} />
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>Company Notifications</h3>
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "2px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    {unreadNotifCount} Unread
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      color: "#ffffff",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Mark All Read
                  </button>

                  <button
                    onClick={() => setShowNotificationsModal(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      color: "#ffffff",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* List */}
              <div style={{ padding: "20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                {notifications.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#94a3b8", margin: "40px 0", fontSize: "14px" }}>
                    No notifications available.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: notif.read ? "#f8fafc" : "#f0f9ff",
                        border: `1px solid ${notif.read ? "#e2e8f0" : "#bae6fd"}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <h5 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                          {notif.title}
                        </h5>
                        <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.4" }}>
                          {notif.message}
                        </p>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          style={{
                            background: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 3: BROADCAST NOTIFICATION FORM                          */}
        {/* ============================================================ */}
        {showBroadcastModal && (
          <NotificationForm
            onSave={handleSaveBroadcastNotification}
            onCancel={() => setShowBroadcastModal(false)}
          />
        )}

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;