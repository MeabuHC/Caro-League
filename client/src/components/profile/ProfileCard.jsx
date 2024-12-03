import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import {
  TeamOutlined,
  FormOutlined,
  HourglassOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../../context/UserContext.jsx";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken.js";
import ProfileCardButtons from "./ProfileCardButtons.jsx";
import { Link } from "react-router-dom";

function ProfileCard({ profileData }) {
  const { user, socket: userSocket } = useUserContext();
  const [activityStatus, setActivityStatus] = useState({
    isActive: profileData.isActive,
    last_active: profileData.last_active,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [statusText, setStatusText] = useState(profileData.userId.statusText);
  const statusTextInputRef = useRef(null);
  const isUserVisitingProfile = profileData.userId.username === user?.username;
  const statusTextColor =
    50 - statusText.length <= 2
      ? "text-[#FA412D]"
      : 50 - statusText.length <= 5
      ? "text-[#FA742C]"
      : 50 - statusText.length <= 8
      ? "text-[#FFA459]"
      : "";

  console.log(activityStatus.isActive);

  useEffect(() => {
    if (userSocket) {
      const handleUserActiveStatus = (data) => {
        if (data.userId === profileData.userId._id.toString()) {
          setActivityStatus(() => ({
            isActive: data.online,
            last_active: data.last_active,
          }));
        }
      };

      userSocket.on("user-active-status", handleUserActiveStatus);

      return () => {
        userSocket.off("user-active-status", handleUserActiveStatus);
      };
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        console.log(statusTextInputRef.current);
        statusTextInputRef.current?.focus();
      }, 300);
    }
  }, [isEditing]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    setStatusText(statusTextInputRef.current?.value);

    await axiosWithRefreshToken("/api/v1/users/me", "patch", {
      statusText: statusText,
    });
  };

  return (
    <div className="profile-container p-8 w-[728px] bg-[#262522]  text-[#939291] relative rounded-md flex flex-col gap-6">
      <div className="profile-top-info flex flex-row h-[160px]">
        <div className="avatar-container w-[160px] h-full mr-6 rounded-md overflow-hidden relative">
          <img
            className="w-full h-full profile-avatar "
            src={profileData.userId.avatarUrl}
          />
          {activityStatus.isActive && !isUserVisitingProfile && (
            <div className="presence-square h-[30px] w-[30px] bg-[#81B64C] text-red-50 absolute bottom-0 right-0 rounded-tl-md"></div>
          )}
        </div>

        {isUserVisitingProfile && (
          <Link
            className="edit-profile-page absolute top-[10px] right-[10px] font-medium text-xs hover:text-[#C3C2C1]"
            to="/settings"
          >
            <FormOutlined /> Edit
          </Link>
        )}

        <div className="profile-content flex-1 flex flex-col h-full ">
          <h1 className="font-extrabold text-2xl text-white">
            {profileData.userId.username}
          </h1>

          <form className="relative mt-2" onSubmit={handleSubmitForm}>
            <span className="profile-status-info text-[#C0C0BF] block pr-2 py-1">
              {statusText.length != 0 ? statusText : "Enter a status here"}
              {isUserVisitingProfile && (
                <Tooltip title="Edit status">
                  <div
                    className="hover:text-[#939291] text-[#7D7C7B] ml-2 inline-block cursor-pointer"
                    onClick={() => {
                      if (!isEditing) setIsEditing(true);
                    }}
                  >
                    <FormOutlined />
                  </div>
                </Tooltip>
              )}
            </span>

            <div
              className={`absolute top-0 left-0 w-full flex items-center transition-[width, opacity] duration-300 ease-in-out ${
                isEditing
                  ? "opacity-100  w-[90%]"
                  : "opacity-0 pointer-events-none w-[30%]"
              }`}
            >
              <input
                type="text"
                className="flex-grow p-1 placeholder:text-[#7F7E7D] text-[#7F7E7D] outline-none bg-[#373633] border-none"
                placeholder="Enter a status here"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                ref={statusTextInputRef}
                minLength={0}
                maxLength={50}
              />
              <span className={`ml-2 ${statusTextColor}`}>
                {50 - statusText.length}
              </span>
              <Tooltip title="Save Status">
                <button type="submit" className="ml-1 text-[#7D7C7B]">
                  <EnterOutlined />
                </button>
              </Tooltip>
            </div>
          </form>

          <div className="profile-content-user-info mt-auto flex flex-row">
            {/* Last Online */}
            <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
              <Tooltip title="Last Online">
                <ClockCircleOutlined style={{ fontSize: "32px" }} />
              </Tooltip>
              <span className="profile-content-user-info-value font-bold mt-2">
                {activityStatus.isActive
                  ? "Online Now"
                  : formatLastActive(activityStatus.last_active)}
              </span>
            </div>

            {/* Joined Date */}
            <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
              <Tooltip title="Joined">
                <HourglassOutlined style={{ fontSize: "32px" }} />
              </Tooltip>
              <span className="profile-content-user-info-value font-bold mt-2">
                {formatDate(profileData.userId.createdAt)}
              </span>
            </div>

            {/* Friends */}
            <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
              <Tooltip title="Friends">
                <TeamOutlined style={{ fontSize: "32px" }} />
              </Tooltip>
              <span className="profile-content-user-info-value font-bold mt-2">
                {profileData.userId.friends.length}
              </span>
            </div>

            {/* Views */}
            <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
              <Tooltip title="Views">
                <EyeOutlined style={{ fontSize: "32px" }} />
              </Tooltip>
              <span className="profile-content-user-info-value font-bold mt-2">
                {profileData.userId.viewCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Log in and viewing other profile */}
      {user && !isUserVisitingProfile && (
        <ProfileCardButtons profileData={profileData} />
      )}
    </div>
  );
}

export default ProfileCard;

function formatDate(dateString) {
  const date = new Date(dateString); // Convert input string to Date object

  const options = {
    year: "numeric", // Full year
    month: "short", // Short month (e.g., Jan, Feb, Mar)
    day: "numeric", // Numeric day (e.g., 1, 15)
  };

  const formattedDate = date.toLocaleDateString("en-US", options); // Format date
  return formattedDate;
}

function formatLastActive(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months >= 1) {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options); // Format as "Apr 11, 2023"
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now"; // Short message for less than 1 minute
  }
}
