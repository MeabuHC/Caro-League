// AuthSubmitButton.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/AuthSubmitButton.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const AuthSubmitButton = ({ type, loading }) => {
  const buttonText =
    type === "signup" ? "SIGN UP" : type === "setup" ? "SETUP" : "LOG IN";

  return (
    <>
      <button type="submit" className={styles.btnSubmit} disabled={loading}>
        {loading ? (
          <Spin
            indicator={<LoadingOutlined spin />}
            size="small"
            style={{ color: "#f46119" }}
          />
        ) : (
          buttonText
        )}
      </button>

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
