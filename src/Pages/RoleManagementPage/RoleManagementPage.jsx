import React, { useState } from "react";
import styles from "./RoleManagementPage.module.scss";
import "../../Main.scss";

import RoleManagement from "../../Component/RoleManagement/RoleManagement";

export default function RoleManagementPage() {
  const [activeSection, setActiveSection] = useState("users");

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>

        {/* HEADER */}
        <div
          className={`${styles.sectionHeader} ${
            activeSection === "users" ? styles.active : ""
          }`}
          onClick={() => toggleSection("users")}
        >
          <span>Role Management</span>

          <i
            className={`bi ${
              activeSection === "users"
                ? "bi-chevron-up"
                : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {/* BODY */}
        {activeSection === "users" && (
          <div className={styles.sectionBody}>
            <RoleManagement />
          </div>
        )}

      </div>
    </div>
  );
}