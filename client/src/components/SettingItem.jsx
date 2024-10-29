import styles from "../styles/components/SettingItem.module.css";
import { SettingAvatar } from "./SettingAvatar";
import { SettingPassword } from "./SettingPassword";
import { SettingUsername } from "./SettingUsername";

export function SettingItem({ header, content, type }) {
  return (
    <div className={styles.setting_item}>
      <div className={styles.left_setting}>
        <h1>{header}</h1>
        <p>{content}</p>
      </div>
      <div className={styles.right_setting}>
        {type === "avatar" && <SettingAvatar />}
        {type === "username" && <SettingUsername />}
        {type === "password" && <SettingPassword />}
      </div>
    </div>
  );
}
