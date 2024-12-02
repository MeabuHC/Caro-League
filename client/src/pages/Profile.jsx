// ./pages/Profile.js
import React, { useEffect, useState } from "react";
import styles from "../styles/pages/Profile.module.css";
import { useUserContext } from "../context/UserContext";

import ProfileCard from "../components/profile/ProfileCard";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import ProfileRankBoard from "../components/profile/ProfileRankBoard";
import ProfileGameHistory from "../components/profile/ProfileGameHistory";
import { useNavigate, useParams } from "react-router-dom";
import ProfileStatsBoard from "../components/profile/ProfileStatsBoard";
import ProfileFriendsBoard from "../components/profile/ProfileFriendsBoard";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function ProfileWrapper() {
  const { username } = useParams(); // Get username from route params

  return <Profile key={username} />; // Use username as key for remounting Profile
}

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const { user } = useUserContext();
  const { username } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    // Define the async function inside the useEffect
    const fetchProfileData = async () => {
      try {
        const response = await axiosWithRefreshToken(
          `/api/v1/profile/${username}`
        );
        console.log(response);
        console.log(response.data.data);
        setProfileData(response.data.data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching profile data:", error);
        navigate("/not-found");
      }
    };

    // Call the function
    fetchProfileData();
  }, [username]);

  if (!profileData)
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#302E2B",
        }}
      >
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ color: "#9ECC5E" }}
        />
      </div>
    );

  return (
    <div className={`${styles.profile_container} container`}>
      <div className="mx-40 my-6 flex flex-row gap-10">
        <div className="left flex flex-col gap-10">
          <ProfileCard profileData={profileData} />
          <ProfileGameHistory profileData={profileData} />
        </div>
        <div className="right flex flex-col gap-8 pr-40">
          <ProfileRankBoard profileData={profileData} />
          <ProfileStatsBoard profileData={profileData} />
          <ProfileFriendsBoard profileData={profileData} />
        </div>
      </div>
    </div>
  );
}
