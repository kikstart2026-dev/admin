import React, { useEffect, useState, useRef } from "react";
import styles from "./Dashboard.module.scss";
import Chart from "react-apexcharts";
import DashboardSkeleton from "../../Skeleton/DashboardSkeleton/DashboardSkeleton";

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

  const [page, setPage] = useState(1);

  // // const itemsPerPage = 5;
  // useEffect(() => {
  //   fetchDashboardData(true); // initial load = skeleton
  // }, []);
  useEffect(() => {
    fetchDashboardData(page, page === 1);
  }, [page]);


  const [totalPages, setTotalPages] = useState(1);
  const [totalChildren, setTotalChildren] = useState(0);

  const [tableLoading, setTableLoading] = useState(false);

  // const childCache = new Map();
  const cache = useRef({
    payments: null,
    users: null,
    children: new Map(),
  });

  const fetchDashboardData = async (page, isInitial) => {

    try {
      if (isInitial) setLoading(true);
      else setTableLoading(true);

    
      // ---------------- PAYMENTS CACHE ----------------
      let paymentsData = cache.current.payments;

      if (!paymentsData) {
        const res = await getAllPayments({
          limit: 100000, // অথবা backend যদি limit=0 support করে তাহলে limit:0
        });

        paymentsData = res?.payments || [];
        cache.current.payments = paymentsData;
      }

      // ---------------- USERS CACHE ----------------
      let usersData = cache.current.users;

      if (!usersData) {
        const res = await getAllUsers();
        usersData = res?.users || [];
        cache.current.users = usersData;
      }

      // ---------------- CHILD CACHE ----------------
      let childrenData;
      let totalPagesData = totalPages;
      let totalChildrenData = totalChildren;

      if (cache.current.children.has(page)) {
        const cached = cache.current.children.get(page);

        childrenData = cached.children;
        totalPagesData = cached.totalPages;
        totalChildrenData = cached.totalChildren;
      } else {
        const res = await getAllChild({
          page,
          limit: 10,
        });

        childrenData = res?.data || [];

        totalPagesData = res?.totalPages || 1;
        totalChildrenData = res?.totalChildren || 0;

        cache.current.children.set(page, {
          children: childrenData,
          totalPages: totalPagesData,
          totalChildren: totalChildrenData,
        });
      }

      setPayments(paymentsData);
      setUsers(usersData);
      setChildren(childrenData);

      setTotalPages(totalPagesData);
      setTotalChildren(totalChildrenData);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }

  };

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
    const date = new Date(item.createdAt || item.created_at);
    const month = date.getMonth();
    const amount = Number(item.amount || 0);

    if (!isNaN(month)) {
      monthlyData[month].total += amount;
    }
  });



  const safeSeries = monthlyData.map((item) =>
    item.total === 0 ? 0 : item.total
  );




  if (loading) return <DashboardSkeleton />;

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
            <div className={`card shadow ${styles.statsCard} ${styles.red1}`}>
              <div className="card-body">
                <h6>Total Students</h6>
                <h3>{totalChildren}</h3>
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

          {/* ================= PIE CHART ================= */}
          <div className="col-md-6">
            <div className={`${styles.pieCard} card shadow`}>
              <h5 className={styles.title}>Monthly User Signups</h5>

              {(() => {
                const months = [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                const monthlyUsers = Array(12).fill(0);

                users.forEach((user) => {
                  const date = new Date(user.createdAt);
                  const month = date.getMonth();
                  monthlyUsers[month] += 1;
                });


                return (
                  <Chart
                    type="line"
                    height={320}
                    series={[
                      {
                        name: "Users",
                        data: monthlyUsers,
                      },
                    ]}
                    options={{
                      chart: {
                        toolbar: {
                          show: true,
                          tools: {
                            download: true, // only download like you wanted
                            selection: false,
                            zoom: false,
                            zoomin: false,
                            zoomout: false,
                            pan: false,
                            reset: false,
                          },
                        },

                        animations: {
                          enabled: true,
                          easing: "easeinout",
                          speed: 1200,
                          animateGradually: {
                            enabled: true,
                            delay: 120, // 🔥 smooth Jan → Feb → Mar feel
                          },
                          dynamicAnimation: {
                            enabled: true,
                            speed: 800,
                          },
                        },
                      },

                      stroke: {
                        curve: "smooth",
                        width: 3,
                      },

                      colors: ["#198bcd"],

                      xaxis: {
                        categories: months,

                        axisBorder: { show: false },
                        axisTicks: { show: false },
                      },

                      yaxis: {
                        min: 0,
                        labels: {
                          formatter: (val) => `${val}`,
                        },
                      },

                      dataLabels: {
                        enabled: false,
                      },





                      markers: {
                        size: 4,
                        colors: ["#004ed5"],
                        strokeColors: "#00164a",
                        strokeWidth: 2,
                        hover: {
                          size: 6,
                        },
                      },

                      grid: {
                        borderColor: "#f1f1f1",
                        strokeDashArray: 5,
                      },

                      tooltip: {
                        theme: "light",
                        y: {
                          formatter: (val) => `${val || 0} users`,
                        },
                      },
                    }}
                  />
                );
              })()}
            </div>
          </div>

          {/* ================= BAR CHART ================= */}
          <div className="col-md-6">
            <div className={`card shadow p-3 ${styles.barCard}`}>
              <h5 className={styles.barHeading}>
                Monthly Transactions
              </h5>

              <Chart
                type="bar"
                height={320}
                series={[
                  {
                    name: "Transactions",
                    data: safeSeries,
                  },
                ]}
                options={{
                  chart: {
                    toolbar: { show: true },

                    animations: {
                      enabled: true,
                      easing: "easeinout",
                      speed: 900,
                      animateGradually: {
                        enabled: true,
                        delay: 80,
                      },
                    },
                  },

                  // Bar Chart
                  colors: ["#ce6161"],

                  fill: {
                    type: "gradient",
                    gradient: {
                      shade: "light",
                      type: "vertical",
                      shadeIntensity: 0.3,
                      gradientToColors: ["#082e5d"],
                      opacityFrom: 0.95,
                      opacityTo: 0.8,
                    },
                  },

                  plotOptions: {
                    bar: {
                      borderRadius: 5,
                      columnWidth: "40%",
                    },
                  },

                  dataLabels: {
                    enabled: false,
                  },

                  xaxis: {
                    categories: monthlyData.map((item) => item.month),
                  },

                  yaxis: {
                    min: 0,
                    labels: {
                      formatter: (val) =>
                        `₹ ${new Intl.NumberFormat("en-IN").format(val || 0)}`,
                    },
                  },

                  tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: false, // 🔥 MOST IMPORTANT FIX

                    y: {
                      formatter: (val) => {
                        const value = val ?? 0;
                        return `Revenue: ₹ ${new Intl.NumberFormat("en-IN").format(value)}`;
                      },
                    },
                  },

                  states: {
                    hover: {
                      filter: {
                        type: "darken",
                        value: 0.15,
                      },
                    },
                  },

                  grid: {
                    borderColor: "#faf5f5",
                    strokeDashArray: 5,
                  },

                  responsive: [
                    {
                      breakpoint: 768,
                      options: {
                        plotOptions: {
                          bar: {
                            columnWidth: "55%",
                          },
                        },
                      },
                    },
                  ],
                }}
              />
            </div>
          </div>

        </div>

        {/* Students Table */}
        <div className="card mt-5 shadow">

          <div className="card-body">

            <h5 className="mb-3 text-danger">
              Recent Students
            </h5>


            <div className="table-responsive">

              <table className={`table table-hover ${styles.table}`}>

                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Subscription Package</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className={tableLoading ? styles.fade : ""}>
                  {children?.length > 0 ? (
                    children.map((item, index) => {
                      const studentPayment = payments.find(
                        (pay) =>
                          pay?.email &&
                          item?.email &&
                          pay.email.toLowerCase() === item.email.toLowerCase()
                      );

                      return (
                        <tr key={index}>
                          <td>
                            {item?.fullName || item?.fullname || item?.name}
                          </td>

                          <td>{item?.age || "N/A"}</td>

                          <td>
                            {studentPayment?.description || "No Subscription"}
                          </td>

                          <td>
                            {studentPayment?.status === "captured" ? (
                              <span className={styles.badgeActive}>Paid</span>
                            ) : (
                              <span className={styles.badgeFailed}>Failed</span>
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
              {totalPages > 1 && (
                <nav
                  className={`d-flex justify-content-center ${styles.customPagination}`}
                >
                  <ul className="pagination">

                    <li
                      className={`page-item ${page === 1 ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link arrow"
                        onClick={() =>
                          setPage((prev) => prev - 1)
                        }
                        disabled={page === 1}
                      >
                        &lt;
                      </button>
                    </li>

                    {Array.from(
                      { length: totalPages },
                      (_, i) => i + 1
                    ).map((num) => (
                      <li
                        key={num}
                        className={`page-item ${page === num ? "active" : ""
                          }`}
                      >
                        <button
                          className={`page-link ${page === num ? "num" : ""
                            }`}
                          onClick={() => setPage(num)}
                        >
                          {num}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${page === totalPages
                        ? "disabled"
                        : ""
                        }`}
                    >
                      <button
                        className="page-link arrow"
                        onClick={() =>
                          setPage((prev) => prev + 1)
                        }
                        disabled={page === totalPages}
                      >
                        &gt;
                      </button>
                    </li>

                  </ul>
                </nav>
              )}

            </div>


          </div>

        </div>

      </div>

    </div>
  );
}