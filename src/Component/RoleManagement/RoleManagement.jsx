import React, { useEffect, useState } from "react";
import {
    createSubAdmin,
    getAllSubAdmins,
    assignDynamicRole,
    deleteSubAdmin,
    getSubAdminById
} from "../../apis/api";

import styles from "./RoleManagement.module.scss";

const RoleManagement = () => {

    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [assignLoadingId, setAssignLoadingId] = useState(null); // 👈 per user loading

    const [selectedUser, setSelectedUser] = useState(null);

    const [viewModal, setViewModal] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [form, setForm] = useState({ fullname: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const [openDropdownId, setOpenDropdownId] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    // ✅ predefined roles
    const rolesList = [
        "Admin",
        "Sub Admin",
        "Manager",
        "Editor",
        "Viewer",
        "Support",
        "Sales",
        "HR",
        "Finance",
        "Moderator"
    ];

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

    // ✅ NEW ROLE ASSIGN FUNCTION
 
    const handleRoleSelect = async (userId, role) => {
        // instant UI update
        setUsers((prev) =>
            prev.map((u) =>
                u._id === userId ? { ...u, dynamicRole: role } : u
            )
        );

        setOpenDropdownId(null); // close dropdown 

        try {
            setAssignLoadingId(userId);
            await assignDynamicRole(userId, { dynamicRole: role });
        } catch (err) {
            fetchUsers(); // rollback
        } finally {
            setAssignLoadingId(null);
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    const handleView = async (id) => {
        const res = await getSubAdminById(id);
        setSelectedUser(res.data);
        setViewModal(true);
    };


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
        if (openModal || viewModal ) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openModal, viewModal]);

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

                            {/* ✅ DROPDOWN REPLACED */}
                            <td>
                                <div className={`dropdown position-static`}>
                                    <button
                                        className={`btn ${styles.dropdownBtn}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId((prev) =>
                                                prev === user._id ? null : user._id
                                            );
                                        }}
                                    >
                                        <i
                                            className={`bi bi-chevron-down ${styles.dropdownIcon} ${openDropdownId === user._id ? styles.rotate : ""
                                                }`}
                                        ></i>
                                    </button>

                                    <ul
                                        className={`dropdown-menu shadow ${openDropdownId === user._id ? "show" : ""
                                            }`}
                                    >
                                        {rolesList.map((role) => (
                                            <li key={role}>
                                                <button
                                                    className={`dropdown-item ${user.dynamicRole === role ? styles.activeRole : ""
                                                        }`}
                                                    onClick={() => handleRoleSelect(user._id, role)}
                                                >
                                                    {role}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </td>

                            <td className={styles.actions}>
                                <i className={`bi bi-eye ${styles.view}`} onClick={() => handleView(user._id)}></i>
                                
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
