// src/components/AuthButtonList.js
import React from "react";
import styles from "../styles/components/AuthButtonList.module.css"; // assuming you're keeping the same styles

const AuthButtonList = ({ children }) => {
  return (
    <div className={styles.social}>
      <ul>
        {React.Children.map(children, (child, index) => (
          <li key={index} className={styles.socialLink}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthButtonList;
