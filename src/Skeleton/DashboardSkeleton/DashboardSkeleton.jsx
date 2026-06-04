import React from "react";
import styles from "./DashboardSkeleton.module.scss";

export default function DashboardSkeleton() {
  return (
    <div className={`container-fluid mt-4 ${styles.dashboardSkeleton}`}>
      
      {/* Title */}
      <div className={styles.title}></div>

      {/* Stats Cards */}
      <div className="row g-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="col-md-3">
            <div className={styles.statsCard}></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mt-5">
        <div className="col-md-6">
          <div className={styles.chartCard}>
            <div className={styles.chartHeading}></div>
            <div className={styles.chart}></div>
          </div>
        </div>

        <div className="col-md-6">
          <div className={styles.chartCard}>
            <div className={styles.chartHeading}></div>
            <div className={styles.chart}></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeading}></div>

        <div className={styles.tableHeader}></div>

        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className={styles.tableRow}></div>
        ))}

        {/* Pagination */}
        <div className={styles.pagination}></div>
      </div>
    </div>
  );
}