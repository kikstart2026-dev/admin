import React from "react";
import styles from "./SubscriptionManagement.module.scss";

export default function SubscriptionManagement({
  title,
  data,
}) {
  return (
    <div className={styles.wrapper}>
      {/* TOP */}
      <div className={styles.topBar}>
        <h2>{title} Subscription</h2>

        <div className={styles.totalBox}>
          Total Users : {data.length}
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Payment Type</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.length > 0 ? (
              data.map((item) => (
                <tr key={item.payment_id}>
                  <td>
                    {item.fullname || "N/A"}
                  </td>

                  <td>
                    {item.email || "N/A"}
                  </td>

                  <td>
                    {item.contact || "N/A"}
                  </td>

                  <td>
                    ₹ {item.amount}
                  </td>

                  <td>
                    {item.method}
                  </td>

                  <td className={styles.paymentId}>
                    {item.payment_id}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        item.status === "captured"
                          ? styles.success
                          : styles.failed
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.durationDays
                      ? `${item.durationDays} Days`
                      : "N/A"}
                  </td>

                  <td>
                    {item.created_at}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className={styles.empty}
                >
                  No Subscription Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
