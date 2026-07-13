import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaTasks,
  FaUserTie,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        PMS
      </div>

      <ul>

        <li>
          <NavLink to="/admin/dashboard">
            <FaHome />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/projects">
            <FaProjectDiagram />
            <span>Projects</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/employees">
            <FaUsers />
            <span>Employees</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/tasks">
            <FaTasks />
            <span>Tasks</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/teamleaders">
            <FaUserTie />
            <span>Team Leaders</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/reports">
            <FaChartBar />
            <span>Reports</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/notifications">
            <FaBell />
            <span>Notifications</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/settings">
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </li>

      </ul>

      <button className="logout-btn">
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;