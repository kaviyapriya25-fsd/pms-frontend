import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../../styles/Login.css";
import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);

        alert("Login Successful!");

        if (data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (data.role === "LEADER") {
          navigate("/leader/dashboard");
        } else if (data.role === "EMPLOYEE") {
          navigate("/employee/dashboard");
        } else {
          alert("Unknown Role");
        }
      } else {
        alert("Invalid Email or Password");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Project Management System</h1>

        <p>
          Manage projects, teams and employees efficiently.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <p>Please login to continue</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;