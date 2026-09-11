import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaUserShield,
  FaUsersCog,
  FaUserCircle,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";
import "./UnifiedLandingPage.css";

function UnifiedLandingPage() {
  const navigate = useNavigate();

  const portals = [
    {
      id: "register",
      step: "STEP 01",
      title: "Company Registration",
      subtitle: "Enterprise Setup",
      description: "Register a new company workspace, setup organization domain, and create primary Admin credentials.",
      icon: <FaBuilding />,
      badgeColor: "#6366f1",
      cardClass: "card-register",
      btnText: "Register Organization",
      path: "/register",
      features: ["Multi-Tenant Setup", "Domain Registration", "Admin Initial Access"],
    },
    {
      id: "admin",
      step: "STEP 02 • OPTION A",
      title: "Admin Console",
      subtitle: "System Oversight",
      description: "Comprehensive administration portal for project management, employee tracking, and analytics.",
      icon: <FaUserShield />,
      badgeColor: "#2563eb",
      cardClass: "card-admin",
      btnText: "Admin Login Portal",
      path: "/login",
      features: ["Company Analytics", "Manage Leaders & Staff", "Executive PDF Reports"],
    },
    {
      id: "leader",
      step: "STEP 02 • OPTION B",
      title: "Leader Portal",
      subtitle: "Team Management",
      description: "Dedicated workspace for Team Leaders to assign tasks, monitor sprints, and manage project members.",
      icon: <FaUsersCog />,
      badgeColor: "#7c3aed",
      cardClass: "card-leader",
      btnText: "Team Leader Sign In",
      path: "/leader/login",
      features: ["Task Assignment", "Agile Kanban Board", "Team Performance"],
    },
    {
      id: "employee",
      step: "STEP 02 • OPTION C",
      title: "Employee Portal",
      subtitle: "Work Deliverables",
      description: "Streamlined dashboard for employees to track assigned tasks, log work hours, and advance status.",
      icon: <FaUserCircle />,
      badgeColor: "#059669",
      cardClass: "card-employee",
      btnText: "Employee Login Portal",
      path: "/employee/login",
      features: ["My Workload", "Time Logger & Worklog", "Kanban Stage Advance"],
    },
  ];

  return (
    <div className="portal-landing-wrapper">
      
      {/* Background Animated Glow Elements */}
      <div className="bg-glow orb-blue"></div>
      <div className="bg-glow orb-purple"></div>
      <div className="bg-glow orb-emerald"></div>

      <div className="portal-landing-container">
        
        {/* Header Section */}
        <div className="portal-hero-header">
          <div className="hero-badge">
            <FaRocket style={{ color: "#3b82f6" }} /> PROJECT MANAGEMENT SYSTEM
          </div>
          <h1 className="hero-title">One Platform. Total Project Control.</h1>
          <p className="hero-subtitle">
            Plan projects, assign tasks, track team progress, and deliver results on time — all from a single, powerful workspace.
          </p>
        </div>

        {/* 4 Interactive Portal Cards Grid */}
        <div className="portals-grid">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className={`portal-card ${portal.cardClass}`}
              onClick={() => navigate(portal.path)}
            >
              {/* Card Step Badge */}
              <div className="card-top-bar">
                <span className="card-step-badge">{portal.step}</span>
                <span className="card-subtitle-tag">{portal.subtitle}</span>
              </div>

              {/* Card Icon */}
              <div className="portal-icon-wrapper">
                {portal.icon}
              </div>

              {/* Title & Description */}
              <h2 className="portal-card-title">{portal.title}</h2>
              <p className="portal-card-desc">{portal.description}</p>

              {/* Feature Highlights */}
              <ul className="portal-features-list">
                {portal.features.map((feat, idx) => (
                  <li key={idx}>
                    <FaCheckCircle className="feat-check-icon" /> {feat}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="portal-card-footer">
                <button
                  className="portal-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(portal.path);
                  }}
                >
                  <span>{portal.btnText}</span>
                  <FaArrowRight className="arrow-icon" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Footer Security Banner */}
        <div className="portal-footer-security">
          <div className="security-item">
            <FaLock style={{ color: "#16a34a" }} /> <span>256-Bit SSL Encrypted Workspace Session</span>
          </div>
          <div className="security-item">
            <FaShieldAlt style={{ color: "#2563eb" }} /> <span>Project Management System • All Rights Reserved</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default UnifiedLandingPage;
