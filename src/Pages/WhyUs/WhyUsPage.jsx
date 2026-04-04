import React, { useState } from "react";
import styles from "../FaqPage/FaqPage.module.scss";
import "../../Main.scss";
import Sidebar from "../../Shared/Sidebar/Sidebar";
import WhyUsControl from "../../Component/WhyUsControl/WhyUsControl";

export default function InterestedSchoolsPage() {

    // Section toggle
    const [activeSection, setActiveSection] = useState("schools");

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
                            activeSection === "schools" ? styles.active : ""
                        }`}
                        onClick={() => toggleSection("schools")}
                    >
                        <span>Why Us Management</span>

                        <i
                            className={`bi ${
                                activeSection === "schools"
                                    ? "bi-chevron-up"
                                    : "bi-chevron-down"
                            }`}
                        ></i>
                    </div>

                    {/* BODY */}
                    {activeSection === "schools" && (
                        <div className={styles.sectionBody}>
                            {/* ✅ same as FAQ */}
                            <WhyUsControl isFullPage={true} />
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}