import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyPlanRevenue } from "../../apis/api";
import styles from "./ReveueManagement.module.scss";

export default function RevenueManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: getMonthlyPlanRevenue,
  });

  const revenueData = data?.revenue || [];

  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );

  const basicRevenue = revenueData
    .filter((item) => item._id.plan === "BASIC")
    .reduce((sum, item) => sum + item.totalRevenue, 0);

  const professionalRevenue = revenueData
    .filter((item) => item._id.plan === "PROFESSIONAL")
    .reduce((sum, item) => sum + item.totalRevenue, 0);

  const advancedRevenue = revenueData
    .filter((item) => item._id.plan === "ADVANCED")
    .reduce((sum, item) => sum + item.totalRevenue, 0);

  const totalSubscribers = revenueData.reduce(
    (sum, item) => sum + item.totalSubscriptions,
    0
  );

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <h6>Total Revenue</h6>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div className={styles.card}>
          <h6>Basic Revenue</h6>
          <h2>₹{basicRevenue}</h2>
        </div>

        <div className={styles.card}>
          <h6>Professional Revenue</h6>
          <h2>₹{professionalRevenue}</h2>
        </div>

        <div className={styles.card}>
          <h6>Advanced Revenue</h6>
          <h2>₹{advancedRevenue}</h2>
        </div>

        <div className={styles.card}>
          <h6>Total Subscribers</h6>
          <h2>{totalSubscribers}</h2>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.header}>
          <h3>Revenue Analytics</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Plan</th>
              <th>Revenue</th>
              <th>Subscriptions</th>
            </tr>
          </thead>

          <tbody>
            {revenueData.map((item, index) => (
              <tr key={index}>
                <td>
                  {new Date(
                    item._id.year,
                    item._id.month - 1
                  ).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </td>

                <td>{item._id.plan}</td>

                <td>₹{item.totalRevenue}</td>

                <td>{item.totalSubscriptions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}