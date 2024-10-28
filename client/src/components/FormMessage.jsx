import React from "react";
import styles from "../styles/components/FormMessage.module.css";

export default function FormMessage({ type, message }) {
  if (type === "error")
    return (
      <div className={styles.errorMessage}>
        <span>{message}</span>
      </div>
    );
  else if (type === "success") {
    return (
      <div className={styles.successMessage}>
        <span>{message}</span>
      </div>
    );
  }
}
