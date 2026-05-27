import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";

import {
  getAllPayments,
  getAllChild,
  getAllUsers,
} from "../../apis/api";

export default function Dashboard() {

  const [payments, setPayments] =
    useState([]);

  const [children, setChildren] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchDashboardData();

  }, []);


  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);

        // payments
        const paymentRes =
          await getAllPayments();

        // children
        const childRes =
          await getAllChild();

        // payment data
        const paymentData =
          paymentRes?.payments ||
          paymentRes?.data ||
          paymentRes ||
          [];

        // children data
        const childData =
          childRes?.children ||
          childRes?.data ||
          childRes ||
          [];

        // users
        const usersRes =
          await getAllUsers();

        const usersData =
          usersRes?.users || [];

        setUsers(usersData);

        setPayments(paymentData);
        setChildren(childData);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }


    };

  // monthly payment chart
  const monthlyData = [
    { month: "Jan", total: 0 },
    { month: "Feb", total: 0 },
    { month: "Mar", total: 0 },
    { month: "Apr", total: 0 },
    { month: "May", total: 0 },
    { month: "Jun", total: 0 },
    { month: "Jul", total: 0 },
    { month: "Aug", total: 0 },
    { month: "Sep", total: 0 },
    { month: "Oct", total: 0 },
    { month: "Nov", total: 0 },
    { month: "Dec", total: 0 },
  ];

  payments?.forEach((item) => {

    const date =
      new Date(
        item.created_at ||
        item.createdAt ||
        item.date
      );

    const month =
      date.getMonth();

    const amount =
      Number(item.amount || 0) / 100;

    if (!isNaN(month)) {

      monthlyData[month].total +=
        amount;

    }
  });

  const maxAmount =
    Math.max(
      ...monthlyData.map(
        (item) => item.total
      ),
      1
    );

  const [tooltip, setTooltip] = useState(null);

  return (
<div className={styles.container}>

  <div className="container-fluid mt-4">

    <h2 className="mb-4 text-danger">
      Kids Education Dashboard
    </h2>

    {/* Stats Cards */}
    <div className="row g-4">

      {/* Total Students */}
      <div className="col-md-3">
        <div className={`card shadow ${styles.statsCard} ${styles.red1} ${styles.barCard}`}>
          <div className="card-body">
            <h6>Total Students</h6>
            <h3>{children?.length || 0}</h3>
          </div>
        </div>
      </div>

      {/* Total Payments */}
      <div className="col-md-3">
        <div className={`card shadow ${styles.statsCard} ${styles.red2}`}>
          <div className="card-body">
            <h6>Total Earning Generated</h6>
            <h3>
              ₹{" "}
              {payments.reduce((total, item) => {
                return total + Number(item.amount || 0);
              }, 0).toFixed(0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Static */}
      <div className="col-md-3">
        <div className={`card shadow ${styles.statsCard} ${styles.red3}`}>
          <div className="card-body">
            <h6>Courses</h6>
            <h3>12</h3>
          </div>
        </div>
      </div>

      {/* Static */}
      <div className="col-md-3">
        <div className={`card shadow ${styles.statsCard} ${styles.red4}`}>
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
          <h5 className={styles.title}>Monthly User Signups</h5>

          {(() => {
            const months = [
              "Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"
            ];

            const monthlyUsers = Array(12).fill(0);

            users.forEach((user) => {
              const date = new Date(user.createdAt);
              const month = date.getMonth();
              monthlyUsers[month] += 1;
            });

            const totalUsers = monthlyUsers.reduce((a, b) => a + b, 0);

            const colors = [
              "#fd3838","#e94949","#ff0000",
              "#ff5e5e","#da3030","#fe3838",
              "#e60000","#d41010","#eb1940",
              "#da0b3c","#dc3352","#c9184a"
            ];

            let currentAngle = 0;

            const gradient = monthlyUsers
              .map((count, index) => {
                const percentage = totalUsers
                  ? (count / totalUsers) * 100
                  : 0;

                const start = currentAngle;
                const end = currentAngle + percentage;

                currentAngle = end;

                return `${colors[index]} ${start}% ${end}%`;
              })
              .join(",");

            return (
              <>
                {/* PIE */}
                <div
                  className={styles.realPie}
                  style={{
                    background: `conic-gradient(${gradient})`,
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();

                    const x =
                      e.clientX - rect.left - rect.width / 2;
                    const y =
                      e.clientY - rect.top - rect.height / 2;

                    let angle =
                      (Math.atan2(y, x) * 180) / Math.PI + 90;

                    if (angle < 0) angle += 360;

                    const index = Math.floor(angle / 30);

                    setTooltip({
                      month: months[index],
                      count: monthlyUsers[index],
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* TOOLTIP */}
                  {tooltip && (
                    <div
                      className={styles.tooltip}
                      style={{
                        top: tooltip.y,
                        left: tooltip.x,
                      }}
                    >
                      {tooltip.month} : {tooltip.count} users
                    </div>
                  )}
                </div>

                {/* LEGEND */}
                <div className={styles.legend}>
                  {monthlyUsers.map((count, index) =>
                    count > 0 ? (
                      <span
                        key={index}
                        className={styles.legendItem}
                        style={{ color: colors[index] }}
                      >
                        {months[index]} ({count})
                      </span>
                    ) : null
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="col-md-6">
        <div className={`card shadow p-3 ${styles.barCard}`}>
          <h5 className={styles.barHeading}>
            Monthly Transactions
          </h5>

          <div className={styles.bars}>
            {monthlyData.map((item, index) => {
              const height =
                (item.total / maxAmount) * 200;

              return (
                <div key={index} className={styles.barItem}>
                  <div
                    className={styles.singleBar}
                    style={{ height: `${height}px` }}
                  ></div>
                  <small>{item.month}</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>

    {/* Students Table */}
    <div className="card mt-5 shadow">

      <div className="card-body">

        <h5 className="mb-3 text-danger">
          Recent Students
        </h5>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-responsive">

            <table className={`table table-hover ${styles.table}`}>

              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {children?.length > 0 ? (

                  [...new Map(
                    children.map((item) => [
                      item.email || item._id,
                      item,
                    ])
                  ).values()].map((item, index) => {

                    const studentPayment = payments.find(
                      (pay) =>
                        pay?.email &&
                        item?.email &&
                        pay.email.toLowerCase() ===
                          item.email.toLowerCase()
                    );

                    return (
                      <tr key={index}>
                        <td>
                          {item?.fullName ||
                            item?.fullname ||
                            item?.name}
                        </td>

                        <td>{item?.age || "N/A"}</td>

                        <td>
                          {studentPayment?.description ||
                            "No Subscription"}
                        </td>

                        <td>
                          {studentPayment?.status ===
                          "captured" ? (
                            <span className={styles.badgeActive}>
                              Paid
                            </span>
                          ) : (
                            <span className={styles.badgeFailed}>
                              Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })

                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Students Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>

  </div>

</div>
  );
}