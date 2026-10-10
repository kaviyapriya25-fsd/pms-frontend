import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaUserTie,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { login } from "../../services/loginService";
import { triggerGoogleLogin } from "../../services/googleAuthService";
import "./Login.css";

import logo from "../../assets/logo/logo.png";
import pmsHero from "../../assets/images/pms_hero.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password, "ADMIN");

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("name", response.name);
        localStorage.setItem("email", response.email);
        localStorage.setItem("role", response.role);
        localStorage.setItem("companyId", response.companyId);

        if (remember) {
          localStorage.setItem("rememberMe", "true");
        }

        if (response.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (response.role === "TEAM_LEADER") {
          navigate("/leader/dashboard");
        } else if (response.role === "EMPLOYEE") {
          navigate("/employee/dashboard");
        } else {
          setError("Unknown User Role");
        }
      } else {
        setError(response.message || "Invalid Admin Credentials");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    triggerGoogleLogin(
      "ADMIN",
      (res) => navigate(res.role === "ADMIN" ? "/admin/dashboard" : res.role === "TEAM_LEADER" ? "/leader/dashboard" : "/employee/dashboard"),
      (errMsg) => setError(errMsg)
    );
  };

  return (
    <div className="login-page">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      <div className="login-container">

        {/* Left Side: Branding & Illustration */}
        <div className="login-left">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800" }}>
              <img src={logo} alt="Logo" style={{ height: "32px", width: "auto" }} />
              Project Management System
            </div>
            <h1>Your All-in-One Project Management Platform</h1>
            <p>Plan, track, and deliver projects on time. Manage teams, assign tasks, monitor progress, and generate insightful reports — all in one workspace.</p>
          </div>

          <img
            src={pmsHero}
            alt="Project Management System"
            className="login-image"
            style={{ borderRadius: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
          />

          <div style={{ fontSize: "12px", color: "#bfdbfe" }}>
            Project Management System • Admin Control Console
          </div>
        </div>

        {/* Right Side: Admin Form */}
        <div className="login-right">
          <span className="admin-badge">Admin Portal</span>
          <h2>Admin Sign In 👋</h2>
          <p>Sign in with your company admin credentials to manage your workspace.</p>

          {error && (
            <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "18px" }}>
              {error}
            </div>
          )}

          {/* Continue with Google */}
          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <FcGoogle style={{ fontSize: "20px" }} /> Continue with Google
          </button>

          <div className="divider-line">
            <span>OR LOGIN WITH EMAIL</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-field-group">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                placeholder="Admin Email Address"
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", fontSize: "13px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#475569" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                /> Remember Me
              </label>

              <Link to="/forgot-password?role=ADMIN" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In to Admin Dashboard"} <FaArrowRight />
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link to="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaArrowLeft /> Back to Workspace Portal
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Login;