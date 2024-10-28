import styles from "../styles/components/SettingButtons.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export function SettingButtons({
  isChanged,
  isValid,
  onCancel,
  onSave,
  loading = false,
}) {
  let buttonText;
  if (loading) {
    buttonText = (
      <Spin
        indicator={<LoadingOutlined spin />}
        size="small"
        style={{ color: "white" }}
      />
    );
  } else {
    buttonText = "SAVE CHANGES";
  }

  return (
    <div className={styles.buttons}>
      <button
        tabIndex={-1}
        onClick={onCancel}
        className={`${styles.button} ${
          isChanged ? styles.active_cancel : styles.disappear
        }`}
        disabled={loading}
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
        disabled={loading}
      >
        {buttonText}
      </button>
    </div>
  );
}
