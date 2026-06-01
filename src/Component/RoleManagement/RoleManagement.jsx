import React, { useEffect, useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import {
    createSubAdmin,
    getAllSubAdmins,
    assignDynamicRole,
    deleteSubAdmin,
    getSubAdminById,
    createRole,
    getAllRoles,
    exportSubAdminsCSV
} from "../../apis/api";

import styles from "./RoleManagement.module.scss";

const RoleManagement = () => {

    const queryClient = useQueryClient();

    const [openModal, setOpenModal] = useState(false);

    const [assignLoadingId, setAssignLoadingId] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    const [viewModal, setViewModal] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [roleModal, setRoleModal] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [roleLoading, setRoleLoading] = useState(false);

    // ✅ FIXED (password removed)
    const [form, setForm] = useState({ fullname: "", email: "" });

    const [loading, setLoading] = useState(false);

    const [openDropdownId, setOpenDropdownId] = useState(null);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");


    const {
        data: usersData,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: [
            "subAdmins",
            page,
            search,
            roleFilter,
            sortBy,
            sortOrder,
        ],
        queryFn: () =>
            getAllSubAdmins({
                page,
                limit,
                search,
                role: roleFilter,
                sortBy,
                sortOrder,
            }),
        placeholderData: (previousData) => previousData,
    });

    const {
        data: rolesData,
    } = useQuery({
        queryKey: ["roles"],
        queryFn: getAllRoles,
    });


    const users =
        usersData?.data || [];

    const totalPages =
        usersData?.totalPages || 1;

    const rolesList =
        rolesData?.map(
            (role) => role.name
        ) || [];




    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            setRoleLoading(true);

            await createRole({
                name: roleName,
                permissions: ["read"] // basic, later dynamic korte parba
            });

            setRoleModal(false);
            setRoleName("");

            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });

        } catch (err) {
            console.log(err);
        } finally {
            setRoleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createSubAdmin(form);
            setOpenModal(false);
            queryClient.invalidateQueries({
                queryKey: ["subAdmins"],
            });

            // ✅ FIXED (no password reset)
            setForm({ fullname: "", email: "" });

        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelect = async (userId, role) => {
        setOpenDropdownId(null);

        const previousData =
            queryClient.getQueryData([
                "subAdmins",
                page,
                search,
                roleFilter,
                sortBy,
                sortOrder,
            ]);

        queryClient.setQueryData(
            [
                "subAdmins",
                page,
                search,
                roleFilter,
                sortBy,
                sortOrder,
            ],
            (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: old.data.map((user) =>
                        user._id === userId
                            ? {
                                ...user,
                                dynamicRole: role,
                            }
                            : user
                    ),
                };
            }
        );

        try {
            setAssignLoadingId(userId);

            await assignDynamicRole(
                userId,
                { dynamicRole: role }
            );

            queryClient.invalidateQueries({
                queryKey: ["subAdmins"],
            });

        } catch (err) {

            queryClient.setQueryData(
                [
                    "subAdmins",
                    page,
                    search,
                    roleFilter,
                    sortBy,
                    sortOrder,
                ],
                previousData
            );

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
            queryClient.invalidateQueries({
                queryKey: ["subAdmins"],
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        if (openModal || viewModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openModal, viewModal]);


    const handleExportCSV =
        async () => {
            try {

                const blob =
                    await exportSubAdminsCSV();

                const url =
                    window.URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "sub-admins.csv";

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                window.URL.revokeObjectURL(
                    url
                );

            } catch (err) {
                console.log(err);
            }
        };


    return (
        <div className={styles.wrap}>

            <div className={styles.header}>
                <h2>Sub Admins</h2>
                <div className={styles.allBtn}>
                    <button
                        onClick={() => setRoleModal(true)}
                        className={styles.addBtn}
                        style={{ marginRight: "10px" }}
                    >
                        + Create Role
                    </button>

                    <button
                        onClick={() => setOpenModal(true)}
                        className={styles.addBtn}
                    >
                        + Add New User
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className={styles.exportBtn}
                        style={{ marginRight: "10px" }}
                    >
                        <i class="bi bi-download"></i>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className={styles.filterBar}>

                <input
                    type="text"
                    placeholder="Search by name, email, role..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className={styles.searchInput}
                />

                <select
                    className={styles.filterSelect}
                    value={roleFilter}
                    onChange={(e) => {
                        setPage(1);
                        setRoleFilter(e.target.value);
                    }}
                >
                    <option value="">All Roles</option>

                    <option value="no-role">
                        No Role
                    </option>

                    {rolesList.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>

                <select
                    className={styles.filterSelect}
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {

                        const [field, order] =
                            e.target.value.split("-");

                        setSortBy(field);
                        setSortOrder(order);
                    }}
                >
                    <option value="createdAt-desc">
                        Newest First
                    </option>

                    <option value="createdAt-asc">
                        Oldest First
                    </option>

                    <option value="fullname-asc">
                        Name A-Z
                    </option>

                    <option value="fullname-desc">
                        Name Z-A
                    </option>

                    <option value="dynamicRole-asc">
                        Role A-Z
                    </option>

                    <option value="dynamicRole-desc">
                        Role Z-A
                    </option>

                </select>

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

                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link arrow"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            &lt;
                        </button>
                    </li>

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

                            <div className={styles.modalActions}>
                                <button type="button"
                                    onClick={() => setOpenModal(false)} className={styles.cancelBtn} > Cancel </button>
                                <button type="submit" className={styles.submitBtn} > {loading ? "Creating..." : "Create"} </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* ROLE CREATE MODAL */}
            {roleModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>Create Role</h3>

                        <form onSubmit={handleCreateRole} className={styles.form}>

                            <input
                                className={styles.input}
                                placeholder="Role Name"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => setRoleModal(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className={styles.submitBtn}>
                                    {roleLoading ? "Creating..." : "Create"}
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
            )}

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