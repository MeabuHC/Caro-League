import { SettingTextInput } from "./SettingTextInput";
import { useUserContext } from "../../context/UserContext";
import { useState } from "react";
import { SettingButtons } from "./SettingButtons";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";

export function SettingUsername() {
  const [isChanged, setIsChanged] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const { user, setRefetch } = useUserContext();
  const [currentUsername, setCurrentUsername] = useState(user.username);

  const handleCancel = () => {
    setCurrentUsername(user.username);
    setIsChanged(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      await axiosWithRefreshToken(`/api/v1/users/me`, "patch", {
        username: currentUsername,
      });

      //Refetch user data
      setRefetch(true);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div>
        <SettingTextInput
          maxLength={10}
          error={error}
          setError={setError}
          minLength={3}
          label={"username"}
          setIsChanged={setIsChanged}
          setIsValid={setIsValid}
          originalValue={user.username}
          value={currentUsername}
          setValue={setCurrentUsername}
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
