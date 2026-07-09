import { FaUser, FaLock } from "react-icons/fa";
import "../../styles/Login.css";

function Login() {
  return (
    <div className="login-container">

      <div className="login-left">
        <h1>Project Management System</h1>
        <p>
          Manage projects, teams, and tasks efficiently with a modern
          Project Management System.
        </p>
      </div>

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p>Please login to continue</p>

          <div className="input-group">
            <FaUser />
            <input
              type="email"
              placeholder="Email Address"
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
            />
          </div>

          <div className="remember">

            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <a href="#">Forgot Password?</a>

          </div>

          <button className="login-btn">
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;