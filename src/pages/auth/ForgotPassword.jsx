import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { sendOtp, resendOtp, resetPassword } from "../../services/authService";
import {
  FaEnvelope,
  FaKey,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import "./ForgotPassword.css";

import forgotImage from "../../assets/images/forgot-password.svg";
import logo from "../../assets/logo/logo.png";

function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRoleParam = searchParams.get("role")?.toUpperCase();
  const isLeader = rawRoleParam === "LEADER" || rawRoleParam === "TEAM_LEADER";
  const isEmployee = rawRoleParam === "EMPLOYEE";
  const roleParam = isLeader ? "TEAM_LEADER" : rawRoleParam;

  const loginPath = isLeader ? "/leader/login" : isEmployee ? "/employee/login" : "/login";
  const portalTitle = isLeader ? "Team Leader Account Recovery" : isEmployee ? "Employee Account Recovery" : "Account Recovery & Security";

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp(email, roleParam);
      toast.success("OTP verification code sent to your real email address!");
      setStep(2);
      setTimer(120);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || err.message || "Failed to send OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resendOtp(email, roleParam);
      toast.success("Fresh OTP code sent to your real email address!");
      setTimer(120);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || err.message || "Failed to resend OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim() || otp.length < 4) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(email, otp, newPassword);
      toast.success("Password Reset Successfully!");
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Invalid OTP code or password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">

        {/* Left Illustration */}
        <div className="forgot-left">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800" }}>
              <img src={logo} alt="Logo" style={{ height: "32px" }} />
              Project Management System
            </div>
            <h1>{portalTitle}</h1>
            <p>Verify your identity with an OTP code sent directly to your registered email to reset your account password.</p>
          </div>

          <img
            src={forgotImage}
            alt="Forgot Password Recovery"
            className="forgot-image"
          />

          <div style={{ fontSize: "12px", color: "#c7d2fe" }}>
            Project Management System • Account Recovery
          </div>
        </div>

        {/* Right Form */}
        <div className="forgot-right">
          <Link to={loginPath} style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            <FaArrowLeft /> Back to Login
          </Link>

          <span className="forgot-badge">Step {step} of 3</span>

          {step === 1 && (
            <>
              <h2>Reset Your Password 🔒</h2>
              <p>Enter your registered account email address to receive a 6-digit OTP code.</p>

              {error && (
                <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "18px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOtp}>
                <div className="input-field-group">
                  <FaEnvelope className="field-icon" />
                  <input
                    type="email"
                    placeholder="Registered Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="forgot-btn" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send Verification OTP"} <FaArrowRight />
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Verify OTP & New Password 🔑</h2>
              <p>Enter the OTP code sent to <strong>{email}</strong> along with your new password.</p>

              {error && (
                <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "18px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="input-field-group">
                  <FaKey className="field-icon" />
                  <input
                    type="text"
                    placeholder="6-Digit OTP Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <div className="input-field-group">
                  <FaLock className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="input-field-group">
                  <FaLock className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", fontSize: "12px", color: "#64748b" }}>
                  <span>Resend OTP code in: <strong>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</strong></span>
                  {timer === 0 && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      style={{ background: "none", border: "none", color: "#4f46e5", fontWeight: "700", cursor: "pointer" }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button type="submit" className="forgot-btn" disabled={loading}>
                  {loading ? "Updating Password..." : "Reset Password & Login"} <FaArrowRight />
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <FaCheckCircle style={{ fontSize: "54px", color: "#16a34a", marginBottom: "14px" }} />
              <h2>Password Reset Complete!</h2>
              <p style={{ color: "#64748b", margin: "8px 0 24px 0" }}>
                Your account password has been updated successfully. You can now log in with your new credentials.
              </p>

              <button
                onClick={() => navigate(loginPath)}
                className="forgot-btn"
                style={{ width: "100%" }}
              >
                Proceed to Login <FaArrowRight />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;