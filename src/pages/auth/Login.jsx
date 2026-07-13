import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserTie,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";

import { login } from "../../services/loginService";

import "./Login.css";

import logo from "../../assets/logo/logo.png";
import loginImage from "../../assets/images/login.svg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("name", response.name);
        localStorage.setItem("role", response.role);
        localStorage.setItem("companyId", response.companyId);

        if (response.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (response.role === "TEAM_LEADER") {
          navigate("/teamleader/dashboard");
        } else if (response.role === "EMPLOYEE") {
          navigate("/employee/dashboard");
        } else {
          alert("Unknown User Role");
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message || "Login Failed");
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      <div className="login-container">

        {/* Left */}

        <div className="login-left">

          <img
            src={logo}
            alt="Logo"
            className="login-logo"
          />

          <h1>
            Project Management
            <br />
            System
          </h1>

          <p>
            Manage projects, employees and tasks
            with one intelligent platform.
          </p>

          <img
            src={loginImage}
            alt="Login"
            className="login-image"
          />

        </div>

        {/* Right */}

        <div className="login-right">

          <div className="login-card">

            <span className="login-badge">
              PMS Portal
            </span>

            <h2>Welcome Back 👋</h2>

            <p>
              Sign in to continue managing your company.
            </p>

            <form onSubmit={handleLogin}>

              <div className="input-group">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              <div className="input-group">

                <FaLock className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>

              </div>

              <div className="login-options">

                <label>

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />

                  Remember Me

                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </Link>

              </div>

              <button
                className="login-btn"
                type="submit"
              >
                Login
                <FaArrowRight />
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="other-logins">

              <button
                type="button"
                onClick={() => navigate("/employee-login")}
              >
                <FaUsers />
                Employee Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/teamleader-login")}
              >
                <FaUserTie />
                Team Leader Login
              </button>

            </div>

            <div className="register-box">

              <p>New Company?</p>

              <Link
                to="/register"
                className="register-btn"
              >
                <FaBuilding />
                Register Company
              </Link>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;