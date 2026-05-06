import React, { useState } from "react";
import styles from "./PermissionManagementPage.module.scss";
import "../../Main.scss";

import PermissionManagement from "../../Component/PermissiomManagement/PermissiomManagement";

export default function PermissionManagementPage() {
  const [activeSection, setActiveSection] = useState("users");

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };


  return (
    <div className={styles.container}>

      <div className={styles.section}>

        {/* HEADER */}
        <div
          className={`${styles.sectionHeader} ${activeSection === "users" ? styles.active : ""
            }`}
          onClick={() => toggleSection("users")}
        >
          <span>Permission Management</span>

          <i
            className={`bi ${activeSection === "users"
                ? "bi-chevron-up"
                : "bi-chevron-down"
              }`}
          ></i>
        </div>

        {/* BODY */}
        {activeSection === "users" && (
          <div className={styles.sectionBody}>
            <PermissionManagement />
          </div>


        )}
      </div>

    </div>
  );
}