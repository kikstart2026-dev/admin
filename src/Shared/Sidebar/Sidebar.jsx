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

  // ✅ admin email from localStorage
  const email = JSON.parse(localStorage.getItem("adminUser"))?.email;

  // ================= TOGGLE =================
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleContent = () => setContentOpen((prev) => !prev);

  // ================= LOGOUT API =================
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationKey: ["admin-logout"],
    mutationFn: adminLogout,

    onSuccess: (data) => {
      console.log("Logout Success:", data);

      // clear auth
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

  // ================= AUTO OPEN DROPDOWN =================
  useEffect(() => {
    const paths = [
      "/home-page",
      "/about-control",
      "/contact-control",
      "/faq-page",
      "/interested-schools",
      "/why-us",
    ];

    if (paths.includes(location.pathname)) {
      setContentOpen(true);
    }
  }, [location.pathname]);

  return (
    <>
      {/* ================= HAMBURGER ================= */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.close}`}
      >
        <ul className="list-unstyled">

          {/* DASHBOARD */}
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>
              <i className={`bi bi-speedometer2 ${styles.icon}`}></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* CONTENT MANAGEMENT */}
          <li>
            <div onClick={toggleContent} className={styles.dropdownTitle}>
              <div className={styles.dropdownLeft}>
                <i className={`bi bi-layout-text-window-reverse ${styles.icon}`}></i>
                <span>Content Management</span>
              </div>

              <i className={`bi ${contentOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
            </div>

            {contentOpen && (
              <ul className={styles.submenu}>
                <li><NavLink to="/home-page">Home Page</NavLink></li>
                <li><NavLink to="/about-control">About Page</NavLink></li>
                <li><NavLink to="/contact-control">Contact Page</NavLink></li>
                <li><NavLink to="/why-us">Why Us Page</NavLink></li>
                <li><NavLink to="/faq-page">Faq Page</NavLink></li>
                <li><NavLink to="/interested-schools">Interested Schools</NavLink></li>
              </ul>
            )}
          </li>

          {/* USER CONTROL */}
          <li>
            <NavLink to="/user-control">
              <i className={`bi bi-people ${styles.icon}`}></i>
              <span>User Control</span>
            </NavLink>
          </li>

          {/* ================= LOGOUT ================= */}
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
              <i className="bi bi-box-arrow-left"></i>
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
                onClick={() => {
                  if (!email) {
                    alert("Email not found ❌");
                    return;
                  }

                  logoutMutate({ email }); // ✅ API CALL
                }}
              >
                {isPending ? "logging out..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}