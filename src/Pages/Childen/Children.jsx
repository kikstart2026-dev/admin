import React, { useState } from "react";

import styles from "./Children.module.scss";

import ChildrenControl from "../../Component/ChildrenControl/ChildrenControl";

export default function Children() {

  const [activeSection, setActiveSection] =
    useState(null);


  const toggleSection = (section) => {
    setActiveSection((prev) =>
      prev === section ? null : section
    );
  };


  return (
    <div className={styles.container}>

      <div className={styles.section}>

        {/* HEADER */}

        <div
          className={`${styles.sectionHeader} ${
            activeSection === "children"
              ? styles.active
              : ""
          }`}
          onClick={() =>
            toggleSection("children")
          }
        >

          <span>
            Children Management Control
          </span>


          <i
            className={`bi ${
              activeSection === "children"
                ? "bi-chevron-up"
                : "bi-chevron-down"
            }`}
          ></i>


        </div>


        {/* BODY */}

        {
          activeSection === "children" && (

            <div className={styles.sectionBody}>

              <ChildrenControl />

            </div>

          )
        }


      </div>

    </div>
  );
}