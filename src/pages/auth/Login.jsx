import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "../../styles/Login.css";
import { loginUser } from "../../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        console.log("Email:", email);
        console.log("Password:", password);

        try {

            const data = await loginUser(email, password);

            console.log("Backend Response:", data);

            if (data && data.token) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("name", data.name);
                localStorage.setItem("role", data.role);

                alert("Login Successful!");

                // Next step we'll replace this with React Router
                console.log("Role:", data.role);

            } else {

                alert("Invalid Email or Password");

            }

        } catch (error) {

            console.error("Login Error:", error);

            alert("Invalid Email or Password");

        }

    };

    return (

        <div className="login-container">

            <div className="login-left">

                <h1>Project Management System</h1>

                <p>
                    Manage projects, teams, and tasks efficiently with a
                    modern Project Management System.
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

                        <div className="remember">

                            <label>

                                <input type="checkbox" />

                                Remember Me

                            </label>

                            <a href="#">Forgot Password?</a>

                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Login;