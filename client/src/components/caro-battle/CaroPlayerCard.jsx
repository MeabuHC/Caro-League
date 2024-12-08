import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import black_avatar from "../../assets/images/black_400.png";
import white_avatar from "../../assets/images/white_400.png";
import matchmaking_avatar from "../../assets/gif/seeksquare@3x.gif";
const baseUrl = import.meta.env.VITE_BASE_URL;

function CaroPlayerCard({
  playerStats = null,
  lpChange = null,
  type = "default",
}) {
  const [findingDots, setFindingDots] = useState("");

  useEffect(() => {
    if (type === "matchmaking") {
      const interval = setInterval(() => {
        setFindingDots((prevDots) =>
          prevDots.length >= 3 ? "" : prevDots + "."
        );
      }, 500);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [type]);

  const typeData = {
    default: {
      username: playerStats?.userId?.username,
      avatarUrl: playerStats?.userId?.avatarUrl,
      rankImageUrl: playerStats?.rankId?.imageUrl
        ? baseUrl + "/" + playerStats.rankId.imageUrl
        : null,
      rankTier: playerStats?.rankId?.tier || "",
      currentDivision: playerStats?.currentDivision || "",
    },
    player: {
      username: "Player",
      avatarUrl: white_avatar,
      rankImageUrl: null,
      rankTier: "",
      currentDivision: "",
    },
    opponent: {
      username: "Opponent",
      avatarUrl: black_avatar,
      rankImageUrl: null,
      rankTier: "",
      currentDivision: "",
    },
    matchmaking: {
      username: `Finding${findingDots}`, // Dynamic username for matchmaking
      avatarUrl: matchmaking_avatar,
      rankImageUrl: null,
      rankTier: "",
      currentDivision: "",
    },
  };

  // Fallback to default if `type` is not in `typeData`
  const { username, avatarUrl, rankImageUrl, rankTier, currentDivision } =
    typeData[type] || typeData.default;

  return (
    <>
      <div className="img-container w-10 h-10 mr-3">
        <img src={avatarUrl} alt="Avatar" className="w-full h-full" />
      </div>

      <div className="player-tagline flex flex-col">
        <div className="player-username">
          {username && type === "default" ? (
            <Link className="text-[#E0E0DF] text-base cursor-pointer hover:text-white ">
              {username}
            </Link>
          ) : (
            <span className="text-white text-base">{username}</span>
          )}
        </div>

        <div className="player-rank flex items-center">
          {rankImageUrl ? (
            <img
              src={rankImageUrl}
              alt="Rank Image"
              className="h-full w-7 mr-1"
            />
          ) : (
            <div className="h-7 w-7 mr-1 opacity-0">Lorem ipsum</div>
          )}

          <span className="text-[#E0E0DF] text-sm">
            {rankTier} {currentDivision}
          </span>

          {lpChange && (
            <span
              className="ml-2"
              style={{ color: lpChange > 0 ? "#81B64C" : "#90908F" }}
            >
              {lpChange > 0 && "+"}
              {lpChange}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default CaroPlayerCard;
