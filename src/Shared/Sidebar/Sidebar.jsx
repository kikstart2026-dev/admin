import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

import styles from "./Sidebar.module.scss";
import "../../Main.scss";

import { adminLogout } from "../../apis/api";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = JSON.parse(localStorage.getItem("adminUser"))?.email;

  // ================= TOGGLE =================
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleContent = () => setContentOpen((prev) => !prev);

  // ================= LOGOUT =================
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationKey: ["admin-logout"],
    mutationFn: adminLogout,

    onSuccess: () => {
      Cookies.remove("token");
      localStorage.removeItem("adminUser");
      localStorage.clear();

      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    },

    onError: (error) => {
      alert(error?.response?.data?.message || "Logout failed ❌");
    },
  });

  // ================= AUTO DROPDOWN =================
  useEffect(() => {
    const paths = [
      "/home-page",
      "/about-control",
      "/contact-control",
      "/faq-page",
      "/interested-schools",
      "/why-us",
      "/role-management",
      "/permission-management"
    ];

    if (paths.includes(location.pathname)) {
      setContentOpen(true);
    }
  }, [location.pathname]);

  // ================= SAFE BODY LOCK =================
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogoutModal]);

  return (
    <>
      {/* HAMBURGER */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>

      {/* SIDEBAR */}
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles.open : styles.close
        }`}
      >
        <ul className="list-unstyled">
          {/* DASHBOARD */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-speedometer2 ${styles.icon}`}></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* CMS */}
          <li>
            <NavLink
              to="/home-page"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i
                className={`bi bi-layout-text-window-reverse ${styles.icon}`}
              ></i>
              <span>CMS</span>
            </NavLink>
          </li>

          {/* USER CONTROL */}
          <li>
            <NavLink
              to="/user-control"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-people ${styles.icon}`}></i>
              <span>User Control</span>
            </NavLink>
          </li>

          {/* ROLE MANAGEMENT */}
          <li>
            <NavLink
              to="/role-management"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-person-gear ${styles.icon}`}></i>
              <span>Role Management</span>
            </NavLink>
          </li>

          {/* PERMISSION MANAGEMENT */}
          <li>
            <NavLink
              to="/permission-management"
              className={({ isActive }) =>
                isActive ? styles.active : ""
              }
            >
              <i className={`bi bi-pencil-square ${styles.icon}`}></i>
              <span>Permissions Management</span>
            </NavLink>
          </li>

          {/* LOGOUT */}
          <li>
            <div
              className={styles.logoutItem}
              onClick={() => setShowLogoutModal(true)}
            >
              <i className={`bi bi-box-arrow-right ${styles.icon}`}></i>
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className={styles.logoutToast}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.logoutIconCircle}>
              <div className={styles.logoutIcon}>
                <i className="bi bi-box-arrow-left"></i>
              </div>
            </div>

            <p className={styles.logoutText}>
              Are you sure you want to logout?
            </p>

            <div className={styles.logoutActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className={styles.btnConfirm}
                disabled={isPending}
                onClick={() => {
                  if (!email) {
                    alert("Email not found ❌");
                    return;
                  }
                  logoutMutate({ email });
                }}
              >
                {isPending ? "Logging out..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}