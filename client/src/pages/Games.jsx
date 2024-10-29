import React, { useContext } from "react";
import { useUserContext } from "../context/UserContext";
import styles from "../styles/pages/Games.module.css"; // Create a new CSS module for styling

export default function Games() {
  const { user } = useUserContext();

  return (
    <div className={`${styles.lobby_container} container`}>
      <div className={styles.card}>
        <div className={styles.top_card}>
          <img src={`${user.avatarUrl}`} alt="Avatar"></img>
          <span>{user.username}</span>
        </div>
        {/* Rank */}
        <div className={styles.rank}>
          <img
            src="https://imgsvc.trackercdn.com/url/size(128),fit(contain)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Ftft%2Franks%2F2022%2Femerald.png/image.png"
            alt="Rank Image"
          />
          <div className={styles.text}>
            <h2>EMERALD IV</h2>
            <div className={styles.progress_bar}></div>
            <span>Tier progress: 75 LP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
