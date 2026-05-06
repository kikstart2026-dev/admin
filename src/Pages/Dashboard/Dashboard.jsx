import React from "react";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <div className="container-fluid mt-4">

        <h2 className="mb-4 text-danger">Kids Education Dashboard</h2>

        {/* Stats Cards */}
        <div className="row g-4">
          <div className="col-md-3">
            <div className={`card shadow ${styles.statsCard}`} style={{ backgroundColor: "#ff4d4d" }}>
              <div className="card-body">
                <h6>Total Students</h6>
                <h3>350</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={`card shadow ${styles.statsCard}`} style={{ backgroundColor: "#ff6666" }}>
              <div className="card-body">
                <h6>Courses</h6>
                <h3>12</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={`card shadow ${styles.statsCard}`} style={{ backgroundColor: "#ff3333" }}>
              <div className="card-body">
                <h6>Teachers</h6>
                <h3>8</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={`card shadow ${styles.statsCard}`} style={{ backgroundColor: "#e60000" }}>
              <div className="card-body">
                <h6>Active Classes</h6>
                <h3>15</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row mt-5">

          {/* Pie Chart */}
          <div className="col-md-6">
            <div className={`${styles.pieCard} card shadow`}>
              <h5 className={styles.title}>Students by Subject</h5>

              <div className={styles.pie}></div>

              <div className={styles.legend}>
                <span className={styles.math}>Math</span>
                <span className={styles.english}>English</span>
                <span className={styles.science}>Science</span>
                <span className={styles.art}>Art</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-md-6">
            <div className="card shadow p-3">
              <h5 className="mb-3">Monthly Enrollments</h5>

              <div className={styles.bars}>
                <div style={{ height: "50px", background: "#ff4d4d" }}></div>
                <div style={{ height: "70px", background: "#ff6666" }}></div>
                <div style={{ height: "60px", background: "#ff9999" }}></div>
                <div style={{ height: "90px", background: "#ff3333" }}></div>
                <div style={{ height: "80px", background: "#ff6666" }}></div>
                <div style={{ height: "100px", background: "#ff4d4d" }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Table */}
        <div className="card mt-5 shadow">
          <div className="card-body">
            <h5 className="mb-3 text-danger">Recent Students</h5>

            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Emma</td>
                  <td>7</td>
                  <td>Math Basics</td>
                  <td><span className="badge bg-danger">Active</span></td>
                </tr>

                <tr>
                  <td>Liam</td>
                  <td>8</td>
                  <td>English Grammar</td>
                  <td><span className="badge bg-danger">New</span></td>
                </tr>

                <tr>
                  <td>Noah</td>
                  <td>6</td>
                  <td>Science Fun</td>
                  <td><span className="badge bg-danger">Trial</span></td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}