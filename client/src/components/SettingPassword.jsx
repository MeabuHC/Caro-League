import { SettingTextInput } from "./SettingTextInput";
import { useUserContext } from "../context/UserContext";
import styles from "../styles/components/SettingPassword.module.css";
import { SettingPasswordInput } from "./SettingPasswordInput";
import { useEffect, useState } from "react";
import { SettingButtons } from "./SettingButtons";

export function SettingPassword() {
  const { user } = useUserContext();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validNewPassword, setValidNewPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  //Valid to submit
  const isValid =
    passwords["oldPassword"] &&
    passwords["newPassword"] &&
    passwords["confirmPassword"] &&
    passwords["newPassword"] === passwords["confirmPassword"] &&
    validNewPassword;

  //Set is changed based on input
  useEffect(() => {
    const { oldPassword, newPassword, confirmPassword } = passwords;
    setIsChanged(
      oldPassword !== "" || newPassword !== "" || confirmPassword !== ""
    );
  }, [passwords]);

  // Reset input
  const handleCancel = () => {
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  //Handle change password
  const handleSave = () => {
    console.log("Hello");
  };

  return (
    <>
      <SettingTextInput
        label={"email"}
        isReadOnly={true}
        isDisabled={true}
        value={maskEmail(user.email)}
      />
      <p className={styles.password_title}>Change Password</p>
      <div className={styles.inputs}>
        <SettingPasswordInput
          passwords={passwords}
          setPasswords={setPasswords}
          label={"CURRENT PASSWORD"}
          type="oldPassword"
        />
        <SettingPasswordInput
          passwords={passwords}
          setPasswords={setPasswords}
          label={"NEW PASSWORD"}
          type="newPassword"
          setValidNewPassword={setValidNewPassword}
        />
        <SettingPasswordInput
          passwords={passwords}
          setPasswords={setPasswords}
          label={"CONFIRM PASSWORD"}
          type="confirmPassword"
        />
      </div>
      <SettingButtons
        isChanged={isChanged}
        isValid={isValid}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </>
  );
}

function maskEmail(email) {
  const [name, domain] = email.split("@");
  const maskedName = name[0] + "*".repeat(name.length - 2) + name.slice(-1);
  return `${maskedName}@${domain}`;
}
