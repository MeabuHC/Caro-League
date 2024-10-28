import styles from "../styles/components/SettingButtons.module.css";

export function SettingButtons({ isChanged, isValid, onCancel, onSave }) {
  return (
    <div className={styles.buttons}>
      <button
        tabIndex={-1}
        onClick={onCancel}
        className={`${styles.button} ${
          isChanged ? styles.active_cancel : styles.disappear
        }`}
      >
        CANCEL
      </button>
      <button
        className={`${styles.button} ${
          isChanged
            ? isValid
              ? styles.active
              : styles.disabled
            : styles.disabled
        } $`}
        onClick={onSave}
      >
        SAVE CHANGES
      </button>
    </div>
  );
}
