import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; // use for create Navigation link
import styles from "./Sidebar.module.scss";
import "../../Main.scss";

export default function Sidebar() {

  const [isOpen, setIsOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(false);

  const location = useLocation(); //for current route path

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // for toggle open close
  };

  const toggleContent = () => {
    setContentOpen(!contentOpen);
  };

  // ✅ submenu route active থাকলে dropdown open থাকবে
  useEffect(() => {
    if (
      location.pathname === "/home-page" ||
      location.pathname === "/about-control" ||
      location.pathname === "/contact-control"
    ) //check the users current path // run after hook component render 
    {
      setContentOpen(true); //open dropdown automatically 
    }
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Button */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>

      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.close
          }`}
      >
        {/* Bullet remove */}
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
                className={`bi ${contentOpen ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
              ></i>
            </div>

            {contentOpen && (
              <ul className={styles.submenu}>

                <li>
                  <NavLink
                    to="/home-page"
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