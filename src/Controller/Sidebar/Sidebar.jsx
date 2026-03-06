import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {

  const [isOpen, setIsOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(false);

  const location = useLocation(); // ✅ current route

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleContent = () => {
    setContentOpen(!contentOpen);
  };

  // ✅ keep dropdown open if submenu route active
  useEffect(() => {

    if (
      location.pathname === "/HomePage" ||
      location.pathname === "/about-control" ||
      location.pathname === "/contact-control"
    ) {
      setContentOpen(true);
    }

  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Button */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>

      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.open : styles.close
        }`}
      >
        <ul className="list-unstyled">

          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-speedometer2 ${styles.icon}`}></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Content Management */}
          <li>

            <div
              onClick={toggleContent}
              className={styles.dropdownTitle}
            >
              <div className={styles.dropdownLeft}>
                <i className={`bi bi-layout-text-window-reverse ${styles.icon}`}></i>
                <span>Content Management</span>
              </div>

              <i
                className={`bi ${
                  contentOpen ? "bi-chevron-up" : "bi-chevron-down"
                }`}
              ></i>
            </div>

            {contentOpen && (
              <ul className={styles.submenu}>

                <li>
                  <NavLink
                    to="/HomePage"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    Home Page
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/about-control"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    About Page
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/contact-control"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    Contact Page
                  </NavLink>
                </li>

              </ul>
            )}

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