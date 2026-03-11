import React from "react";
import styles from "./HomePage.module.scss"
import HomeBannerControl from "../../Component/HomeBannerControl/HomeBannerControl"
import Sidebar from "../../Component/Sidebar/Sidebar";
import "../../Main.scss";
import AboutSectionControl from "../../Component/AboutSectionControl/AboutSectionControl";


export default function HomePage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
     <Sidebar/>
      </div>

      <div className={styles.right}>
     {/* <h1>HOME PAGE</h1> */}
        <HomeBannerControl />
        <AboutSectionControl/>
      </div>
    </div>
  );
}
