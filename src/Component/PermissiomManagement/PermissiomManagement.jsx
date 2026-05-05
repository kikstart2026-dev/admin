import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getPermissionsByRole,
    savePermissions,
    getModules,
    getAllRoles
} from "../../apis/api";

import styles from "./PermissionManagement.module.scss";

// ================= DEFAULT PERMISSIONS =================
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
    const [permissions, setPermissions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [open, setOpen] = useState(false);

    // ================= ROLES =================
    const { data: rolesList = [] } = useQuery({
        queryKey: ["roles"],
        queryFn: getAllRoles,
    });

    // ================= MODULES =================
    const { data: modules = [] } = useQuery({
        queryKey: ["modules"],
        queryFn: async () => {
            const res = await getModules();
            return res?.data || [];
        },
    });

    // =================PERMISSIONS (DEPENDENT)=================
    const {
        data: permissionsData = [],
        isLoading: loading,
    } = useQuery({
        queryKey: ["permissions", selectedRole],
        queryFn: async () => {
            const res = await getPermissionsByRole(selectedRole);
            return res?.data || [];
        },
        enabled: !!selectedRole && modules.length > 0,
    });

    // ================= MERGE PERMISSIONS =================
    useEffect(() => {
        if (!modules.length) return;

        const merged = modules.map((module) => {
            const found = permissionsData.find((p) => p.module === module);

            return {
                module,
                create: found?.create ?? false,
                read: found?.read ?? false,
                update: found?.update ?? false,
                delete: found?.delete ?? false,
            };
        });

        setPermissions(merged);
    }, [modules, permissionsData]);

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

    // ================= SELECT ROLE =================
    const handleSelect = (role) => {
        setSelectedRole(role);
        setOpen(false);
    };

    const hasAnyPermissionSelected = permissions.some(
        (p) => p.create || p.read || p.update || p.delete
    );

    return (
        <div className={styles.container}>

            {/* HEADER */}
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Add Permissions for Selected Role
                </h2>

                <div className={styles.dropdownWrapper}>
                    <div
                        className={styles.selectBox}
                        onClick={() => setOpen(!open)}
                    >
                        {selectedRole || "Select Role"}
                    </div>

                    {open && (
                        <div className={styles.dropdownList}>
                            {rolesList.map((role) => (
                                <div
                                    key={role._id}
                                    className={`${styles.option} ${
                                        selectedRole === role.name ? styles.active : ""
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

            {/* TABLE */}
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

                                    <td className={styles.center}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={
                                                item.create &&
                                                item.read &&
                                                item.update &&
                                                item.delete
                                            }
                                            onChange={() => handleSelectAll(index)}
                                        />
                                    </td>

                                    {["create", "read", "update", "delete"].map((field) => (
                                        <td key={field} className={styles.center}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={item[field]}
                                                onChange={() => handleChange(index, field)}
                                            />
                                        </td>
                                    ))}
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
                    disabled={saving || !selectedRole || !hasAnyPermissionSelected}
                >
                    {saving ? "Saving..." : "Save Permissions"}
                </button>
            </div>
        </div>
    );
};

export default PermissionManagement;