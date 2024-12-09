import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import banner from "../assets/images/fwc24_banner_index.4e29257c.jpg";
import CaroTV from "../components/userHome/CaroTV";
import UserHomeSeasonStats from "../components/userHome/UserHomeSeasonStats";
import ProfileStatsBoard from "../components/profile/ProfileStatsBoard";
import { message } from "antd";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import CaroLeaderboard from "../components/userHome/CaroLeaderboard";

function UserHome() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserGameStats = async () => {
      try {
        setLoading(true);
        const response = await axiosWithRefreshToken("/api/v1/game-stats/me");
        setPlayerStats(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        message.error("Internal server error!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGameStats();
  }, []);

  if (loading)
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
    <div className="bg-[#302E2B] w-full h-full max-h-full overflow-auto container pb-8">
      <div className="advertise-banner flex flex-row gap-10 px-10 pb-10 w-[1100px] mx-auto mt-8">
        <img src={banner} className="w-full" />
      </div>

      <div className="home-body mx-auto flex flex-row gap-10 w-[1100px]">
        {/*Left Section */}
        <div className="left-section flex flex-col gap-10 w-[718px] pl-[40px]">
          <UserHomeSeasonStats playerStats={playerStats} />
          <CaroLeaderboard />
        </div>

        {/* Right Section */}

        <div className="right-section flex flex-col gap-8 flex-1 pr-[40px]">
          <ProfileStatsBoard profileData={playerStats} />
          <CaroTV />
        </div>
      </div>
    </div>
  );
}

export default UserHome;
