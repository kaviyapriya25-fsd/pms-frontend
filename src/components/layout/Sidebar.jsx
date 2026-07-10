import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import "../../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        PMS
      </div>

      <ul>

        <li className="active">
          <FaHome />
          Dashboard
        </li>

        <li>
          <FaProjectDiagram />
          Projects
        </li>

        <li>
          <FaTasks />
          Tasks
        </li>

        <li>
          <FaUsers />
          Employees
        </li>

        <li>
          <FaUserTie />
          Team Leaders
        </li>

        <li>
          <FaChartBar />
          Reports
        </li>

        <li>
          <FaBell />
          Notifications
        </li>

        <li>
          <FaCog />
          Settings
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