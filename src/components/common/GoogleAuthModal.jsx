import { FcGoogle } from "react-icons/fc";
import { FaTimes, FaLock } from "react-icons/fa";
import { googleLogin } from "../../services/authService";
import { toast } from "react-toastify";
import { useState, useCallback } from "react";
import "./GoogleAuthModal.css";

const GOOGLE_CLIENT_ID =
  "735956371916-7123jdc3ukfuekd4t59taeqoknfomtsj.apps.googleusercontent.com";

function GoogleAuthModal({ isOpen, onClose, role = "ADMIN", onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ All hooks MUST be before any early return
  const handleGoogleResponse = useCallback(
    async (accessToken) => {
      setLoading(true);
      setError("");
      try {
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const userInfo = await userInfoRes.json();
        const { email, name, sub: googleId } = userInfo;

        const response = await googleLogin(email, name, googleId, role);

        if (response && response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("name", response.name || name);
          localStorage.setItem("email", response.email || email);
          localStorage.setItem("userId", response.userId || "");
          localStorage.setItem("companyId", response.companyId || "");
          localStorage.setItem("role", response.role || role);

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

          toast.success(`Welcome, ${response.name || name}! 🎉`);
          onClose();
          if (onSuccess) onSuccess(response);
        } else {
          setError(
            response?.message ||
              "Google Authentication Failed. Make sure your account is registered in the system."
          );
        }
      } catch (err) {
        console.error("[GoogleAuthModal Error]", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to authenticate with Google."
        );
      } finally {
        setLoading(false);
      }
    },
    [role, onClose, onSuccess]
  );

  const triggerGoogleLogin = useCallback(() => {
    const google = window.google;
    if (!google) {
      setError("Google Sign-In is not loaded yet. Please refresh the page.");
      return;
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          setError("Google sign-in was cancelled or failed. Please try again.");
          return;
        }
        handleGoogleResponse(tokenResponse.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  }, [handleGoogleResponse]);

  // ✅ Early return AFTER all hooks
  if (!isOpen) return null;

  const roleTitle =
    role === "ADMIN"
      ? "Admin Corporate Portal"
      : role === "TEAM_LEADER" || role === "LEADER"
      ? "Team Leader Portal"
      : "Employee Workspace";

  return (
    <div className="google-modal-overlay" onClick={onClose}>
      <div
        className="google-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="google-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FcGoogle style={{ fontSize: "28px" }} />
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: "#1e293b",
                  fontWeight: "700",
                }}
              >
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

        {/* Error */}
        {error && <div className="google-modal-error">{error}</div>}

        {/* Body */}
        <div className="google-modal-body">
          <p
            style={{
              fontSize: "13px",
              color: "#475569",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Click below to select your Google account
          </p>

          <button
            className="google-submit-btn"
            onClick={triggerGoogleLogin}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <FcGoogle style={{ fontSize: "20px" }} />
            {loading ? "Authenticating..." : "Choose Google Account"}
          </button>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#94a3b8",
              justifyContent: "center",
            }}
          >
            <FaLock /> Protected by Google OAuth 2.0
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthModal;
