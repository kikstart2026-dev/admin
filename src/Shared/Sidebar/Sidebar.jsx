import React, { useState } from "react";
import { NavLink } from "react-router-dom"; 
import styles from "./Sidebar.module.scss";
import "../../Main.scss";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <>
      {/* Hamburger Button */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>

      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.close}`}
      >
        <ul className="list-unstyled">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-speedometer2 ${styles.icon}`}></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Content Management - No Dropdown, Direct Link */}
          <li>
            <NavLink
              to="/home-page"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-layout-text-window-reverse ${styles.icon}`}></i>
              <span>Content Management</span>
            </NavLink>
          </li>

          {/* User Control */}
          <li>
            <NavLink
              to="/user-control"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-people ${styles.icon}`}></i>
              <span>User Control</span>
            </NavLink>
          </li>

          {/* Logout */}
          <li>
            <NavLink to="/logout">
              <i className={`bi bi-box-arrow-right ${styles.icon}`}></i>
              <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}