import React from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;
function CaroPlayerCard({ playerStats }) {
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
          <h2 className="text-gray-400 text-sm">
            {playerStats.rankId.tier} {playerStats.currentDivision}
          </h2>
        </div>
      </div>
    </>
  );
}

export default CaroPlayerCard;
