import React, { useState } from "react";
import styles from "./User.module.scss";
import UserControl from "../../Component/UserControl/UserControl";

export default function User() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        {/* HEADER */}
        <div
          className={`${styles.sectionHeader} ${
            activeSection === "user" ? styles.active : ""
          }`}
          onClick={() => toggleSection("user")}
        >
          <span>User Management Control</span>

          <i
            className={`bi ${
              activeSection === "user"
                ? "bi-chevron-up"
                : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {/* BODY */}
        {activeSection === "user" && (
          <div className={styles.sectionBody}>
            <UserControl />
          </div>
        )}
      </div>
    </div>
  );
}