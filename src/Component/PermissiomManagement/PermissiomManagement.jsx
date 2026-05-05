import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPermissionsByRole,
  savePermissions,
  getAllRoles,
  createPermission,     
  updatePermission   
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

  // ✅ FETCH PERMISSIONS BY ROLE
  const {
    data: permissionsData = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ["permissions", selectedRole],
    queryFn: async () => {
      if (!selectedRole) return [];
      const res = await getPermissionsByRole(selectedRole);
      console.log("API PERMISSIONS RESPONSE:", res);
      return res?.data || [];
    },
    enabled: !!selectedRole,
  });

  // ✅ MERGE DEFAULT + API DATA
useEffect(() => {
  if (!modules.length) return;

  const merged = modules.map((module) => {
    const found = permissionsData.find((p) => p.module === module);

    return {
      _id: found?._id || null,   // 🔥 THIS LINE IS CRITICAL
      module,
      create: found?.create ?? false,
      read: found?.read ?? false,
      update: found?.update ?? false,
      delete: found?.delete ?? false,
    };
  });

  setPermissions(merged);
}, [modules, permissionsData]);

  // ✅ TOGGLE SINGLE
  const handleChange = (moduleName, field) => {
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

  // ✅ SAVE (BULK)
const handleSave = async () => {
  if (!selectedRole) {
    alert("Role is required");
    return;
  }

  try {
    setSaving(true);

    console.log("START SAVE PROCESS");

    for (const perm of permissions) {
      const payload = {
        dynamicRole: selectedRole,
        module: perm.module,
        create: perm.create,
        read: perm.read,
        update: perm.update,
        delete: perm.delete,
      };

      // 🔥 CHECK USING permissionsData (NOT _id)
      const existing = permissionsData.find(
        (p) =>
          p.module.trim() === perm.module.trim() &&
          p.dynamicRole === selectedRole
      );

      try {
        if (existing) {
          console.log("UPDATING:", perm.module, existing._id);

          await updatePermission(existing._id, payload);
        } else {
          console.log("CREATING:", perm.module);

          await createPermission(payload);
        }
      } catch (err) {
        console.log(
          `❌ ERROR in ${perm.module}:`,
          err.response?.data || err.message
        );
      }
    }

    alert("Permissions saved successfully");
  } catch (err) {
    console.log("FINAL ERROR:", err);
    alert("Save failed");
  } finally {
    setSaving(false);
  }
};

  // ✅ SELECT ROLE
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

      {/* MESSAGE */}
      {!selectedRole && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          Please select a role first
        </p>
      )}

      {/* TABLE */}
      {loading ? (
        <p className={styles.loading}>Loading permissions...</p>
      ) : (
        <div
          className={`${styles.tableWrapper} ${
            !selectedRole ? styles.disabledTable : ""
          }`}
        >
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
                    <td
                      colSpan="6"
                      style={{
                        color: "#ED1C24",
                        fontWeight: "600",
                        paddingTop: "20px",
                      }}
                    >
                      {section.name}
                    </td>
                  </tr>

                  {section.modules.map((mod) => {
                    const item =
                      permissions.find((p) => p.module === mod) || {};

                    return (
                      <tr key={mod}>
                        <td className={styles.moduleCell}>{mod}</td>

                        <td className={styles.center}>
                          <input
                            type="checkbox"
                            checked={
                              item.create &&
                              item.read &&
                              item.update &&
                              item.delete
                            }
                            disabled={!selectedRole}
                            onChange={() => handleSelectAll(mod)}
                          />
                        </td>

                        {["create", "read", "update", "delete"].map(
                          (field) => (
                            <td key={field} className={styles.center}>
                              <input
                                type="checkbox"
                                checked={item[field] || false}
                                disabled={!selectedRole}
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
          disabled={
            saving || !selectedRole || !hasAnyPermissionSelected
          }
        >
          {saving ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </div>
  );
};

export default PermissionManagement;