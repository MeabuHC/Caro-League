import React from "react";
import { InfoCircleFilled } from "@ant-design/icons";
import { Tooltip } from "antd";
const baseUrl = import.meta.env.VITE_BASE_URL;

function ProfileRankBoard({ profileData }) {
  const progressBarWidth =
    (profileData.lp / profileData.rankId.lpThreshold) * 100 + "%";

  const allSeasonData = profileData.allSeasonData.filter((element) => {
    return element.seasonId._id != profileData.seasonId._id;
  });

  return (
    <div className="rank-section w-[300px] bg-[#262522] flex flex-col rounded-md">
      <div className="rank-header h-[48px] w-full flex flex-col items-center justify-center relative px-3 mt-2">
        <span className="rank-header-season text-[#DFDEDE]">
          {profileData.seasonId.name}
        </span>
        <span className="rank-header-tier text-[#DFDEDE]">
          {profileData.rankId.tier + " " + profileData.currentDivision}
        </span>
        <Tooltip
          title={
            <div>
              <div>Season: {profileData.seasonId.name}</div>
              <div>
                Start Date:{" "}
                {new Date(profileData.seasonId.startDate).toLocaleDateString()}
              </div>
              <div>
                End Date:{" "}
                {new Date(profileData.seasonId.endDate).toLocaleDateString()}
              </div>
            </div>
          }
        >
          <InfoCircleFilled className="text-[#939291] hover:text-[#C3C2C1] hover:cursor-pointer absolute top-1/2 right-3 -translate-y-1/2" />
        </Tooltip>
      </div>
      <div className="rank-content flex-1 px-5 pb-3">
        <div className="rank-img w-full h-[100px] flex flex-row justify-center">
          <img
            className="w-[120px] h-full"
            src={baseUrl + profileData.rankId.imageUrl}
          ></img>
        </div>
        {/* Progress Bar */}
        <span className="text-sm text-[#939291] mt-2 block">
          Tier progress: {profileData.lp} LP
        </span>
        <div className="bg-[#939291] h-2 rounded mt-2">
          <div
            className="bg-[#F7C631] h-2 rounded"
            style={{ width: progressBarWidth }}
          ></div>
        </div>
        {/* Rank History */}
        <div className="trophy-history-title pt-4 pb-2 border-b-2 border-solid border-[#3C3B39]">
          Rank History
        </div>
        <table className="w-full table-auto">
          <tbody>
            {allSeasonData.length != 0 ? (
              allSeasonData.map((element) => (
                <tr key={element._id}>
                  <td className="pr-4 py-2">{element.seasonId.name}</td>
                  <td className="pr-4 py-2">{element.rankId.tier}</td>
                  <td className="pr-4 py-2">{element.lp} LP</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="pr-4 py-2">No rank history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfileRankBoard;
