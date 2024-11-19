import React from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;
function CaroPlayerCard({ playerStats, lpChange = null }) {
  return (
    <>
      <div className="img-container w-10 h-10 mr-3">
        <img
          src={playerStats.userId.avatarUrl}
          alt="Avatar"
          className="w-full h-full"
        />
      </div>

      <div className="player-tagline flex flex-col">
        <div className="player-username flex-1">
          <a className="text-white text-base cursor-pointer hover:text-gray-300">
            {playerStats.userId.username}
          </a>
        </div>
        <div className="player-rank flex-1 flex items-center">
          <img
            src={baseUrl + "/" + playerStats.rankId.imageUrl}
            alt="Rank Image"
            className="h-full w-7 mr-1"
          />
          <span className="text-white text-sm">
            {playerStats.rankId.tier} {playerStats.currentDivision}
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
