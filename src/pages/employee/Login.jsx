import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaUsers } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../../services/api";
import { triggerGoogleLogin } from "../../services/googleAuthService";
import "./EmployeeLogin.css";

import employeeImg from "../../assets/images/employees.svg";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: "EMPLOYEE",
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("companyId", response.data.companyId);

        navigate("/employee/dashboard");
      } else {
        setError(response.data.message || "Invalid Email or Password");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    triggerGoogleLogin(
      "EMPLOYEE",
      (res) => navigate(res.role === "ADMIN" ? "/admin/dashboard" : res.role === "TEAM_LEADER" || res.role === "LEADER" ? "/leader/dashboard" : "/employee/dashboard"),
      (errMsg) => setError(errMsg)
    );
  };

  return (
    <div className="employee-login-page">
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>

      <div className="employee-login-container">

        {/* Left Side: Branding & Illustration */}
        <div className="employee-login-left">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800" }}>
              <FaUsers style={{ color: "#a7f3d0" }} /> Employee Workspace
            </div>
            <h1>Stay Focused & Track Your Daily Tasks</h1>
            <p>View your assigned tasks, update work statuses, communicate with team leaders, and report progress seamlessly.</p>
          </div>

          <img
            src={employeeImg}
            alt="Employee Workspace"
            className="employee-login-illustration"
          />

          <div style={{ fontSize: "12px", color: "#a7f3d0" }}>
            Project Management System • Member Productivity Portal
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="employee-login-right">
          <span className="employee-badge">Employee Portal</span>
          <h2>Welcome, Team Member 👋</h2>
          <p>Sign in with your employee email to view your assigned work.</p>

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
                name="email"
                placeholder="Employee Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field-group">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
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

              <Link to="/forgot-password?role=EMPLOYEE" style={{ color: "#059669", textDecoration: "none", fontWeight: "600" }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="employee-login-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Login to Employee Workspace"} <FaArrowRight />
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