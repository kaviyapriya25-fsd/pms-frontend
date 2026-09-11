import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheckDouble, FaProjectDiagram, FaTasks, FaClock, FaInfoCircle, FaExclamationTriangle, FaExternalLinkAlt } from "react-icons/fa";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../../services/notificationService";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const role = (localStorage.getItem("role") || "").toLowerCase();

  const getNotificationsPath = () => {
    if (role.includes("leader")) return "/leader/notifications";
    if (role.includes("employee")) return "/employee/notifications";
    return "/admin/notifications";
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch unread notification count", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000); // 10s live poll

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

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

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Trigger Icon with Red Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          background: isOpen ? "#e2e8f0" : "transparent",
          border: "none",
          padding: "9px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          outline: "none",
        }}
        title="Notifications"
      >
        <FaBell style={{ fontSize: "19px", color: isOpen ? "#1e293b" : "#475569" }} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "3px",
              right: "3px",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "700",
              height: "18px",
              minWidth: "18px",
              padding: "0 4px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 2px #ffffff",
              animation: "pulse 2s infinite",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "48px",
            width: "360px",
            background: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            zIndex: 1000,
            overflow: "hidden",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Notifications</h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#2563eb",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <FaCheckDouble /> Mark read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                Loading notifications...
              </div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 7).map((n) => {
                const isUnread = !n.isRead && !n.read;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f1f5f9",
                      background: isUnread ? "#f0f9ff" : "#ffffff",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      transition: "background 0.2s",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px",
                        borderRadius: "10px",
                        background: "#f1f5f9",
                        fontSize: "16px",
                        marginTop: "2px",
                      }}
                    >
                      {getIconForType(n.type)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4
                          style={{
                            margin: "0 0 2px 0",
                            fontSize: "13.5px",
                            fontWeight: isUnread ? "700" : "600",
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "190px",
                          }}
                        >
                          {n.title}
                        </h4>
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>{n.time || "Recent"}</span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "12.5px",
                          color: "#475569",
                          lineHeight: "1.35",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {n.message}
                      </p>

                      {isUnread && (
                        <button
                          onClick={(e) => handleMarkRead(e, n.id)}
                          style={{
                            marginTop: "6px",
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: "#0284c7",
                            fontSize: "11px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                No notifications right now.
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #f1f5f9",
              background: "#f8fafc",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(getNotificationsPath());
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              View All Notifications <FaExternalLinkAlt style={{ fontSize: "11px" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
