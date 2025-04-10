import React from 'react';
import './SideBar.css';

function SideBar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <ul className="sidebar-menu">
        <li><a href="/dashboard/overview">Overview</a></li>
        <li><a href="/dashboard/userlist">User List</a></li>
        <li><a href="/dashboard/productlist">Product List</a></li>
        {/* <li><a href="/dashboard/settings">Settings</a></li> */}
      </ul>
    </div>
  );
}

export default SideBar;
