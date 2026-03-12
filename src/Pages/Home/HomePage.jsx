import React, { useState } from "react";
import styles from "./HomePage.module.scss";
import HomeBannerControl from "../../Component/HomeBannerControl/HomeBannerControl";
import TestimonialControl from "../../Component/Testimonial/TestimonailControl";
import Sidebar from "../../Shared/Sidebar/Sidebar";
import "../../Main.scss";
import AboutSectionControl from "../../Component/AboutSectionControl/AboutSectionControl";

export default function HomePage() {

  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <Sidebar />
      </div>

      <div className={styles.right}>
     {/* <h1>HOME PAGE</h1> */}
        <HomeBannerControl />
        <AboutSectionControl/>

        {/* HOME BANNER */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection("banner")}
          >
            <span>Home Banner Control</span>

            <i
              className={`bi ${
                activeSection === "banner"
                  ? "bi-chevron-up"
                  : "bi-chevron-down"
              }`}
            ></i>
          </div>

          {activeSection === "banner" && (
            <div className={styles.sectionBody}>
              <HomeBannerControl />
            </div>
          )}
        </div>

        {/* TESTIMONIAL */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection("testimonial")}
          >
            <span>Testimonial Control</span>

            <i
              className={`bi ${
                activeSection === "testimonial"
                  ? "bi-chevron-up"
                  : "bi-chevron-down"
              }`}
            ></i>
          </div>

          {activeSection === "testimonial" && (
            <div className={styles.sectionBody}>
              <TestimonialControl />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}