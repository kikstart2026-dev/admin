import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {handleError, handleSuccess, handleWarning, handleConfirm, } from "../../utils"
import {
  getPermissionsByRole,
  createPermission,
  updatePermission,
  getAllRoles,
} from "../../apis/api";

import { menuData } from "../../DATA/data";
import styles from "./PermissionManagement.module.scss";

const PermissionManagement = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  // ✅ FETCH ROLES
  const { data: rolesList = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  // ✅ FLATTEN MODULES
  const modules = useMemo(
    () => menuData.flatMap((item) => item.modules),
    []
  );

  // ✅ FETCH PERMISSIONS
  const { data: permissionsData = [], isLoading: loading } = useQuery({
    queryKey: ["permissions", selectedRole],
    queryFn: async () => {
      if (!selectedRole) return [];
      const res = await getPermissionsByRole(selectedRole);
      return res?.data || [];
    },
    enabled: !!selectedRole,
  });

  const isAdmin = selectedRole?.toLowerCase() === "admin";

  // ✅ MERGE DATA + ADMIN AUTO TRUE
  useEffect(() => {
    if (!modules.length || !selectedRole) return;

    const merged = modules.map((module) => {
      const found = permissionsData.find((p) => p.module === module);

      return {
        _id: found?._id || null,
        module,
        create: isAdmin ? true : found?.create ?? false,
        read: isAdmin ? true : found?.read ?? false,
        update: isAdmin ? true : found?.update ?? false,
        delete: isAdmin ? true : found?.delete ?? false,
      };
    });

    setPermissions((prev) => {
      const prevString = JSON.stringify(prev);
      const newString = JSON.stringify(merged);
      return prevString === newString ? prev : merged;
    });
  }, [selectedRole, permissionsData, modules, isAdmin]);

  // ✅ TOGGLE SINGLE
  const handleChange = (moduleName, field) => {
    if (isAdmin) return;

    setPermissions((prev) =>
      prev.map((item) =>
        item.module === moduleName
          ? { ...item, [field]: !item[field] }
          : item
      )
    );
  };

  // ✅ SELECT ALL
  const handleSelectAll = (moduleName) => {
    if (isAdmin) return;

    setPermissions((prev) =>
      prev.map((item) => {
        if (item.module !== moduleName) return item;

        const allSelected =
          item.create && item.read && item.update && item.delete;

        return {
          ...item,
          create: !allSelected,
          read: !allSelected,
          update: !allSelected,
          delete: !allSelected,
        };
      })
    );
  };

  // ✅ SAVE
  const handleSave = async () => {
  if (!selectedRole) {
    handleWarning("Role is required");
    return;
  }

    try {
      setSaving(true);

      for (const perm of permissions) {
        const payload = {
          dynamicRole: selectedRole,
          module: perm.module,
          create: isAdmin ? true : perm.create,
          read: isAdmin ? true : perm.read,
          update: isAdmin ? true : perm.update,
          delete: isAdmin ? true : perm.delete,
        };

        const existing = permissionsData.find(
          (p) => p.module === perm.module && p.dynamicRole === selectedRole
        );

        if (existing) {
          await updatePermission(existing._id, payload);
        } else {
          await createPermission(payload);
        }
      }

      handleSuccess("Permissions saved successfully");
    } catch (err) {
      console.log(err);
      handleError("Save failed");
    } finally {
      setSaving(false);
    }
  };

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
        <h2>Add Permissions for Selected Role</h2>

        <div className={styles.dropdownWrapper}>
          <div className={styles.selectBox} onClick={() => setOpen(!open)}>
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

      {/* WARNING */}
      {!selectedRole && (
        <p style={{ color: "red" }}>Please select a role first</p>
      )}

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Modules</th>
                <th>Select All</th>
                <th>Create</th>
                <th>Read</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {menuData.map((section) => (
                <React.Fragment key={section.name}>
                  <tr>
                    <td colSpan="6" style={{ color: "red" }}>
                      {section.name}
                    </td>
                  </tr>

                  {section.modules.map((mod) => {
                    const item =
                      permissions.find((p) => p.module === mod) || {};

                    return (
                      <tr key={mod}>
                        <td>{mod}</td>

                        <td>
                          <input
                            type="checkbox"
                            checked={
                              item.create &&
                              item.read &&
                              item.update &&
                              item.delete
                            }
                            disabled={!selectedRole || isAdmin}
                            onChange={() => handleSelectAll(mod)}
                          />
                        </td>

                        {["create", "read", "update", "delete"].map(
                          (field) => (
                            <td key={field}>
                              <input
                                type="checkbox"
                                checked={item[field] || false}
                                disabled={!selectedRole || isAdmin}
                                onChange={() =>
                                  handleChange(mod, field)
                                }
                              />
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
                </React.Fragment>
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