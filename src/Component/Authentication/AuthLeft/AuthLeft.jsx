import React, { useState, useEffect } from "react";
import face from "../../../assets/images/face.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./AuthLeft.module.scss";
import { useGoogleLogin } from "@react-oauth/google";
import { adminGoogleAuth } from "../../../apis/api";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

export default function AuthLeft({ comment, linkName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeSocial, setActiveSocial] = useState(null);

  const oppositePath =
    location.pathname === "/signup" ? "/signin" : "/signup";

  const hasContent = comment && linkName;

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("darkTheme");
    } else {
      document.body.classList.remove("darkTheme");
    }
  }, [darkMode]);

  // ⭐ Mutation Google Login
  const { mutate: googleMutate, isPending } = useMutation({
    mutationFn: adminGoogleAuth,

    onSuccess: (result) => {
      const { token, user } = result;

      // ✅ Save token in cookie
      Cookies.set("token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      // ✅ Save user info
        localStorage.setItem(
          "adminUser",
          JSON.stringify(user)
        );

      navigate("/");
    },

    onError: (error) => {
      console.log(
        "Google Login Error:",
        error?.response?.data || error.message
      );
    },
  });

  // ⭐ Google Response
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        googleMutate({
          code: authResult.code,
        });
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    }
  };

  // ⭐ Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className={`${styles.left} ${darkMode ? styles.dark : ""}`}>
      <div className={styles.leftDiv}>
        <div className={styles.toggleWrap}>
          <button
            className={styles.toggleBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <i className="bi bi-sun-fill"></i>
            ) : (
              <i className="bi bi-moon-fill"></i>
            )}
          </button>
        </div>

        <figure className={styles.figu}>
          <img src={face} alt="face" className={styles.ima} />
        </figure>

        {hasContent && (
          <div className={styles.paragraph}>
            <p className={styles.com}>{comment}</p>
            <Link to={oppositePath} className={styles.redL}>
              {linkName}
            </Link>
          </div>
        )}

        <div className={styles.socialLogin}>
          <button
            onClick={() => {
              setActiveSocial("google");
              googleLogin();
            }}
            className={`${styles.googleBtn} ${
              activeSocial === "google" ? styles.activeGoogle : ""
            }`}
          >
            <i className="bi bi-google ii"></i>
            {isPending ? "Logging in..." : "Continue with Google"}
          </button>

          <button
            onClick={() => setActiveSocial("facebook")}
            className={`${styles.facebookBtn} ${
              activeSocial === "facebook" ? styles.activeFacebook : ""
            }`}
          >
            <i className="bi bi-facebook ii"></i>
            Continue with Facebook
          </button>
        </div>

        <div className={styles.decor}></div>
      </div>
    </div>
  );
}