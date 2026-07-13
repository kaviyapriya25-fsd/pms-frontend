import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email);

    // Later:
    // POST /forgot-password
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <Link to="/" className="back-btn">
          <FaArrowLeft />
          Back to Login
        </Link>

        <h1>Forgot Password</h1>

        <p>
          Enter your registered email address.
          We'll send you a password reset link or OTP.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="forgot-input">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Company Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <button type="submit">

            <FaPaperPlane />

            Send Reset Link

          </button>

        </form>

      </div>

    </div>
  );
}

export default ForgotPassword;