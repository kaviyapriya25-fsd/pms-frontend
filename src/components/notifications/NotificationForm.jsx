import { useEffect, useState } from "react";
import { FaPaperPlane, FaTimes, FaBell } from "react-icons/fa";

function NotificationForm({ onSave, selectedNotification, onCancel }) {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "INFO",
    recipientRole: "ALL",
    recipientEmail: "",
  });

  useEffect(() => {
    if (selectedNotification) {
      setNotification(selectedNotification);
    }
  }, [selectedNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(notification);
    setNotification({
      title: "",
      message: "",
      type: "INFO",
      recipientRole: "ALL",
      recipientEmail: "",
    });
  };

  return (
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
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaBell style={{ color: "#38bdf8", fontSize: "20px" }} />
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>
              {selectedNotification ? "Edit Notification" : "Broadcast Notification"}
            </h3>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "rgba(255,255,255,0.1)",
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Notification Title *
            </label>
            <input
              name="title"
              placeholder="e.g. System Maintenance Notice"
              value={notification.title}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Message / Content *
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="Provide notification details or announcements..."
              value={notification.message}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Notification Type
              </label>
              <select
                name="type"
                value={notification.type}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                <option value="INFO">Info Alert</option>
                <option value="TASK">Task Alert</option>
                <option value="PROJECT">Project Alert</option>
                <option value="WARNING">Warning Alert</option>
                <option value="SUCCESS">Success Notification</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Target Role
              </label>
              <select
                name="recipientRole"
                value={notification.recipientRole || "ALL"}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                <option value="ALL">All Users (Broadcast)</option>
                <option value="EMPLOYEE">Employees Only</option>
                <option value="LEADER">Team Leaders Only</option>
                <option value="ADMIN">Admins Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Specific Recipient Email (Optional)
            </label>
            <input
              name="recipientEmail"
              type="email"
              placeholder="Leave empty for all users in selected role"
              value={notification.recipientEmail || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#475569",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)",
              }}
            >
              <FaPaperPlane /> {selectedNotification ? "Update Alert" : "Send Broadcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NotificationForm;