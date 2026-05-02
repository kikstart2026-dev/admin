import React, { useState } from "react";
import styles from "./PermissionManagementPage.module.scss";
import "../../Main.scss";
import PermissionManagement from "../../Component/PermissiomManagement/PermissiomManagement";
import Sidebar from "../../Shared/Sidebar/Sidebar";

export default function PermissionManagementPage() {
  // ✅ section toggle
  const [activeSection, setActiveSection] = useState("users");

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className={styles.wrap}>
      {/* LEFT SIDEBAR */}
      <div className={styles.left}>
        <Sidebar />
      </div>

      {/* RIGHT CONTENT */}
      <div className={styles.right}>
        <div className={styles.section}>
          
          {/* HEADER */}
          <div
            className={`${styles.sectionHeader} ${
              activeSection === "users" ? styles.active : ""
            }`}
            onClick={() => toggleSection("users")}
          >
            <span>Permission Management</span>

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
              <PermissionManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}