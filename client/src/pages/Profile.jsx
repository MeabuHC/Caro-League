// ./pages/Profile.js
import React from "react";
import styles from "../styles/pages/Profile.module.css";
import { useUserContext } from "../context/UserContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function Profile() {
  const { user } = useUserContext();
  return (
    <>
      <div className={`${styles.profile_container} container`}>
        <div className={styles.cover_img}></div>
        <div className={styles.profile_header_container}>
          <div className={styles.avatar_container}>
            <img src={`${user.avatarUrl}`} alt="Avatar"></img>
          </div>
          <div className={styles.profile_username}>
            <span>{user.username}</span>
          </div>
        </div>
        <div className={styles.nav_bar}>
          <ul>
            <li className={styles.active}>
              <a>Overview</a>
            </li>
            <li>
              <a>Matches</a>
            </li>
          </ul>
        </div>
        <div className={styles.content_container}>
          <div className={styles.segment_stats}>
            <div className={styles.title}>
              <ExclamationCircleOutlined />
              <h2>Season Overview</h2>
            </div>
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
            <div className={styles.stats_row}>
              <div className={styles.stats_block}>
                <span className={styles.name}>Wins</span>
                <span className={styles.value}>140</span>
              </div>
              <div className={styles.stats_block}>
                <span className={styles.name}>Losses</span>
                <span className={styles.value}>138</span>
              </div>
              <div className={styles.stats_block}>
                <span className={styles.name}>Draws</span>
                <span className={styles.value}>2</span>
              </div>
              <div className={styles.stats_block}>
                <span className={styles.name}>Win %</span>
                <span className={styles.value}>50%</span>
              </div>
              <div className={styles.stats_block}>
                <span className={styles.name}>Matches Played</span>
                <span className={styles.value}>280</span>
              </div>
            </div>
            <div className={styles.fill_bottom}></div>
          </div>
        </div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
      </div>
    </>
  );
}
