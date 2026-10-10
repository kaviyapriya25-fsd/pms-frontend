import { Link } from "react-router-dom";
import { FaUserCircle, FaHome } from "react-icons/fa";

import NotificationBell from "../notifications/NotificationBell";

import "../../styles/navbar.css";

function Navbar() {

  const name = localStorage.getItem("name") || "Admin";

  return (

    <div className="navbar">

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div className="title">
          Project Management System
        </div>

        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            background: "rgba(99,102,241,0.12)",
            color: "#4f46e5",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
          }}
        >
          <FaHome /> Go to Home
        </Link>
      </div>

      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        <NotificationBell />

        <div className="profile">

          <FaUserCircle />

          <span>{name}</span>

        </div>

      </div>

    </div>

  );

}

export default Navbar;