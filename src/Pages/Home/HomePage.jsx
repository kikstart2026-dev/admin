import React from "react";
import styles from "./HomePage.module.scss";
import Sidebar from "../../Controller/Sidebar/Sidebar";
import HomeBannerControl from "../../Controller/HomeBannerControl/HomeBannerControl";

export default function HomePage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <Sidebar />
      </div>

      <div className={styles.right}>
        <HomeBannerControl />
      </div>
    </div>
  );
}
