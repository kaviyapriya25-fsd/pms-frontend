import {
FaBell,
FaSearch,
FaUserCircle
} from "react-icons/fa";

import "../../styles/navbar.css";

function Navbar(){

return(

<div className="navbar">

<div className="title">

Project Management System

</div>

<div className="search">

<FaSearch/>

<input
placeholder="Search..."
/>

</div>

<div className="nav-right">

<FaBell className="icon"/>

<div className="profile">

<FaUserCircle/>

<span>Admin</span>

</div>

</div>

</div>

);

}

export default Navbar;