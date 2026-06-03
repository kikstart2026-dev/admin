import React from "react";
import styles from "./DashboardSkeleton.module.scss";

export default function DashboardSkeleton() {
  return (
    <div className={styles.dashboardSkeleton}>

      <div className={styles.title}></div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className={styles.card}></div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartGrid}>

        <div className={styles.chartCard}>
          <div className={styles.heading}></div>
          <div className={styles.pie}></div>

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={styles.legend}
            ></div>
          ))}
        </div>

        <div className={styles.chartCard}>
          <div className={styles.heading}></div>

          <div className={styles.barWrapper}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div
                key={item}
                className={styles.bar}
              ></div>
            ))}
          </div>
        </div>

      </div>

      {/* Table */}
      <div className={styles.tableCard}>

        <div className={styles.heading}></div>

        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className={styles.tableRow}
          ></div>
        ))}

      </div>

    </div>
  );
}