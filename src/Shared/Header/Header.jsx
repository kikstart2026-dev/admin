import React from "react";
import styles from "./Header.module.scss";
import "../../Main.scss";
import { FaUserCircle, FaBell } from "react-icons/fa";
import kiklogo from "../../assets/images/authLogo.png"
export default function Header({ title = "Dashboard" }) {
  return (
    <header className={`${styles.header} d-flex align-items-center justify-content-between`}>
      
      {/* Left - Logo */}
      <div className="d-flex align-items-center">
        <img
          src={kiklogo}// তোমার logo path দাও
          alt="logo"
          className={styles.logo}
        />
      </div>

      {/* Center - Page Title */}
      <div className={styles.pageTitle}>
        <h5>{title}</h5>
      </div>

      {/* Right - User Section */}
      <div className={`d-flex align-items-center ${styles.rightSection}`}>
        <FaBell className={styles.icon} />
        
        <div className="d-flex align-items-center ms-3">
          <FaUserCircle className={styles.userIcon} />
          <span className="ms-2">Welcome, John</span>
        </div>
      </div>

    </header>
  );
}