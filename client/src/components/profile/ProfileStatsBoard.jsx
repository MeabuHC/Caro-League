import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ProfileStatsBoard({ profileData }) {
  return (
    <div className="stats-board w-full bg-[#262522] rounded-md">
      <Link className="stats-board-header h-[48px] bg-[#262522] flex flex-row items-center mx-3 hover:text-white text-[#DFDEDE] border-b-2 border-solid border-[#3C3B39]">
        <span className=" font-semibold">Season Stats</span>
        <RightOutlined className="ml-auto" />
      </Link>
      <ul className="general-stats mx-4 py-3 text-[#DFDEDE]">
        <li className="flex flex-row items-center h-[24px]">
          <span className="font-normal">Games</span>
          <div className="value ml-auto font-semibold">
            {profileData.totalGames}
          </div>
        </li>
        <li className="flex flex-row items-center h-[24px]">
          <span className="font-normal">Wins</span>
          <div className="value ml-auto font-semibold">{profileData.wins}</div>
        </li>
        <li className="flex flex-row items-center h-[24px]">
          <span className="font-normal">Losses</span>
          <div className="value ml-auto font-semibold">
            {profileData.losses}
          </div>
        </li>
        <li className="flex flex-row items-center h-[24px]">
          <span className="font-normal">Draws</span>
          <div className="value ml-auto font-semibold">{profileData.draws}</div>
        </li>
        <li className="flex flex-row items-center h-[24px]">
          <span className="font-normal">Win Rate</span>
          <div className="value ml-auto font-semibold">
            {profileData.totalGames > 0
              ? ((profileData.wins / profileData.totalGames) * 100).toFixed(2) +
                "%"
              : "N/A"}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default ProfileStatsBoard;
