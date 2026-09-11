import {
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import NotificationBell from "../notifications/NotificationBell";

import "../../styles/navbar.css";

function Navbar() {

  const name = localStorage.getItem("name") || "Admin";

  return (

    <div className="navbar">

      <div className="title">
        Project Management System
      </div>

      <div className="search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />

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