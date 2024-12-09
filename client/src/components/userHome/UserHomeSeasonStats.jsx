import React, { useEffect, useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import delay from "../../utils/delay";

const baseUrl = import.meta.env.VITE_BASE_URL;

function UserHomeSeasonStats({ playerStats }) {
  const progressBarWidth =
    (playerStats?.lp / playerStats?.rankId?.lpThreshold) * 100 + "%";

  if (!playerStats) {
    return (
      <div className="season-stats rounded-md overflow-hidden h-[288px] bg-[#262522] flex items-center justify-center">
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ color: "#9ECC5E" }}
        />
      </div>
    );
  }

  return (
    <div className="season-stats rounded-md overflow-hidden">
      <Link className="season-board-header h-[48px] bg-[#262522] flex flex-row items-center px-3 hover:text-white text-[#DFDEDE] border-b-2 border-solid border-[#3C3B39]">
        <span className=" font-semibold">{`Season ${playerStats.seasonId.name}`}</span>
        <RightOutlined className="ml-auto" />
      </Link>
      <div className="season-board-body bg-[#262522] pt-4 pb-8  ">
        <div className="season-rank flex flex-col justify-center w-full items-center">
          <span className="rank-header-tier text-[white] font-semibold text-xl">
            {playerStats.rankId.tier + " " + playerStats.currentDivision}
          </span>
          <img
            className="w-[140px] h-[120px]"
            src={baseUrl + playerStats.rankId.imageUrl}
          />
        </div>

        {/* Progress Bar */}
        <div className="progress-bar w-[50%] mx-auto">
          <span className="text-sm text-[#939291] mt-2 block">
            Tier progress: {playerStats.lp} LP
          </span>
          <div className="bg-[#939291] h-2 rounded mt-2">
            <div
              className="bg-[#F7C631] h-2 rounded"
              style={{ width: progressBarWidth }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomeSeasonStats;
