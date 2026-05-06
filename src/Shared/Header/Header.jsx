import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import "../../Main.scss";
import { FaBell } from "react-icons/fa";
import kiklogo from "../../assets/images/authLogo.png";

export default function Header({ title = "Dashboard" }) {
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // ================= SCROLL LOCK ADD HERE =================
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`${styles.header} d-flex align-items-center justify-content-between`}
      >
        <div className="d-flex align-items-center">
          <img src={kiklogo} alt="logo" className={styles.logo} />
        </div>

        <div className={styles.pageTitle}>
          <h5>{title}</h5>
        </div>

        <div className={`d-flex align-items-center ${styles.rightSection}`}>
          <FaBell className={styles.icon} />

          <div
            className="d-flex align-items-center ms-3"
            style={{ cursor: "pointer" }}
            onClick={() => setOpen(true)}
          >
            {admin?.image ? (
              <img src={admin.image} alt="admin" className={styles.avatar} />
            ) : (
              <div className={styles.fallbackAvatar}>
                {admin?.fullname?.charAt(0) || "A"}
              </div>
            )}

            <span className="ms-2">
              Welcome, {admin?.fullname || "Admin"}
            </span>
          </div>
        </div>
      </header>

      {/* ================= MODAL ================= */}
      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Admin Details</h3>

            {admin?.image ? (
              <img
                src={admin.image}
                alt="admin"
                className={styles.modalImage}
              />
            ) : (
              <div className={styles.modalFallback}>
                {admin?.fullname?.charAt(0) || "A"}
              </div>
            )}

            <div className={styles.modalInfo}>
              <p><b>Role:</b> {admin?.role}</p>
              <p><b>Name:</b> {admin?.fullname}</p>
              <p><b>Email:</b> {admin?.email}</p>
              <p><b>Phone:</b> {admin?.phone || "N/A"}</p>
              <p><b>Location:</b> {admin?.location || "N/A"}</p>
              <p><b>Passcode:</b> {admin?.passcode || "N/A"}</p>
            </div>

            <button
              className={styles.modalCloseBtn}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}