import React from "react";
import styles from "./Button.module.scss";
import "../../Main.scss";

export default function Button({
  text,
  onClick,
  variant = "primary",
  className = "",
  type="button"
}) {
  return (
    <button
      type={type}
      className={`${styles.customBtn} ${styles[variant]} ${className}`}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
}