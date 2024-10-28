// AuthSubmitButton.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/AuthSubmitButton.module.css"; // Adjust the path as needed

const AuthSubmitButton = ({ type }) => {
  return (
    <>
      <input
        type="submit"
        value={
          type === "signup" ? "SIGN UP" : type === "setup" ? "SETUP" : "LOG IN"
        }
        className={styles.btnSubmit}
      />

      <span className={styles.auth_link}>
        {type === "signup"
          ? "Already have an account? "
          : type === "setup"
          ? null
          : "Don’t have an account? "}
        {type === "signup" ? (
          <Link to="/login">Log In</Link>
        ) : type === "setup" ? null : (
          <Link to="/signup">Register</Link>
        )}
      </span>
    </>
  );
};

export default AuthSubmitButton;
