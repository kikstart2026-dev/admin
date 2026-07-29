import React, { useEffect, useState } from "react";
import "../../../Main.scss";
import styles from "./AdminResetPass.module.scss";
import AuthLeft from "../../../Component/Authentication/AuthLeft/AuthLeft";
import logo from "../../../assets/images/authLogo.png";
import Button from "../../../Component/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminResetPass } from "../../../apis/api";
import { handleError, handleSuccess } from "../../../utils";

export default function AdminResetPass() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // ✅ localStorage theke email ana
  useEffect(() => {
    const storedEmail = localStorage.getItem("adminResetEmail");

    if (!storedEmail) {
      navigate("/admin-forgot");
      return;
    }

    setEmail(storedEmail);

    // ✅ Demo OTP Auto Fill
    const savedOtp = localStorage.getItem("demoOtp");

    if (savedOtp) {
      setOtp(savedOtp);
    }
  }, [navigate]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["admin-reset-pass"],
    mutationFn: adminResetPass,
    onSuccess: (data) => {
      console.log("Admin Reset Response:", data);

      handleSuccess("Password updated successfully ✅");

      localStorage.removeItem("adminResetEmail");
      localStorage.removeItem("demoOtp");

      navigate("/login");
    },

    onError: (error) => {
      handleError(
        error?.response?.data?.message || "Reset failed ❌"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedEmail = localStorage.getItem("adminResetEmail");

    if (!storedEmail) {
      handleError("Email not found. Please try again.");
      navigate("/admin-forgot");
      return;
    }

    if (newPassword !== confirmPassword) {
      handleError("Passwords do not match!");
      return;
    }

    const payload = {
      email: storedEmail,
      otp: otp,
      password: newPassword,
      confirmpass: confirmPassword,
    };

    console.log("Sending Payload:", payload);

    mutate(payload);
  };

  return (
    <div className={styles.resetpass}>
      <div className={styles.resetpassWrap}>
        <div className="row">

          {/* LEFT */}
          <div
            className={`col-6 ${styles.left}`}
            onClick={(e) => {
              if (e.target.innerText === "Login") {
                e.preventDefault();
                navigate("/login");
              }
            }}
          >
            <AuthLeft comment="Back to login?" linkName="Login" />
          </div>

          {/* RIGHT */}
          <div className={`col-6 ${styles.right}`}>
            <div className={styles.formBox}>
              <div className={styles.head}>
                <figure className={styles.fig}>
                  <img src={logo} alt="logo" />
                </figure>
                <h2 className={styles.head2}>Admin Reset Password</h2>
                <p className={styles.para}>
                  Enter OTP and new password
                </p>
              </div>

              <form className={styles.authForm} onSubmit={handleSubmit}>

                {/* OTP */}
                <div className={styles.formGroup}>
                  <div className={styles.inputWrapper}>
                    <input
                      className={styles.inp}
                      type="text"
                      placeholder=" "
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <label className={styles.lbl}>
                      OTP
                    </label>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div className={styles.formGroup}>
                  <div className={styles.inputWrapper}>
                    <input
                      className={styles.inp}
                      type="password"
                      placeholder=" "
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <label className={styles.lbl}>
                      New Password
                    </label>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className={styles.formGroup}>
                  <div className={styles.inputWrapper}>
                    <input
                      className={styles.inp}
                      type="password"
                      placeholder=" "
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <label className={styles.lbl}>
                      Confirm Password
                    </label>
                  </div>
                </div>

                <Button
                  className={styles.submitBtn}
                  type="submit"
                  text={isPending ? "UPDATING..." : "UPDATE"}
                  disabled={isPending}
                  variant="primary"
                />

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}