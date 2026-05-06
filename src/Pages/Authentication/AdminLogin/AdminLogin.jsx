import React from "react";
import Cookies from "js-cookie";
import "../../../Main.scss";
import styles from "../AdminLogin/AdminLogin.module.scss";
import AuthLeft from "../../../Component/Authentication/AuthLeft/AuthLeft";
import logo from "../../../assets/images/authLogo.png";
import Button from "../../../Component/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "../../../apis/api";
import { handleError, handleSuccess } from "../../../utils";
// import "../../../Main.scss"

export default function AdminLogin() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["adminLogin"],
    mutationFn: adminLogin,

    onSuccess: (data) => {
      console.log("Admin Login Response:", data);

      // ❌ Extra safety check (optional)
      if (!data?.email) {
        handleError("Admin not found ❌");
        return;
      }

      // ✅ OTP flow
      localStorage.setItem("adminEmail", data.email);

      handleSuccess("OTP sent to admin email 📩");

      // 👉 OTP page e jao
      navigate("/admin-otp");
    },

    onError: (error) => {
      handleError(
        error?.response?.data?.message || "Admin not found ❌"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    mutate(payload);
  };

  return (
    <div className={styles.signin}>
      <div className={styles.signinWrap}>
        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-6">
            <AuthLeft comment="Admin Panel Login" linkName="" />
          </div>

          {/* RIGHT SIDE */}
          <div className={`col-6 ${styles.right}`}>
            <div className={styles.formBox}>

              {/* HEADER */}
              <div className={styles.head}>
                <figure className={styles.fig}>
                  <img src={logo} alt="logo" />
                </figure>
                <h2 className={styles.head2}>Admin Login</h2>
                <p className={styles.para}>
                  Please login as administrator
                </p>
              </div>

              {/* FORM */}
              <form className={styles.authForm} onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div className={styles.inputWrapper}>
                  <input
                    name="email"
                    className={styles.inp}
                    type="email"
                    placeholder=" "
                    required
                  />
                  <label className={styles.lbl}>Email</label>
                </div>

                {/* PASSWORD */}
                <div className={styles.inputWrapper}>
                  <input
                    name="password"
                    className={styles.inp}
                    type="password"
                    placeholder=" "
                    required
                  />
                  <label className={styles.lbl}>Password</label>
                </div>

                {/* FORGOT PASSWORD */}
                <div className={styles.forgotPassword}>
                  <span
                    className={styles.a}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin-forgot")}
                  >
                    Forgot password?
                  </span>
                </div>

                {/* BUTTON */}
                <Button
                  className={styles.submitBtn}
                  type="submit"
                  text={isPending ? "LOGGING IN..." : "LOGIN"}
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