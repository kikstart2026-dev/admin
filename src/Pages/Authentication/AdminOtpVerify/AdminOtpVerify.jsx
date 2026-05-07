import React, { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import "../../../Main.scss";
import styles from "../AdminResetPass/AdminResetPass.module.scss";
import AuthLeft from "../../../Component/Authentication/AuthLeft/AuthLeft";
import logo from "../../../assets/images/authLogo.png";
import Button from "../../../Component/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { adminVerifyOtp, adminResendOtp } from "../../../apis/api";
import { handleError, handleSuccess } from "../../../utils";

export default function AdminOtpVerify() {
  const navigate = useNavigate();
  const email = localStorage.getItem("adminEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);

  const inputsRef = useRef([]);

  // ================= VERIFY OTP =================
  const { mutate, isPending } = useMutation({
    mutationKey: ["admin-verify-otp"],
    mutationFn: adminVerifyOtp,

    onSuccess: (data) => {
      console.log("Admin OTP Verify Response:", data);

      const token = data?.token;
      const user = data?.user;

      // ✅ TOKEN SAVE
      if (token) {
        Cookies.set("token", token, { expires: 7 });
      }

      // ✅ SAFE LOCALSTORAGE SAVE (ONLY REQUIRED FIELDS)
      if (user) {
        const adminData = {
          role: user?.role || "",
          dynamicRole: user?.dynamicRole || "",
          image: user?.image || null,
          fullname: user?.fullname || "",
          email: user?.email || "",
          phone: user?.phone || "",
          location: user?.location || "",
          passcode: user?.passcode || "",
        };

        localStorage.setItem("adminUser", JSON.stringify(adminData));
      }

      // cleanup
      localStorage.removeItem("otpExpiryTime");
      localStorage.removeItem("resendEnableTime");
      localStorage.removeItem("adminEmail");

      handleSuccess("Admin login successful ✅");

      // dashboard redirect
      navigate("/", { replace: true });
    },

    onError: (error) => {
      handleError(
        error?.response?.data?.message || "OTP verification failed ❌"
      );
    },
  });

  // ================= RESEND OTP =================
  const { mutate: resendMutate, isPending: isResendPending } = useMutation({
    mutationKey: ["admin-resend-otp"],
    mutationFn: adminResendOtp,

    onSuccess: (data) => {
      handleSuccess(data?.message || "OTP resent successfully ✅");

      setOtp(["", "", "", "", "", ""]);
      if (inputsRef.current[0]) inputsRef.current[0].focus();

      const newExpiry = Date.now() + 90000;
      const newResend = Date.now() + 30000;

      localStorage.setItem("otpExpiryTime", newExpiry);
      localStorage.setItem("resendEnableTime", newResend);

      setOtpTimer(90);
      setResendTimer(30);
    },

    onError: (error) => {
      handleError(error?.response?.data?.message || "Resend failed ❌");
    },
  });

  // ================= TIMER =================
  useEffect(() => {
    if (!email) return;

    const now = Date.now();

    if (!localStorage.getItem("otpExpiryTime")) {
      localStorage.setItem("otpExpiryTime", now + 90000);
    }

    if (!localStorage.getItem("resendEnableTime")) {
      localStorage.setItem("resendEnableTime", now + 30000);
    }

    const updateTimer = () => {
      const current = Date.now();

      const expiryTime = Number(localStorage.getItem("otpExpiryTime"));
      const resendTime = Number(localStorage.getItem("resendEnableTime"));

      setOtpTimer(Math.max(0, Math.floor((expiryTime - current) / 1000)));
      setResendTimer(Math.max(0, Math.floor((resendTime - current) / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [email]);

  // ================= OTP INPUT =================
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      handleError("Enter complete OTP ❌");
      return;
    }

    mutate({ email, otp: finalOtp });
  };

  // ================= RESEND =================
  const handleResendOtp = () => {
    resendMutate({ email });
  };

  // ================= GUARD =================
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  return (
    <div className={styles.resetpass}>
      <div className={styles.resetpassWrap}>
        <div className="row">

          {/* LEFT */}
          <div className="col-6">
            <AuthLeft comment="Admin Panel" linkName="" />
          </div>

          {/* RIGHT */}
          <div className={`col-6 ${styles.right}`}>
            <div className={styles.formBox}>

              <div className={styles.head}>
                <figure className={styles.fig}>
                  <img src={logo} alt="logo" />
                </figure>

                <h2 className={styles.head2}>Admin OTP Verification</h2>
                <p className={styles.para}>
                  Enter 6-digit OTP sent to admin email
                </p>
              </div>

              <form className={styles.authForm} onSubmit={handleSubmit}>

                {/* OTP INPUT */}
                <div style={{ display: "flex", gap: "15px" }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      style={{
                        width: "65px",
                        height: "65px",
                        textAlign: "center",
                        fontSize: "22px",
                        borderRadius: "12px",
                      }}
                    />
                  ))}
                </div>

                {/* TIMER */}
                <div style={{ textAlign: "center", margin: "15px 0" }}>
                  <p>OTP expires in <b>{otpTimer}s</b></p>

                  {resendTimer > 0 ? (
                    <p>Resend in <b>{resendTimer}s</b></p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResendPending}
                    >
                      {isResendPending ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  text={isPending ? "VERIFYING..." : "VERIFY"}
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