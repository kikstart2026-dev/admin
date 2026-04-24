import React, { useEffect, useState } from "react";
import {
    createSubAdmin,
    getAllSubAdmins,
    assignDynamicRole,
    updateSubAdmin,
    deleteSubAdmin
} from "../../apis/api";

import styles from "./RoleManagement.module.scss";

const RoleManagement = () => {

    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    // ROLE MODAL
    const [roleModal, setRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleValue, setRoleValue] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);

    // VIEW MODAL
    const [viewModal, setViewModal] = useState(false);

    // EDIT MODAL
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({
        email: "",
        password: ""
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    // PAGINATION
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await getAllSubAdmins({ page, limit });
            setUsers(res?.data || []);
            setTotalPages(res?.totalPages || 1);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    // CREATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await createSubAdmin(form);

            setOpenModal(false);
            fetchUsers();

            setForm({ fullname: "", email: "", password: "" });

        } finally {
            setLoading(false);
        }
    };

    // OPEN ROLE MODAL (🔥 FIXED)
    const openAssignModal = (user) => {
        setSelectedUser(user);
        setRoleValue(user.dynamicRole || "");
        setRoleModal(true);
    };

    // ASSIGN ROLE
    const handleAssignRole = async () => {
        try {
            setAssignLoading(true);

            await assignDynamicRole(selectedUser._id, {
                dynamicRole: roleValue
            });

            setRoleModal(false);
            fetchUsers();

        } finally {
            setAssignLoading(false);
        }
    };

    // VIEW
    const handleView = (user) => {
        setSelectedUser(user);
        setViewModal(true);
    };

    // EDIT
    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditData({
            email: user.email,
            password: ""
        });
        setEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            setUpdateLoading(true);

            await updateSubAdmin(selectedUser._id, editData);

            setEditModal(false);
            fetchUsers();

        } finally {
            setUpdateLoading(false);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        await deleteSubAdmin(id);
        fetchUsers();
    };

    return (
        <div className={styles.wrap}>

            {/* HEADER */}
            <div className={styles.header}>
                <h2>User Management</h2>

                <button
                    onClick={() => setOpenModal(true)}
                    className={styles.addBtn}
                >
                    + Add New User
                </button>
            </div>

            {/* TABLE */}
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Assign</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className={styles.row}>
                            <td>
                                <div className={styles.userCell}>
                                    <div className={styles.avatar}>👤</div>
                                    {user.fullname}
                                </div>
                            </td>

                            <td>{user.email}</td>

                            <td>
                                <span className={styles.role}>
                                    {user.dynamicRole || "No Role"}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={styles.plusBtn}
                                    onClick={() => openAssignModal(user)}
                                >
                                    ＋
                                </span>
                            </td>

                            <td className={styles.actions}>
                                <i className={`bi bi-eye ${styles.view}`} onClick={() => handleView(user)}></i>
                                <i className={`bi bi-pencil-square ${styles.edit}`} onClick={() => handleEdit(user)}></i>
                                <i className={`bi bi-trash ${styles.delete}`} onClick={() => handleDelete(user._id)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <nav className="mt-4">
                <ul className={`pagination justify-content-center ${styles.customPagination}`}>

                    {/* LEFT ARROW */}
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link arrow"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            &lt;
                        </button>
                    </li>

                    {/* PAGE NUMBERS */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <li
                            key={num}
                            className={`page-item ${page === num ? "active" : ""}`}
                        >
                            <button
                                className={`page-link ${page === num ? "num" : ""}`}
                                onClick={() => setPage(num)}
                            >
                                {num}
                            </button>
                        </li>
                    ))}

                    {/* RIGHT ARROW */}
                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button
                            className="page-link arrow"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                        >
                            &gt;
                        </button>
                    </li>

                </ul>
            </nav>

            {/* CREATE MODAL */}
            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Create User</h3>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                className={styles.input}
                                name="fullname"
                                placeholder="Full Name"
                                value={form.fullname}
                                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                            />

                            <input
                                className={styles.input}
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />

                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                >
                                    {loading ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ROLE MODAL */}
            {roleModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Assign Role</h3>
                        <form onSubmit={handleSubmit} className={styles.form}>

                            <input
                                className={styles.input}
                                value={roleValue}
                                onChange={(e) => setRoleValue(e.target.value)}
                                placeholder="Enter Role"
                            />

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setRoleModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.submitBtn}
                                    onClick={handleAssignRole}
                                >
                                    {assignLoading ? "Assigning..." : "Assign"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW MODAL */}
            {viewModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>User Details</h3>
                        <p><b>Name:</b> {selectedUser.fullname}</p>
                        <p><b>Email:</b> {selectedUser.email}</p>
                        <p><b>Role:</b> {selectedUser.dynamicRole}</p>

                        <button
                            className={styles.cancelBtn2}
                            onClick={() => setViewModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Update Password</h3>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                className={styles.input}
                                value={editData.email}
                                disabled
                            />

                            <input
                                className={styles.input}
                                type="password"
                                placeholder="New Password"
                                value={editData.password}
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                            />

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setEditModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={styles.submitBtn}
                                    onClick={handleUpdate}
                                >
                                    {updateLoading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default RoleManagement;