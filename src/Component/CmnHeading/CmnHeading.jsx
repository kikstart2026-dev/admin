import React from 'react';
import styles from "./CmnHeading.module.scss";
import "../../Main.scss";

export default function CmnHeading({ title, subtitle, details, align = "center"
}) {
  return (
    <div className={`${styles.commonHeading} ${styles[align]}`}>
      <p className={styles.title}>{title}</p>
      <h2>{subtitle}</h2>
      <p className={styles.details}>{details}</p>
    </div>
  );
}