import React, { useState } from "react";
import styles from "./FaqPage.module.scss";
import "../../Main.scss";
import Sidebar from "../../Shared/Sidebar/Sidebar";
import FAQsControl from "../../Component/FAQsControl/FAQsControl";

export default function FaqPage() {
    // Section toggle korar jonno state
    const [activeSection, setActiveSection] = useState("faq"); // Default "faq" active 

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

            {/* RIGHT CONTENT AREA */}
            <div className={styles.right}>

                <div className={styles.section}>
                    {/* SECTION HEADER */}
                    <div
                        className={`${styles.sectionHeader} ${activeSection === "faq" ? styles.active : ""
                            }`}
                        onClick={() => toggleSection("faq")}
                    >
                        <span>All FAQs Management</span>

                        <i
                            className={`bi ${activeSection === "faq"
                                    ? "bi-chevron-up"
                                    : "bi-chevron-down"
                                }`}
                        ></i>
                    </div>

                    {/* SECTION BODY */}
                    {activeSection === "faq" && (
                        <div className={styles.sectionBody}>
                            <FAQsControl isFullPage={true} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}