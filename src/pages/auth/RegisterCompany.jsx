import { useState } from "react";
import { Link } from "react-router-dom";
import { registerCompany } from "../../services/authService";
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
} from "react-icons/fa";

import "./RegisterCompany.css";

import registerImage from "../../assets/images/register-company.svg";
import logo from "../../assets/logo/logo.png";

function RegisterCompany() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
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
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await registerCompany(formData);

        alert(response);

    } catch (error) {

        console.log(error);

        alert("Registration Failed");

    }

};

  return (
    <div className="register-page">

      {/* LEFT SIDE */}

      <div className="register-left">

        <img
          src={logo}
          alt="Logo"
          className="register-logo"
        />

        <h1>Create Your Company Workspace</h1>

        <p>
          Register your company and start managing projects,
          employees and tasks from one secure platform.
        </p>

        <img
          src={registerImage}
          alt="Register"
          className="register-image"
        />

      </div>

      {/* RIGHT SIDE */}

      <div className="register-right">

        <div className="register-card">

          <Link
            to="/"
            className="back-login"
          >
            <FaArrowLeft />
            Back to Login
          </Link>

          <h2>Register Company</h2>

          <p>Create your organization's admin account.</p>

          <form onSubmit={handleSubmit}>

            {/* Company */}

            <h3>Company Information</h3>

            <div className="grid">

              <div className="input-group">
                <FaBuilding className="icon" />

                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="icon" />

                <input
                  type="email"
                  name="companyEmail"
                  placeholder="Company Email"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaPhone className="icon" />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <FaGlobe className="icon" />

                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <FaIndustry className="icon" />

                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Industry
                  </option>

                  <option>IT</option>
                  <option>Software</option>
                  <option>Finance</option>
                  <option>Education</option>
                  <option>Healthcare</option>
                  <option>Construction</option>
                  <option>Manufacturing</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="input-group">
                <FaUsers className="icon" />

                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">
                    Company Size
                  </option>

                  <option>1-10</option>
                  <option>11-50</option>
                  <option>51-100</option>
                  <option>101-500</option>
                  <option>500+</option>
                </select>

              </div>

            </div>

            <div className="input-group address">

              <FaMapMarkerAlt className="icon" />

              <textarea
                name="address"
                placeholder="Company Address"
                value={formData.address}
                onChange={handleChange}
              />

            </div>

            {/* ADMIN */}

            <h3>Administrator</h3>

            <div className="grid">

              <div className="input-group">

                <FaUserTie className="icon" />

                <input
                  type="text"
                  name="adminName"
                  placeholder="Administrator Name"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <FaEnvelope className="icon" />

                <input
                  type="email"
                  name="adminEmail"
                  placeholder="Administrator Email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <FaLock className="icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <span
                  className="password-icon"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

              <div className="input-group">

                <FaLock className="icon" />

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <span
                  className="password-icon"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >
                  {showConfirm ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

            </div>

            <button
              className="register-button"
              type="submit"
            >
              Register Company

              <FaArrowRight />
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default RegisterCompany;