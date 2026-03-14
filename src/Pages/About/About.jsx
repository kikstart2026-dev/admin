import React from "react";
import styles from "./About.module.scss";
import Sidebar from "../../Shared/Sidebar/Sidebar";

export default function About() {

    return (
        <div className={styles.wrap}>
            <div className={styles.left}>
                <Sidebar />
            </div>
            <div className={styles.right}>
            </div>
        </div>);
}