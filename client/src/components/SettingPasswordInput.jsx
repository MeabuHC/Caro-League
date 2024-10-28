import { useState } from "react";
import styles from "../styles/components/SettingPasswordInput.module.css";
import showIcon from "../assets/svg/eye.svg";
import hideIcon from "../assets/svg/eye-cross.svg";
import crossIcon from "../assets/svg/cross-icon.svg";
import tickIcon from "../assets/svg/tick-icon.svg";

export function SettingPasswordInput({
  passwords,
  setPasswords,
  setValidNewPassword,
  maxLength = 20,
  label,
  isReadOnly = false,
  isDisabled = false,
  type,
}) {
  const [focused, setFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const value = passwords[type];

  const isEmpty = value.length === 0;

  const handleChange = (e) => {
    const newValue = e.target.value;

    // Limit the length of the password
    if (maxLength && newValue.length > maxLength) return;

    // Update the password state
    setPasswords((prev) => ({ ...prev, [type]: newValue }));

    // Validate password immediately after updating
    const isValidLength = newValue.length >= 6;
    const isValidPattern = checkPasswordCriteria(newValue);
    const isValidPassword = isValidLength && isValidPattern;

    if (type === "newPassword") {
      setValidNewPassword(isValidPassword);
    }
  };

  function checkPasswordCriteria(password) {
    const regex =
      /^(?=(?:[^a-zA-Z]*[a-zA-Z]){1})(?=(?:[^\d]*\d){1})(?=(?:[^\W_]*[\W_]){1}).{3,}$/;
    return regex.test(password);
  }

  const isConfirmPasswordDifferent =
    passwords["confirmPassword"] !== passwords["newPassword"];

  return (
    <>
      <div
        className={`${styles.field_input} ${
          value.length === 0 ? "" : styles.notEmpty
        } ${
          type === "newPassword" &&
          checkPasswordCriteria(value) &&
          value.length >= 6
            ? styles.validNewPassword
            : type === "newPassword" && value.length > 0
            ? styles.invalidPassword
            : ""
        } ${
          type === "confirmPassword" && isConfirmPasswordDifferent
            ? styles.invalidPassword
            : ""
        }`}
      >
        <input
          type={isPasswordVisible ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          readOnly={isReadOnly}
          disabled={isDisabled}
        />
        <label>{label}</label>
        <span className={`${styles.emptyLabel}`}>{label}</span>

        <button
          className={`${styles.icon_container} ${
            focused ? "" : styles.unclickable
          }`}
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsPasswordVisible(!isPasswordVisible);
          }}
        >
          {focused && (
            <img
              src={isPasswordVisible ? showIcon : hideIcon}
              className={styles.icon}
              alt={isPasswordVisible ? "Hide password" : "Show password"}
            />
          )}
        </button>
      </div>
      {focused && type === "newPassword" && (
        <div className={styles.help_panel}>
          <div className={styles.help_item}>
            <img
              src={value.length >= 6 ? tickIcon : crossIcon}
              alt="Validation"
            />
            <p>At least 6 characters long</p>
          </div>
          <div className={styles.help_item}>
            <img
              src={checkPasswordCriteria(value) ? tickIcon : crossIcon}
              alt="Validation"
            />
            <p>
              Must contain at least 3 of the following characters: letters,
              numbers, or symbols.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
