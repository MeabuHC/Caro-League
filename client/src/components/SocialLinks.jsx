// src/components/SocialLinks.js
import React from "react";
import styles from "../styles/components/SocialLinks.module.css";

const SocialLinks = ({ links }) => {
  return (
    <div className={styles.social}>
      <ul>
        {links.map((link, index) => (
          <li key={index} className={styles.socialLink}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <img src={link.imgSrc} alt={link.altText} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialLinks;
