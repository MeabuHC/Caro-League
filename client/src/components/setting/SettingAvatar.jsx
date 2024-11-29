import React, { useState, useRef } from "react";
import { Avatar } from "antd";
import { SettingButtons } from "./SettingButtons";
import { useUserContext } from "../../context/UserContext";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";

export function SettingAvatar() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { user, setRefetch } = useUserContext();

  const handleImageClick = () => {
    inputRef.current.click();
    setError(null);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setError(null);
      setFile(selectedFile); // Store the file
      setIsChanged(true);
      setIsValid(true);
    } else {
      setError("Please select a valid image file.");
      setFile(null);
      setIsChanged(false);
      setIsValid(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setIsChanged(false);
    setIsValid(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    setError(null);
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/users/me/avatar",
        "post",
        formData
      );
      setIsChanged(false);
      setIsValid(false);

      //Refetch user data
      setRefetch(true);
    } catch (error) {
      setError("Failed to upload the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Avatar
        size={128}
        src={file ? URL.createObjectURL(file) : `${user?.avatarUrl}`}
        onClick={handleImageClick}
        className="self-center cursor-pointer"
      />

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleImageChange}
      />
      {error && <p className="text-center mt-4 text-red-400">{error}</p>}

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
