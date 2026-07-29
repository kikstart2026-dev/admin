import React, { useState } from "react";
import "../../../Main.scss";
import styles from "./AdminForgotPass.module.scss";
import AuthLeft from "../../../Component/Authentication/AuthLeft/AuthLeft";
import logo from "../../../assets/images/authLogo.png";
import Button from "../../../Component/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminForgotPass } from "../../../apis/api";
import { handleError, handleSuccess } from "../../../utils";

export default function AdminForgotPass() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["admin-forgot-pass"],
    mutationFn: adminForgotPass,

   onSuccess: (data) => {
  console.log("Admin Forgot Pass Response:", data);

  // ✅ Store email
  localStorage.setItem("adminResetEmail", email);

  // ✅ Store OTP for auto fill (Demo)
  if (data?.otp) {
    localStorage.setItem("demoOtp", String(data.otp));
  }

  handleSuccess("OTP sent to admin email 📩");

  navigate("/admin-reset");
},

    onError: (error) => {
      handleError(
        error?.response?.data?.message || "OTP send failed ❌"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      handleError("Email is required");
      return;
    }

    mutate({ email });
  };

  return (
    <div className={styles.forgetpass}>
      <div className={styles.forgetpassWrap}>
        <div className="row">

          {/* LEFT */}
          <div className="col-6">
            <AuthLeft comment="Admin Panel Access" linkName="" />
          </div>

          {/* RIGHT */}
          <div className={`col-6 ${styles.right}`}>
            <div className={styles.formBox}>

              {/* HEADER */}
              <div className={styles.head}>
                <figure className={styles.fig}>
                  <img src={logo} alt="logo" />
                </figure>

                <h2 className={styles.head2}>Admin Forgot Password</h2>

                <p className={styles.para}>
                  Enter your admin email to reset password
                </p>
              </div>

              {/* FORM */}
              <form className={styles.authForm} onSubmit={handleSubmit}>

                <div className={styles.inputWrapper}>
                  <input
                    name="email"
                    className={styles.inp}
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label className={styles.lbl}>Email</label>
                </div>

                <Button
                  className={styles.submitBtn}
                  type="submit"
                  text={isPending ? "SENDING..." : "CONTINUE"}
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