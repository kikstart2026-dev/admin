import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./UserControl.module.scss";

import { getAllUsers, deleteUser } from "../../apis/api";

export default function UserControl() {
    const queryClient = useQueryClient();

    // ✅ MODAL STATE
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ GET USERS
    const { data, isLoading, isError } = useQuery({
        queryKey: ["all-users"],
        queryFn: getAllUsers,
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

    // ✅ FILTER ONLY USER ROLE
    const users = useMemo(() => {
        const allUsers = Array.isArray(data)
            ? data
            : data?.users || data?.data || [];

        return allUsers
            .filter((item) => item.role === "user")
            .filter((user) => {
                const search = searchTerm.toLowerCase();

                return (
                    user.fullname?.toLowerCase().includes(search) ||
                    user.email?.toLowerCase().includes(search) ||
                    user.phone?.toLowerCase().includes(search)
                );
            });
    }, [data, searchTerm]);

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

    return (
        <div className={styles.wrapper}>
            {/* HEADER */}
            <div className={styles.header}>
                <h2>User Management</h2>
                <div className={styles.headerRight}>

                    <div className={styles.searchWrapper}>
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search user by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.countBox}>
                       Total Users :  <span>{users.length}</span>
                    </div>
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
                                            <span className={styles.verified}>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className={styles.notVerified}>
                                                Not Verified
                                            </span>
                                        )}
                                    </td>

                                    {/* CREATED */}
                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString()}
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
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                        {selectedUser.fullname
                                            ?.charAt(0)
                                            ?.toUpperCase()}
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
                                    <p>
                                        {selectedUser.location ||
                                            "No Address Found"}
                                    </p>
                                </div>

                                <div className={styles.infoCard}>
                                    <span>Account Status</span>

                                    <p>
                                        {selectedUser.isVerified
                                            ? "Verified User"
                                            : "Not Verified"}
                                    </p>
                                </div>

                                <div className={styles.infoCard}>
                                    <span>Joined Date</span>

                                    <p>
                                        {new Date(
                                            selectedUser.createdAt,
                                        ).toLocaleDateString()}
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