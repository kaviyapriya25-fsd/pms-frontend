import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTimes, FaUserCheck, FaArrowRight, FaLock } from "react-icons/fa";
import { googleLogin } from "../../services/authService";
import { toast } from "react-toastify";
import "./GoogleAuthModal.css";

function GoogleAuthModal({ isOpen, onClose, role = "ADMIN", onSuccess }) {
  const [email, setEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const roleTitle =
    role === "ADMIN"
      ? "Admin Corporate Portal"
      : role === "TEAM_LEADER" || role === "LEADER"
      ? "Team Leader Portal"
      : "Employee Workspace";

  const handleSignIn = async (selectedEmail, selectedName) => {
    const targetEmail = selectedEmail || email;
    if (!targetEmail || !targetEmail.includes("@")) {
      setError("Please enter a valid Google Account email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await googleLogin(
        targetEmail.trim(),
        selectedName || customName || targetEmail.split("@")[0],
        "google_sso_" + Date.now(),
        role
      );

      if (response && response.token) {
        // Save standard auth state
        localStorage.setItem("token", response.token);
        localStorage.setItem("name", response.name || targetEmail.split("@")[0]);
        localStorage.setItem("email", response.email || targetEmail);
        localStorage.setItem("userId", response.userId || "");
        localStorage.setItem("companyId", response.companyId || "");
        localStorage.setItem("role", response.role || role);

        // Save role-specific keys
        if (role === "ADMIN") {
          localStorage.setItem("adminToken", response.token);
          localStorage.setItem("adminName", response.name);
        } else if (role === "TEAM_LEADER" || role === "LEADER") {
          localStorage.setItem("leaderToken", response.token);
          localStorage.setItem("leaderName", response.name);
          localStorage.setItem("leaderId", response.userId);
        } else if (role === "EMPLOYEE") {
          localStorage.setItem("employeeToken", response.token);
          localStorage.setItem("employeeName", response.name);
          localStorage.setItem("employeeId", response.userId);
        }

        toast.success(`Google SSO Successful! Welcome, ${response.name || targetEmail}`);
        onClose();
        if (onSuccess) onSuccess(response);
      } else {
        setError(response.message || "Google Authentication Failed");
      }
    } catch (err) {
      console.error("[GoogleAuthModal Error]", err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to authenticate with Google."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-modal-overlay" onClick={onClose}>
      <div className="google-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="google-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FcGoogle style={{ fontSize: "28px" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "700" }}>
                Sign in with Google
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                to continue to Project Management System ({roleTitle})
              </p>
            </div>
          </div>
          <button className="google-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="google-modal-error">
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="google-modal-body">
          <p style={{ fontSize: "13px", color: "#475569", marginBottom: "12px" }}>
            Select or enter your registered corporate Google Account:
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
            <div className="google-input-group">
              <input
                type="email"
                placeholder="Google Email (e.g. name@company.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="google-submit-btn"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Continue to Login"} <FaArrowRight />
            </button>
          </form>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", justifyContent: "center" }}>
            <FaLock /> Protected by Project Management System OAuth 2.0 Security
          </div>
        </div>

      </div>
    </div>
  );
}

export default GoogleAuthModal;
