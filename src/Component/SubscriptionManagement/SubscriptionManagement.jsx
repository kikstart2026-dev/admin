import React from "react";
import styles from "./SubscriptionManagement.module.scss";

export default function SubscriptionManagement({
  title,
  data,
  totalUsers,

  search,
  setSearch,

  status,
  setStatus,

  sortBy,
  setSortBy,

  sortOrder,
  setSortOrder,

  onExportCSV,
}) {
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>{title} Subscription</h2>

        <div className={styles.headerRight}>
          <div className={styles.countBox}>
            Total Users :
            <span>{totalUsers || 0}</span>
          </div>

          <button
            className={styles.exportBtn}
            onClick={onExportCSV}
          >
              <i class="bi bi-download"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* SEARCH FILTER SORT */}
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search name/email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={styles.searchInput}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className={styles.select}

        >


          <option value="">

            All Status
          </option>

          <option value="captured">
            Captured
          </option>

          <option value="failed">
            Failed
          </option>


        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className={styles.select}

        >

          <option value="newest">

            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="az">
            A-Z
          </option>

          <option value="za">
            Z-A
          </option>


        </select>
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
                <tr
                  key={
                    item.payment_id ||
                    item._id
                  }
                >
                  <td>
                    {item.fullname ||
                      "N/A"}
                  </td>

                  <td>
                    {item.email ||
                      "N/A"}
                  </td>

                  <td>
                    {item.contact ||
                      item.phone ||
                      "N/A"}
                  </td>

                  <td>
                    ₹ {item.amount}
                  </td>

                  <td>
                    {item.method ||
                      "N/A"}
                  </td>

                  <td
                    className={
                      styles.paymentId
                    }
                  >
                    {item.payment_id ||
                      "N/A"}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${item.status ===
                        "captured"
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
                      : item
                        ?.subscriptionId
                        ?.durationDays
                        ? `${item.subscriptionId.durationDays} Days`
                        : "N/A"}
                  </td>

                  <td>
                    {item.created_at
                      ? new Date(
                        item.created_at
                      ).toLocaleString()
                      : item.createdAt
                        ? new Date(
                          item.createdAt
                        ).toLocaleString()
                        : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className={
                    styles.empty
                  }
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