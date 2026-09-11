import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerCompany, sendRegistrationOtp, verifyRegistrationOtp } from "../../services/authService";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaIndustry,
  FaUsers,
  FaMapMarkerAlt,
  FaUserTie,
  FaLock,
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaShieldAlt,
  FaRocket,
  FaKey,
  FaPaperPlane,
} from "react-icons/fa";
import "./RegisterCompany.css";
import logo from "../../assets/logo/logo.png";

function RegisterCompany() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    website: "",
    industry: "IT & Software",
    companySize: "11-50 Employees",
    address: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "adminEmail" && isEmailVerified) {
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpCode("");
    }
  };

  const handleSendOtp = async () => {
    if (!formData.adminEmail || !formData.adminEmail.includes("@")) {
      setError("Please enter a valid Admin Login Email first.");
      toast.error("Please enter a valid Admin Email first.");
      return;
    }
    setSendingOtp(true);
    setError("");
    try {
      await sendRegistrationOtp(formData.adminEmail);
      setOtpSent(true);
      toast.success(`OTP Verification Code sent to ${formData.adminEmail}! Check your inbox.`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Failed to send OTP";
      setError(msg);
      toast.error("Failed to send OTP: " + msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }
    setVerifyingOtp(true);
    setError("");
    try {
      await verifyRegistrationOtp(formData.adminEmail, otpCode.trim());
      setIsEmailVerified(true);
      toast.success("✓ Admin Email Verified Successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Invalid OTP code";
      setError(msg);
      toast.error("OTP Verification Failed: " + msg);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyEmail || !formData.adminEmail) {
      setError("Both Company Email and Admin Email are required.");
      toast.error("Both Company Email and Admin Email are required.");
      return;
    }

    if (!isEmailVerified) {
      setError("Please verify your Admin Email via OTP before registering to prevent email misuse.");
      toast.error("Admin Email Verification Required!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      toast.error("Password too short.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerCompany({
        companyName: formData.companyName,
        adminName: formData.adminName,
        companyEmail: formData.companyEmail,
        adminEmail: formData.adminEmail,
        password: formData.password,
        phone: formData.phone,
        website: formData.website,
        industry: formData.industry,
        companySize: formData.companySize,
        address: formData.address,
      });

      // Backend returns a plain string — check it explicitly
      if (typeof response === "string" && !response.startsWith("Company Registered")) {
        setError(response);
        toast.error(response);
        return;
      }

      toast.success("Organization Registered Successfully! Please login as Admin.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Registration Failed";
      setError(msg);
      toast.error("Registration Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-pro-wrapper">
      
      {/* Background Glow Orbs */}
      <div className="glow-orb orb-indigo"></div>
      <div className="glow-orb orb-blue"></div>

      <div className="reg-pro-container">
        
        {/* Navigation Bar */}
        <div className="reg-pro-nav">
          <Link to="/" className="back-portal-link">
            <FaArrowLeft /> Back to Workspace Portal
          </Link>
          <div className="brand-badge">
            <img src={logo} alt="Logo" style={{ height: "26px" }} />
            <span>Multi-Tenant Enterprise Portal</span>
          </div>
        </div>

        {/* Form Card Grid */}
        <div className="reg-pro-card">
          
          {/* Header Banner */}
          <div className="reg-card-header">
            <div className="header-icon-box">
              <FaRocket />
            </div>
            <div>
              <h2>Create Company Workspace</h2>
              <p>Setup your isolated multi-tenant organization and primary admin credentials</p>
            </div>
          </div>

          {error && (
            <div className="reg-error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reg-main-form">
            
            {/* SECTION 1: Organization Details */}
            <div className="form-section-card">
              <div className="section-header">
                <FaBuilding className="sec-icon" />
                <h3>1. Organization Details</h3>
              </div>

              <div className="inputs-grid-2">
                <div className="field-box">
                  <label>Company Name *</label>
                  <div className="input-with-icon">
                    <FaBuilding className="f-icon" />
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Acme Software Corp"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field-box">
                  <label>Company Email *</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="f-icon" />
                    <input
                      type="email"
                      name="companyEmail"
                      placeholder="org@company.com"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field-box">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <FaPhone className="f-icon" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field-box">
                  <label>Company Website</label>
                  <div className="input-with-icon">
                    <FaGlobe className="f-icon" />
                    <input
                      type="text"
                      name="website"
                      placeholder="https://company.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field-box">
                  <label>Industry *</label>
                  <div className="input-with-icon">
                    <FaIndustry className="f-icon" />
                    <select name="industry" value={formData.industry} onChange={handleChange} required>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Construction">Construction</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="field-box">
                  <label>Company Size *</label>
                  <div className="input-with-icon">
                    <FaUsers className="f-icon" />
                    <select name="companySize" value={formData.companySize} onChange={handleChange} required>
                      <option value="1-10 Employees">1-10 Employees</option>
                      <option value="11-50 Employees">11-50 Employees</option>
                      <option value="51-100 Employees">51-100 Employees</option>
                      <option value="101-500 Employees">101-500 Employees</option>
                      <option value="500+ Employees">500+ Employees</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field-box full-width" style={{ marginTop: "14px" }}>
                <label>Office Address</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="f-icon text-area-icon" />
                  <textarea
                    name="address"
                    placeholder="Enter corporate office address..."
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Primary Admin Credentials */}
            <div className="form-section-card">
              <div className="section-header">
                <FaUserTie className="sec-icon" />
                <h3>2. Primary Admin Credentials</h3>
              </div>

              <div className="inputs-grid-2">
                <div className="field-box">
                  <label>Admin Full Name *</label>
                  <div className="input-with-icon">
                    <FaUserTie className="f-icon" />
                    <input
                      type="text"
                      name="adminName"
                      placeholder="Admin Name"
                      value={formData.adminName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label>Admin Login Email *</label>
                    {isEmailVerified ? (
                      <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaCheckCircle /> Email Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendingOtp || !formData.adminEmail}
                        style={{
                          background: "#4f46e5", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "6px",
                          fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px"
                        }}
                      >
                        <FaPaperPlane /> {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                  </div>
                  <div className="input-with-icon">
                    <FaEnvelope className="f-icon" />
                    <input
                      type="email"
                      name="adminEmail"
                      placeholder="admin@company.com"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      readOnly={isEmailVerified}
                      required
                    />
                  </div>
                </div>

                {otpSent && !isEmailVerified && (
                  <div className="field-box full-width" style={{ marginTop: "10px", background: "#f0f9ff", padding: "14px", borderRadius: "10px", border: "1px solid #bae6fd" }}>
                    <label style={{ color: "#0369a1", fontWeight: "700" }}>Enter 6-Digit Email Verification OTP *</label>
                    <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                      <div className="input-with-icon" style={{ flex: 1 }}>
                        <FaKey className="f-icon" />
                        <input
                          type="text"
                          placeholder="e.g. 123456"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          maxLength={6}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyingOtp}
                        style={{
                          background: "#16a34a", color: "#ffffff", border: "none", padding: "0 18px", borderRadius: "8px",
                          fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        <FaCheckCircle /> {verifyingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                    <span style={{ fontSize: "12px", color: "#64748b", marginTop: "6px", display: "block" }}>
                      Check your Gmail inbox for the 6-digit verification code sent to <strong>{formData.adminEmail}</strong>.
                    </span>
                  </div>
                )}

                <div className="field-box">
                  <label>Password *</label>
                  <div className="input-with-icon">
                    <FaLock className="f-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className="eye-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="field-box">
                  <label>Confirm Password *</label>
                  <div className="input-with-icon">
                    <FaLock className="f-icon" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className="eye-toggle-btn" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="reg-action-bar">
              <div className="security-note">
                <FaShieldAlt style={{ color: "#10b981" }} />
                <span>256-Bit SSL Encrypted Account Provisioning</span>
              </div>

              <button type="submit" className="pro-submit-btn" disabled={loading}>
                <span>{loading ? "Creating Workspace..." : "Create & Register Organization"}</span>
                <FaArrowRight />
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default RegisterCompany;