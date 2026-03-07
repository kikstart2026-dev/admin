import React from "react";
import styles from "./Contact.module.scss";
import Sidebar from "../../Component/Sidebar/Sidebar";

export default function Contact() {

    return (
        <div className={styles.wrap}>
            <div className={styles.left}>
                <Sidebar />
            </div>
            <div className={styles.right}>
            </div>
        </div>);
}