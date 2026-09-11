import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LeaderLayout from "../../components/layout/LeaderLayout";
import EmployeeLayout from "../../components/layout/EmployeeLayout";
import SearchBar from "../../components/common/SearchBar";
import NotificationForm from "../../components/notifications/NotificationForm";
import { getNotifications, addNotification, markAsRead, markAllAsRead, deleteNotification } from "../../services/notificationService";
import { FaBell, FaCheckDouble, FaTrash, FaPlus, FaProjectDiagram, FaTasks, FaClock, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import "../../styles/notification.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const role = (localStorage.getItem("role") || "").toUpperCase();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      toast.success("Notification marked as read");
      loadNotifications();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read!");
      loadNotifications();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
      loadNotifications();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleSaveNotification = async (notificationData) => {
    try {
      await addNotification(notificationData);
      toast.success("Notification sent successfully!");
      setShowForm(false);
      setSelectedNotification(null);
      loadNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification");
    }
  };

  const filtered = notifications.filter((n) => {
    const isUnread = !n.isRead && !n.read;
    const isRead = n.isRead || n.read;

    const matchesFilter =
      filter === "ALL" ||
      (filter === "UNREAD" && isUnread) ||
      (filter === "READ" && isRead) ||
      (filter === "TASK" && n.type === "TASK") ||
      (filter === "PROJECT" && n.type === "PROJECT") ||
      (filter === "WORKLOG" && n.type === "WORKLOG");

    const keyword = search.toLowerCase();
    const matchesSearch =
      !search ||
      n.title?.toLowerCase().includes(keyword) ||
      n.message?.toLowerCase().includes(keyword) ||
      n.type?.toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  const getIconForType = (type) => {
    switch (type?.toUpperCase()) {
      case "PROJECT":
        return <FaProjectDiagram style={{ color: "#4f46e5" }} />;
      case "TASK":
        return <FaTasks style={{ color: "#0284c7" }} />;
      case "WORKLOG":
        return <FaClock style={{ color: "#d97706" }} />;
      case "WARNING":
        return <FaExclamationTriangle style={{ color: "#dc2626" }} />;
      default:
        return <FaInfoCircle style={{ color: "#2563eb" }} />;
    }
  };

  const content = (
    <div className="notifications-page" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <FaBell style={{ color: "#2563eb" }} /> Notifications & System Alerts
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            Stay updated with real-time project events, task assignments, work logs, and announcements.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {(role === "ADMIN" || role === "LEADER") && (
            <button
              onClick={() => {
                setSelectedNotification(null);
                setShowForm(true);
              }}
              style={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                color: "#ffffff",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.3)",
              }}
            >
              <FaPlus /> Broadcast Alert
            </button>
          )}

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaCheckDouble /> Mark All Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          onSearch={() => {}}
          onClear={() => setSearch("")}
          placeholder="Search notifications by title, content, or type..."
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setFilter("ALL")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              background: filter === "ALL" ? "#2563eb" : "#e2e8f0",
              color: filter === "ALL" ? "#fff" : "#475569",
            }}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => setFilter("UNREAD")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              background: filter === "UNREAD" ? "#2563eb" : "#e2e8f0",
              color: filter === "UNREAD" ? "#fff" : "#475569",
            }}
          >
            Unread ({unreadCount})
          </button>

          <button
            onClick={() => setFilter("TASK")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              background: filter === "TASK" ? "#2563eb" : "#e2e8f0",
              color: filter === "TASK" ? "#fff" : "#475569",
            }}
          >
            Task Alerts
          </button>

          <button
            onClick={() => setFilter("PROJECT")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              background: filter === "PROJECT" ? "#2563eb" : "#e2e8f0",
              color: filter === "PROJECT" ? "#fff" : "#475569",
            }}
          >
            Project Alerts
          </button>

          <button
            onClick={() => setFilter("WORKLOG")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              background: filter === "WORKLOG" ? "#2563eb" : "#e2e8f0",
              color: filter === "WORKLOG" ? "#fff" : "#475569",
            }}
          >
            Worklog Alerts
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.length > 0 ? (
          filtered.map((n) => {
            const isUnread = !n.isRead && !n.read;
            return (
              <div
                key={n.id}
                style={{
                  background: isUnread ? "#f0f9ff" : "#ffffff",
                  border: isUnread ? "1px solid #bae6fd" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "18px",
                      marginTop: "2px",
                      background: "#f1f5f9",
                    }}
                  >
                    {getIconForType(n.type)}
                  </div>

                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>
                      {n.title}
                      {isUnread && (
                        <span
                          style={{
                            marginLeft: "8px",
                            background: "#3b82f6",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "10px",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", lineHeight: "1.4" }}>{n.message}</p>
                    <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px", display: "block" }}>
                      {n.time || "Recently"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      style={{
                        background: "#e0e7ff",
                        color: "#3730a3",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                  {(role === "ADMIN" || role === "LEADER") && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      style={{
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      title="Delete Notification"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ background: "#fff", padding: "50px", textAlign: "center", borderRadius: "14px", color: "#94a3b8" }}>
            <FaBell style={{ fontSize: "36px", color: "#cbd5e1", marginBottom: "10px" }} />
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>No notifications found in this view.</p>
          </div>
        )}
      </div>

      {/* Broadcast Form Modal */}
      {showForm && (
        <NotificationForm
          onSave={handleSaveNotification}
          selectedNotification={selectedNotification}
          onCancel={() => {
            setShowForm(false);
            setSelectedNotification(null);
          }}
        />
      )}
    </div>
  );

  // Dynamic Layout Wrapper based on Role
  if (role.includes("LEADER")) {
    return <LeaderLayout>{content}</LeaderLayout>;
  }
  if (role.includes("EMPLOYEE")) {
    return <EmployeeLayout>{content}</EmployeeLayout>;
  }
  return <DashboardLayout>{content}</DashboardLayout>;
}

export default Notifications;