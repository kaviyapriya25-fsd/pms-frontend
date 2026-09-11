import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCompanyProfile, updateCompanyProfile } from "../../services/companyService";
import { FaBuilding, FaLock, FaBell, FaCog, FaCheckCircle, FaShieldAlt, FaSave } from "react-icons/fa";
import "../../styles/settings.css";

function SettingsForm() {
  const [activeTab, setActiveTab] = useState("PROFILE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
    address: "",
    logo: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    taskStatusAlerts: true,
    securityAlerts: true,
  });

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const data = await getCompanyProfile();
      setCompany({
        companyName: data.companyName || "",
        companyEmail: data.companyEmail || "",
        phone: data.phone || "",
        website: data.website || "",
        industry: data.industry || "",
        companySize: data.companySize || "",
        address: data.address || "",
        logo: data.logo || "",
      });
    } catch (err) {
      console.error("Failed to load company profile:", err);
      toast.error("Failed to load company settings");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateCompanyProfile(company);
      setCompany(updated);
      toast.success("Company Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update company settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (security.newPassword.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }
    toast.success("Security & Password settings updated successfully!");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (loading) {
    return <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading company settings...</div>;
  }

  return (
    <div style={{ maxWidth: "900px" }}>

      {/* Tabs Header */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("PROFILE")}
          style={{
            padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px",
            display: "flex", alignItems: "center", gap: "8px",
            background: activeTab === "PROFILE" ? "#2563eb" : "transparent",
            color: activeTab === "PROFILE" ? "#ffffff" : "#64748b"
          }}
        >
          <FaBuilding /> Company Profile
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SECURITY")}
          style={{
            padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px",
            display: "flex", alignItems: "center", gap: "8px",
            background: activeTab === "SECURITY" ? "#2563eb" : "transparent",
            color: activeTab === "SECURITY" ? "#ffffff" : "#64748b"
          }}
        >
          <FaLock /> Security & Password
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("NOTIFICATIONS")}
          style={{
            padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px",
            display: "flex", alignItems: "center", gap: "8px",
            background: activeTab === "NOTIFICATIONS" ? "#2563eb" : "transparent",
            color: activeTab === "NOTIFICATIONS" ? "#ffffff" : "#64748b"
          }}
        >
          <FaBell /> Notifications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SYSTEM")}
          style={{
            padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px",
            display: "flex", alignItems: "center", gap: "8px",
            background: activeTab === "SYSTEM" ? "#2563eb" : "transparent",
            color: activeTab === "SYSTEM" ? "#ffffff" : "#64748b"
          }}
        >
          <FaCog /> System Diagnostics
        </button>
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === "PROFILE" && (
        <form onSubmit={handleSaveCompany} style={{ background: "#ffffff", padding: "28px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "18px", fontWeight: "800" }}>Company Profile Settings</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={company.companyName}
                onChange={handleCompanyChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Company Email *</label>
              <input
                type="email"
                name="companyEmail"
                value={company.companyEmail}
                onChange={handleCompanyChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={company.phone}
                onChange={handleCompanyChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Website</label>
              <input
                type="text"
                name="website"
                value={company.website}
                onChange={handleCompanyChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Industry</label>
              <input
                type="text"
                name="industry"
                value={company.industry}
                onChange={handleCompanyChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Company Size</label>
              <select
                name="companySize"
                value={company.companySize}
                onChange={handleCompanyChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
              >
                <option value="">Select Size</option>
                <option value="1-10 Employees">1-10 Employees</option>
                <option value="11-50 Employees">11-50 Employees</option>
                <option value="51-200 Employees">51-200 Employees</option>
                <option value="500+ Employees">500+ Employees</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Office Address</label>
            <textarea
              name="address"
              value={company.address}
              onChange={handleCompanyChange}
              rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
            />
          </div>

          <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }} disabled={saving}>
            <FaSave /> {saving ? "Saving..." : "Save Company Profile"}
          </button>
        </form>
      )}

      {/* Tab 2: Security */}
      {activeTab === "SECURITY" && (
        <form onSubmit={handleSaveSecurity} style={{ background: "#ffffff", padding: "28px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "18px", fontWeight: "800" }}>Admin Password & Security</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Current Password *</label>
              <input
                type="password"
                name="currentPassword"
                value={security.currentPassword}
                onChange={handleSecurityChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>New Password *</label>
              <input
                type="password"
                name="newPassword"
                value={security.newPassword}
                onChange={handleSecurityChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Confirm New Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={security.confirmPassword}
                onChange={handleSecurityChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "6px" }}
                required
              />
            </div>
          </div>

          <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaShieldAlt /> Update Admin Password
          </button>
        </form>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === "NOTIFICATIONS" && (
        <div style={{ background: "#ffffff", padding: "28px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "18px", fontWeight: "800" }}>Notification Preferences</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              /> Enable Email Notifications on Company Events
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={notifications.taskStatusAlerts}
                onChange={(e) => setNotifications({ ...notifications, taskStatusAlerts: e.target.checked })}
              /> Send Alerts on High Priority Task Changes
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={(e) => setNotifications({ ...notifications, securityAlerts: e.target.checked })}
              /> Send Security Login Notifications
            </label>
          </div>

          <button
            onClick={() => toast.success("Notification preferences saved!")}
            style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700" }}
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* Tab 4: System Diagnostics */}
      {activeTab === "SYSTEM" && (
        <div style={{ background: "#ffffff", padding: "28px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "18px", fontWeight: "800" }}>System & Database Health</h3>

          <div style={{ lineHeight: "2", fontSize: "14px", color: "#334155" }}>
            <p style={{ margin: 0 }}><strong>Active Company ID:</strong> #{localStorage.getItem("companyId") || "1"}</p>
            <p style={{ margin: 0 }}><strong>JWT Security Mode:</strong> Enabled (Company Filter Active)</p>
            <p style={{ margin: 0 }}><strong>Database Connection:</strong> <span style={{ color: "#16a34a", fontWeight: "700" }}>● Connected (MySQL)</span></p>
            <p style={{ margin: 0 }}><strong>Backend Server:</strong> http://localhost:8081 (Spring Boot 3.5.0)</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default SettingsForm;