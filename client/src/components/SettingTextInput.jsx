import styles from "../styles/components/SettingTextInput.module.css";
import { useState } from "react";
import Alert from "antd/es/alert/Alert";
import { WarningOutlined } from "@ant-design/icons";

export function SettingTextInput({
  originalValue = "",
  value,
  setValue,
  error,
  setError,
  minLength = 0,
  maxLength,
  label,
  setIsChanged,
  setIsValid,
  isReadOnly = false,
  isDisabled = false,
}) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (maxLength && newValue.length > maxLength) return;

    setValue(newValue);
    setError(null);

    setIsChanged(newValue !== originalValue);
    setIsValid(newValue.length >= minLength);
  };

  const isTooShort = value.length < minLength;
  const isEmpty = value.length === 0;

  return (
    <div
      className={`${styles.field_input} ${isReadOnly ? styles.readOnly : ""} ${
        (isTooShort || error) && styles.invalid_input
      } ${!focused && isEmpty ? styles.isEmpty : ""}`}
    >
      {maxLength > 0 && (
        <span className={styles.countdown}>{maxLength - value.length}</span>
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        readOnly={isReadOnly}
        disabled={isDisabled}
      />
      <label>{label}</label>
      <span className={styles.emptyLabel}>{label}</span>
      {error && (
        <Alert
          description={
            <span>
              <WarningOutlined /> {error}
            </span>
          }
          type="error"
          closable
          className={styles.error}
        />
      )}
    </div>
  );
}
