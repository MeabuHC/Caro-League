import { SettingTextInput } from "./SettingTextInput";
import { useUserContext } from "../context/UserContext";
import styles from "../styles/components/SettingPassword.module.css";
import { SettingPasswordInput } from "./SettingPasswordInput";
import { useEffect, useState } from "react";
import { SettingButtons } from "./SettingButtons";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import Alert from "antd/es/alert/Alert";
import { WarningOutlined, CheckCircleOutlined } from "@ant-design/icons";
import delay from "../utils/delay";

export function SettingPassword() {
  const { user } = useUserContext();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validNewPassword, setValidNewPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [messages, setMessages] = useState({
    error: "",
    success: "",
  });
  const [loading, setLoading] = useState(false);

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
    setMessages({
      error: "",
      success: "",
    });
  };

  //Handle change password
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axiosWithRefreshToken(
        "/change-password",
        "patch",
        passwords
      );

      setMessages((prev) => ({
        ...prev,
        success: "Your password has been successfully changed.",
      }));
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    } finally {
      setLoading(false);
    }
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
      {messages["error"] && (
        <Alert
          description={
            <span>
              <WarningOutlined /> {messages["error"]}
            </span>
          }
          type="error"
          closable
          className={styles.error}
          onClose={() => setMessages({ error: "", success: "" })}
        />
      )}
      {messages["success"] && (
        <Alert
          description={
            <span>
              <CheckCircleOutlined /> {messages["success"]}
            </span>
          }
          type="success"
          closable
          className={styles.success}
          onClose={() => setMessages({ error: "", success: "" })}
        />
      )}
      <SettingButtons
        isChanged={isChanged}
        isValid={isValid}
        onCancel={handleCancel}
        onSave={handleSave}
        loading={loading}
      />
    </>
  );
}

function maskEmail(email) {
  const [name, domain] = email.split("@");
  const maskedName = name[0] + "*".repeat(name.length - 2) + name.slice(-1);
  return `${maskedName}@${domain}`;
}
