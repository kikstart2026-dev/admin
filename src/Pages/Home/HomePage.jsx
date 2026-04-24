import React, { useState } from "react";
import styles from "./HomePage.module.scss";
import HomeBannerControl from "../../Component/HomeBannerControl/HomeBannerControl";
import TestimonialControl from "../../Component/Testimonial/TestimonailControl";
import Sidebar from "../../Shared/Sidebar/Sidebar";
import "../../Main.scss";
import WhyChooseUsControl from "../../Component/WhyChooseUsControl/WhyChooseUsControl";
import AboutSectionControl from "../../Component/AboutSectionControl/AboutSectionControl";
import ServiceControl from "../../Component/ServiceControl/ServiceControl";
import FAQsControl from "../../Component/FAQsControl/FAQsControl";
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

        {/* HOME BANNER */}
        <div className={styles.section}>
          <div
            className={`${styles.sectionHeader} ${activeSection === "banner" ? styles.active : ""
              }`}
            onClick={() => toggleSection("banner")}
          >
            <span>Home Banner Control</span>

            <i
              className={`bi ${activeSection === "banner"
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

        {/* ABOUT US */}
        <div className={styles.section}>
          <div
            className={`${styles.sectionHeader} ${activeSection === "about-us" ? styles.active : ""
              }`}
            onClick={() => toggleSection("about-us")}
          >
            <span>About Us Control</span>

            <i
              className={`bi ${activeSection === "about-us"
                ? "bi-chevron-up"
                : "bi-chevron-down"
                }`}
            ></i>
          </div>

          {activeSection === "about-us" && (
            <div className={styles.sectionBody}>
              <AboutSectionControl />
            </div>
          )}
        </div>

        {/* Why Choose Us */}
        <div className={styles.section}>
          <div
            className={`${styles.sectionHeader} ${activeSection === "why-choose-us" ? styles.active : ""
              }`}
            onClick={() => toggleSection("why-choose-us")}
          >
            <span>Why Choose Us Control</span>

            <i
              className={`bi ${activeSection === "why-choose-us"
                ? "bi-chevron-up"
                : "bi-chevron-down"
                }`}
            ></i>
          </div>

          {activeSection === "why-choose-us" && (
            <div className={styles.sectionBody}>
              <WhyChooseUsControl />
            </div>
          )}
        </div>

        {/* service */}
        <div className={styles.section}>
          <div
            className={`${styles.sectionHeader} ${activeSection === "service" ? styles.active : ""
              }`}
            onClick={() => toggleSection("service")}
          >
            <span>Service Control</span>

            <i
              className={`bi ${activeSection === "service"
                ? "bi-chevron-up"
                : "bi-chevron-down"
                }`}
            ></i>
          </div>

          {activeSection === "service" && (
            <div className={styles.sectionBody}>
              <ServiceControl />
            </div>
          )}
        </div>

        {/* TESTIMONIAL */}
        <div className={styles.section}>
          <div
            className={`${styles.sectionHeader} ${activeSection === "testimonial" ? styles.active : ""
              }`}
            onClick={() => toggleSection("testimonial")}
          >
            <span>Testimonial Control</span>

            <i
              className={`bi ${activeSection === "testimonial"
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

        {/* FAQ */}

        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection("faq")}>
            <span>FAQ Control</span>
            <i className={`bi ${activeSection === "faq" ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
          </div>

          {/* FAQ Control Section in HomePage */}
          {activeSection === "faq" && (
            <div className={styles.sectionBody}>
              <FAQsControl limit={5} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}