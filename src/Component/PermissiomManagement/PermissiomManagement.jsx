import React, { useEffect, useState } from "react";
import {
    getPermissionsByRole,
    savePermissions,
    getModules,
    getAllRoles
} from "../../apis/api";

import styles from "./PermissionManagement.module.scss";


const defaultPermissions = (modules = []) =>
    modules.map((m) => ({
        module: m,
        create: false,
        read: false,
        update: false,
        delete: false,
    }));

const PermissionManagement = () => {
    const [selectedRole, setSelectedRole] = useState("");
    const [modules, setModules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [rolesList, setRolesList] = useState([]);

    const fetchRoles = async () => {
        try {
            const res = await getAllRoles();
            console.log("ROLES:", res);

            setRolesList(res); // full object 

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // ================= LOAD MODULES =================
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await getModules();
                const modList = res?.data || [];

                setModules(modList);
                setPermissions(defaultPermissions(modList));
            } catch (err) {
                console.log(err);
            }
        };

        fetchModules();
    }, []);

    // ================= LOAD ROLE PERMISSIONS =================
    useEffect(() => {
    if (!selectedRole) return;

    const fetchPermissions = async () => {
        try {
            setLoading(true);

            const res = await getPermissionsByRole(selectedRole);
            const existing = res?.data || [];

            const merged = modules.map((module) => {
                const found = existing.find((p) => p.module === module);

                return {
                    module,
                    create: found?.create ?? false,
                    read: found?.read ?? false,
                    update: found?.update ?? false,
                    delete: found?.delete ?? false,
                };
            });

            setPermissions(merged);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    fetchPermissions();
}, [selectedRole]); // ❗ modules remove করো

    // ================= CHECKBOX CHANGE =================
    const handleChange = (index, field) => {
        setPermissions((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: !updated[index][field],
            };
            return updated;
        });
    };

    // ================= SELECT ALL =================
    const handleSelectAll = (index) => {
        setPermissions((prev) => {
            const updated = [...prev];
            const item = updated[index];

            const allSelected =
                item.create &&
                item.read &&
                item.update &&
                item.delete;

            updated[index] = {
                ...item,
                create: !allSelected,
                read: !allSelected,
                update: !allSelected,
                delete: !allSelected,
            };

            return updated;
        });
    };

    // ================= SAVE =================
    const handleSave = async () => {
        if (!selectedRole) {
            alert("Role is required");
            return;
        }

        try {
            setSaving(true);

            await savePermissions({
                dynamicRole: selectedRole,
                permissions,
            });

            alert("Permissions saved successfully");
        } catch (err) {
            console.log(err);
            alert("Save failed");
        } finally {
            setSaving(false);
        }
    };



    const [open, setOpen] = useState(false);

    const handleSelect = (role) => {
        setSelectedRole(role);
        setOpen(false);
    };

    return (
        <div className={styles.container}>

            {/* HEADER */}
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Role & Permission Management
                </h2>
                <div className={styles.dropdownWrapper}>

                    {/* SELECT BOX */}
                    <div
                        className={styles.selectBox}
                        onClick={() => setOpen(!open)}
                    >
                        {selectedRole || "Select Role"}
                    </div>

                    {/* OPTIONS */}
                    {open && (
                        <div className={styles.dropdownList}>
                            {rolesList.map((role) => (
                                <div
                                    key={role._id}
                                    className={`${styles.option} ${selectedRole === role.name ? styles.active : ""
                                        }`}
                                    onClick={() => handleSelect(role.name)}
                                >
                                    {role.name}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* LOADING */}
            {loading ? (
                <p className={styles.loading}>Loading permissions...</p>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>

                        <thead>
                            <tr>
                                <th>Module</th>
                                <th>Select All</th>
                                <th>Create</th>
                                <th>Read</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {permissions.map((item, index) => (
                                <tr key={index}>

                                    <td className={styles.moduleCell}>
                                        {item.module}
                                    </td>

                                    {/* SELECT ALL */}
                                    <td className={styles.center}>
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            checked={
                                                item.create &&
                                                item.read &&
                                                item.update &&
                                                item.delete
                                            }
                                            onChange={() => handleSelectAll(index)}
                                        />
                                    </td>

                                    <td className={styles.center}>
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            checked={item.create}
                                            onChange={() => handleChange(index, "create")}
                                        />
                                    </td>

                                    <td className={styles.center}>
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            checked={item.read}
                                            onChange={() => handleChange(index, "read")}
                                        />
                                    </td>

                                    <td className={styles.center}>
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            checked={item.update}
                                            onChange={() => handleChange(index, "update")}
                                        />
                                    </td>

                                    <td className={styles.center}>
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            checked={item.delete}
                                            onChange={() => handleChange(index, "delete")}
                                        />
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            {/* FOOTER */}
            <div className={styles.footer}>
                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={saving || !selectedRole}
                >
                    {saving ? "Saving..." : "Save Permissions"}
                </button>
            </div>

        </div>
    );
};

export default PermissionManagement;