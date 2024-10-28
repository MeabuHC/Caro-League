import { SettingItem } from "../components/SettingItem";
import styles from "../styles/pages/Settings.module.css";

export default function Settings() {
  return (
    <div className={`${styles.settings_container} container`}>
      <div className={styles.section}>
        <SettingItem
          header={"Avatar"}
          content={
            "Your avatar represents you in Caro League. Choose one that reflects your style and helps friends recognize you easily."
          }
          type={"avatar"}
        />

        <SettingItem
          header={"Username"}
          content={
            "Your Caro League username helps other players find and challenge you."
          }
          type={"username"}
        />

        <SettingItem
          header={"Account Security"}
          content={
            "Login to Your Caro League Account. You should change your password regularly to minimize the chances of your account being accessed by unauthorized users."
          }
          type={"password"}
        />
      </div>
    </div>
  );
}
