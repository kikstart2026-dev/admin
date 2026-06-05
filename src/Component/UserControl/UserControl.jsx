import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./UserControl.module.scss";

import {
  getAllUsers,
  deleteUser,
  getAllPayments,
  exportUsersCSV,
} from "../../apis/api";

export default function UserControl() {
  const queryClient = useQueryClient();

  const { data: paymentData, isLoading: paymentLoading } = useQuery({
    queryKey: ["all-payments"],
    queryFn: getAllPayments,
  });

  // ✅ MODAL STATE
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ GET USERS
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-users", page, searchTerm],
    queryFn: () =>
      getAllUsers({
        page,
        limit,
        search: searchTerm,
      }),
    placeholderData: (prev) => prev,
  });

  // ✅ DELETE USER
  const deleteMutation = useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-users"],
      });
    },
  });

  const payments = paymentData?.payments || [];

  // ✅ FILTER ONLY USER ROLE
  const users = useMemo(() => {
    let allUsers = Array.isArray(data) ? data : data?.users || data?.data || [];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      allUsers = allUsers.filter(
        (user) =>
          user.fullname?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.phone?.toLowerCase().includes(search),
      );
    }

    // Payment Filter
    if (paymentFilter) {
      allUsers = allUsers.filter((user) => {
        const isPaid = payments.some(
          (pay) =>
            pay.email?.toLowerCase() === user.email?.toLowerCase() &&
            pay.status === "captured",
        );

        return paymentFilter === "paid" ? isPaid : !isPaid;
      });
    }

    // Sorting
    const sortedUsers = [...allUsers];

    switch (sortOption) {
      case "oldest":
        sortedUsers.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        break;

      case "nameAsc":
        sortedUsers.sort((a, b) =>
          (a.fullname || "").localeCompare(b.fullname || ""),
        );
        break;

      case "nameDesc":
        sortedUsers.sort((a, b) =>
          (b.fullname || "").localeCompare(a.fullname || ""),
        );
        break;

      case "paid":
        sortedUsers.sort((a, b) => {
          const aPaid = payments.some(
            (pay) =>
              pay.email?.toLowerCase() === a.email?.toLowerCase() &&
              pay.status === "captured",
          );

          const bPaid = payments.some(
            (pay) =>
              pay.email?.toLowerCase() === b.email?.toLowerCase() &&
              pay.status === "captured",
          );

          return Number(bPaid) - Number(aPaid);
        });
        break;

      case "unpaid":
        sortedUsers.sort((a, b) => {
          const aPaid = payments.some(
            (pay) =>
              pay.email?.toLowerCase() === a.email?.toLowerCase() &&
              pay.status === "captured",
          );

          const bPaid = payments.some(
            (pay) =>
              pay.email?.toLowerCase() === b.email?.toLowerCase() &&
              pay.status === "captured",
          );

          return Number(aPaid) - Number(bPaid);
        });
        break;

      default:
        sortedUsers.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }

    return sortedUsers;
  }, [data, searchTerm, paymentFilter, sortOption, payments]);

  const userPayments = payments.filter(
    (pay) =>
      pay.status === "captured" &&
      (pay.email?.toLowerCase() === selectedUser?.email?.toLowerCase() ||
        pay.contact === selectedUser?.phone),
  );

  const totalPaymentAmount = userPayments.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  const sortedPayments = [...userPayments].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const lastPayment = sortedPayments[0];

  // ✅ DELETE HANDLER
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(id);
  };

  // ✅ LOADING
  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  // ✅ ERROR
  if (isError) {
    return <p className={styles.error}>Failed to load users.</p>;
  }

  const handleExportCSV = async () => {
    try {
      const blob = await exportUsersCSV();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "users.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.topRow}>
          <h2>User Management</h2>
          <div className={styles.filterRow}>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className={styles.selectBox}
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className={styles.selectBox}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="nameAsc">Name A-Z</option>
              <option value="nameDesc">Name Z-A</option>
              <option value="paid">Paid First</option>
              <option value="unpaid">Unpaid First</option>
            </select>

            <button className={styles.exportBtn} onClick={handleExportCSV}>
              <i className="bi bi-download"></i>
              Export CSV
            </button>

            <div className={styles.countBox}>
              Total Users : <span>{users.length}</span>
            </div>
          </div>
        </div>
        <div className={styles.searchWrapper}>
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search user by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Verified</th>
              <th>Created</th>
              <th>Payment</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  {/* IMAGE */}
                  <td>
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.fullname}
                        className={styles.userImage}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={styles.avatar}>
                        {user.fullname?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </td>

                  {/* NAME */}
                  <td>{user.fullname}</td>

                  {/* EMAIL */}
                  <td>{user.email}</td>

                  {/* PHONE */}
                  <td>{user.phone || "N/A"}</td>

                  {/* VERIFIED */}
                  <td>
                    {user.isVerified ? (
                      <span className={styles.verified}>Verified</span>
                    ) : (
                      <span className={styles.notVerified}>Not Verified</span>
                    )}
                  </td>

                  {/* CREATED */}
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  {/* PAYMENT */}
                  <td>
                    {paymentLoading ? (
                      <span>Loading...</span>
                    ) : payments.some(
                        (pay) =>
                          pay.email?.toLowerCase() ===
                            user.email?.toLowerCase() &&
                          pay.status === "captured",
                      ) ? (
                      <span className={styles.paid}>Paid</span>
                    ) : (
                      <span className={styles.unpaid}>Unpaid</span>
                    )}
                  </td>

                  {/* VIEW */}
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => setSelectedUser(user)}
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                  </td>

                  {/* DELETE */}
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(user._id)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}

      {selectedUser && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedUser(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className={styles.modalHeader}>
              <h2>User Details</h2>

              <button onClick={() => setSelectedUser(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* BODY */}
            <div className={styles.modalBody}>
              {/* IMAGE */}
              <div className={styles.imageWrapper}>
                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.fullname}
                    className={styles.modalImage}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={styles.modalAvatar}>
                    {selectedUser.fullname?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className={styles.userInfo}>
                <div className={styles.infoCard}>
                  <span>Full Name</span>
                  <p>{selectedUser.fullname}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Email Address</span>
                  <p>{selectedUser.email}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Phone Number</span>
                  <p>{selectedUser.phone || "N/A"}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Address</span>
                  <p>{selectedUser.location || "No Address Found"}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Account Status</span>

                  <p>
                    {selectedUser.isVerified ? "Verified User" : "Not Verified"}
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <span>Joined Date</span>

                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Total Payments</span>

                  <p>
                    {userPayments.length} Payment
                    {userPayments.length > 1 ? "s" : ""}
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <span>Current Package</span>

                  <p>{lastPayment?.description || "No Package Found"}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Last Payment Date</span>

                  <p>
                    {lastPayment ? lastPayment.created_at : "No Payment Found"}
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <span>Last Payment Amount</span>

                  <p>
                    {lastPayment ? `₹ ${lastPayment.amount}` : "No Payment"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
