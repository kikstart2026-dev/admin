import React, { useEffect, useState } from "react";
import {
    createSubAdmin,
    getAllSubAdmins,
    assignDynamicRole,
    updateSubAdmin,
    deleteSubAdmin,
    getSubAdminById
} from "../../apis/api";

import styles from "./RoleManagement.module.scss";

const RoleManagement = () => {

    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [roleModal, setRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleValue, setRoleValue] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);

    const [viewModal, setViewModal] = useState(false);

    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({ email: "", password: "" });
    const [updateLoading, setUpdateLoading] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [form, setForm] = useState({ fullname: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

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

    const openAssignModal = (user) => {
        setSelectedUser(user);
        setRoleValue(user.dynamicRole || "");
        setRoleModal(true);
    };

    const handleAssignRole = async () => {
        try {
            setAssignLoading(true);
            await assignDynamicRole(selectedUser._id, { dynamicRole: roleValue });
            setRoleModal(false);
            fetchUsers();
        } finally {
            setAssignLoading(false);
        }
    };

    // 🔥 UPDATED → now fetching fresh data
    const handleView = async (id) => {
        const res = await getSubAdminById(id);
        setSelectedUser(res.data);
        setViewModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditData({ email: user.email, password: "" });
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

    // ✅ UPDATED DELETE FLOW
    const handleDelete = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };
    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteSubAdmin(deleteId);
            setDeleteModal(false);
            fetchUsers();
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        if (openModal || roleModal || viewModal || editModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openModal, roleModal, viewModal, editModal]);

    return (
        <div className={styles.wrap}>

            <div className={styles.header}>
                <h2>Sub Admins</h2>
                <button onClick={() => setOpenModal(true)} className={styles.addBtn}>
                    + Add New User
                </button>
            </div>

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
                                    <div className={styles.avatar}>
                                        <i className={`bi bi-person-fill ${styles.person}`}></i>
                                    </div>
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
                                <span className={styles.plusBtn} onClick={() => openAssignModal(user)}>
                                    ＋
                                </span>
                            </td>

                            <td className={styles.actions}>
                                <i className={`bi bi-eye ${styles.view}`} onClick={() => handleView(user._id)}></i>
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

                            <input className={styles.input}
                                name="fullname"
                                placeholder="Full Name"
                                value={form.fullname}
                                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                            />

                            <input className={styles.input}
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />

                            <input className={styles.input}
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />

                            <div className={styles.modalActions}>
                                <button type="button"
                                    onClick={() => setOpenModal(false)} className={styles.cancelBtn} > Cancel </button>
                                <button type="submit" className={styles.submitBtn} > {loading ? "Creating..." : "Create"} </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {roleModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Assign Role</h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAssignRole(); // ✅ only call here
                            }}
                            className={styles.form}
                        >

                            <input
                                className={styles.input}
                                value={roleValue}
                                placeholder="Enter Role"
                                onChange={(e) => setRoleValue(e.target.value)}
                            />

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setRoleModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={
                                        assignLoading ||
                                        !roleValue.trim() ||
                                        selectedUser?.dynamicRole?.toLowerCase() === roleValue.trim().toLowerCase() 
                                    } // if the input is different then the assign button enable 
                                >
                                    {assignLoading ? "Assigning..." : "Assign"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* VIEW MODAL */}
            {viewModal && selectedUser && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>User Details</h3>
                        <div className={styles.modalInfo}>
                            <p><b>Name:</b> {selectedUser.fullname}</p>
                            <p><b>Email:</b> {selectedUser.email}</p>
                            <p><b>Role:</b> {selectedUser.dynamicRole}</p>
                        </div>
                        <div className={styles.modalAaction2}>
                            <button className={styles.cancelBtn2} onClick={() => setViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* EDIT MODAL */}
            {editModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Update Password</h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }}
                            className={styles.form}
                        >

                            <input className={styles.input}
                                value={editData.email} disabled
                            />

                            <input className={styles.input}
                                type="password"
                                value={editData.password}
                                placeholder="New Password"
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                            />

                            <div className={styles.modalActions}>
                                <button className={styles.cancelBtn} onClick={() => setEditModal(false)}>Cancel</button>
                                <button className={styles.submitBtn} onClick={handleUpdate}>{updateLoading ? "Updating..." : "Update"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }


            {/* DELETE MODAL */}
            {deleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.deleteModal}>

                        <div className={styles.deleteIcon}>
                            <i className="bi bi-person-dash"></i>
                        </div>

                        <h3 className={styles.deleteTitle}>
                            Are you sure you want to delete?
                        </h3>

                        <div className={styles.deleteActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setDeleteModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.submitBtn}
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Confirming..." : "Confirm"}
                            </button>
                        </div>

                    </div>
                </div>
            )}


        </div >
    );
};

export default RoleManagement;
