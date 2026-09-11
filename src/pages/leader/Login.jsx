import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaUserTie } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginTeamLeader } from "../../services/teamLeaderAuthService";
import GoogleAuthModal from "../../components/common/GoogleAuthModal";
import "./LeaderLogin.css";

import teamleaderImg from "../../assets/images/teamleader.svg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginTeamLeader(email, password);

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("leaderToken", response.token);
        localStorage.setItem("name", response.name);
        localStorage.setItem("leaderName", response.name);
        localStorage.setItem("email", response.email);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("leaderId", response.userId);
        localStorage.setItem("companyId", response.companyId);
        localStorage.setItem("role", response.role);

        navigate("/leader/dashboard");
      } else {
        setError(response.message || "Invalid Email or Password");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleModalOpen(true);
  };

  return (
    <div className="leader-login-page">
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>

      <div className="leader-login-container">

        {/* Left Side: Branding & Illustration */}
        <div className="leader-login-left">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800" }}>
              <FaUserTie style={{ color: "#a5b4fc" }} /> PMS Leader Workspace
            </div>
            <h1>Empower Your Team & Lead Projects</h1>
            <p>Assign tasks, track progress, manage team deliverables, and keep projects on schedule.</p>
          </div>

          <img
            src={teamleaderImg}
            alt="Team Leader Workspace"
            className="leader-login-illustration"
          />

          <div style={{ fontSize: "12px", color: "#a5b4fc" }}>
            Project Management System • Team Leader Management Console
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="leader-login-right">
          <span className="leader-badge">Team Leader Login</span>
          <h2>Welcome Back, Leader 👋</h2>
          <p>Sign in with your team leader credentials to access your workspace.</p>

          {error && (
            <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "18px" }}>
              {error}
            </div>
          )}

          {/* Continue with Google */}
          <button type="button" className="google-btn" onClick={handleGoogleLogin} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#fff", border: "1.5px solid #cbd5e1", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "18px" }}>
            <FcGoogle style={{ fontSize: "20px" }} /> Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
            <div style={{ flex: 1, borderBottom: "1px solid #e2e8f0" }}></div>
            <span style={{ padding: "0 10px" }}>OR LOGIN WITH EMAIL</span>
            <div style={{ flex: 1, borderBottom: "1px solid #e2e8f0" }}></div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-field-group">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                placeholder="Team Leader Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field-group">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", fontSize: "13px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#475569" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                /> Remember Me
              </label>

              <Link to="/forgot-password?role=LEADER" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "600" }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="leader-login-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Login to Leader Console"} <FaArrowRight />
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link to="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaArrowLeft /> Back to Workspace Portal
            </Link>
          </div>
        </div>

      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        role="TEAM_LEADER"
        onSuccess={(res) => navigate(res.role === "ADMIN" ? "/admin/dashboard" : res.role === "TEAM_LEADER" || res.role === "LEADER" ? "/leader/dashboard" : "/employee/dashboard")}
      />
    </div>
  );
}

export default Login;