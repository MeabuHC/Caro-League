// ./pages/Profile.js
import React from "react";
import styles from "../styles/pages/Profile.module.css";
import { useUserContext } from "../context/UserContext";
import {
  TeamOutlined,
  FormOutlined,
  HourglassOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  InfoCircleFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

export default function Profile() {
  return (
    <div
      className={`${styles.profile_container} container px-40 py-6 flex flex-row gap-10`}
    >
      <div className="left flex flex-col gap-10">
        <div className="profile-container p-8 w-[728px] h-[225px] bg-[#262522] flex flex-row text-[#939291] relative rounded-md">
          <img
            className="w-[160px] h-[160px] profile-avatar mr-6"
            src="https://res.cloudinary.com/dfa4flhk3/image/upload/v1731655958/avatars/tzywao7dpiyjkjphico8.jpg"
          />

          <a
            className="edit-profile-page absolute top-[10px] right-[10px] font-medium text-xs hover:text-[#C3C2C1]"
            href="/settings"
          >
            <FormOutlined /> Edit
          </a>

          <div className="profile-content flex-1 flex flex-col h-full ">
            <h1 className="font-extrabold text-2xl text-white">MeabuOP</h1>

            <form
              className="mt-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <span className="profile-status-info text-[#C0C0BF] relative">
                Hello guyssss
                <Tooltip title="Edit status">
                  <button className="hover:text-[#939291] text-[#7D7C7B] ml-2">
                    <FormOutlined />
                  </button>
                </Tooltip>
              </span>
            </form>

            <div className="profile-content-user-info mt-auto flex flex-row">
              <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
                <Tooltip title="Last Online">
                  <ClockCircleOutlined style={{ fontSize: "32px" }} />
                </Tooltip>
                <span className="profile-content-user-info-value font-bold mt-2">
                  Online Now
                </span>
              </div>
              <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
                <Tooltip title="Joined">
                  <HourglassOutlined style={{ fontSize: "32px" }} />
                </Tooltip>
                <span className="profile-content-user-info-value font-bold mt-2">
                  Feb 1, 2023
                </span>
              </div>
              <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
                <Tooltip title="Friends">
                  <TeamOutlined style={{ fontSize: "32px" }} />
                </Tooltip>
                <span className="profile-content-user-info-value font-bold mt-2">
                  7
                </span>
              </div>
              <div className="profile-content-user-info-item flex flex-col flex-1 items-center">
                <Tooltip title="Views">
                  <EyeOutlined style={{ fontSize: "32px" }} />
                </Tooltip>
                <span className="profile-content-user-info-value font-bold mt-2">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Game History */}
        <div className="game-history w-full rounded-md overflow-hidden">
          <a className="game-history-header h-[48px] bg-[#262522] flex flex-row items-center px-7 hover:text-white text-[#DFDEDE]">
            <span className=" font-semibold">Completed Games</span>
            <RightOutlined className="ml-auto" />
          </a>
          <table className="w-full table-auto text-[#C1C0C0]">
            <thead className="bg-[#1F1E1C]">
              <th className="w-[85px]">Mode</th>
              <th className="w-[245px] p-2 text-left">Players</th>
              <th className="">Result</th>
              <th className="">Moves</th>
              <th className="w-[150px] text-right p-2 pr-6">Date</th>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="right mr-40">
        {/* Rank Section */}
        <div className="rank-section w-[300px] bg-[#262522] flex flex-col">
          <div className="rank-header h-[48px] w-full flex items-center justify-center relative px-3">
            <span className="rank-header-tier text-[#DFDEDE]">Diamond</span>
            <InfoCircleFilled className="text-[#939291] hover:text-[#C3C2C1] hover:cursor-pointer absolute top-1/2 right-3 -translate-y-1/2" />
          </div>
          <div className="rank-content flex-1 px-5 pb-3">
            <div className="rank-img w-full h-[100px] flex flex-row justify-center">
              <img
                className="w-[120px] h-full"
                src="http://localhost:8000/img/ranks/diamond.png"
              ></img>
            </div>
            {/* Progress Bar */}
            <span className="text-sm text-[#939291] mt-2 block">
              Tier progress: 75 LP
            </span>
            <div className="bg-[#939291] h-2 rounded mt-2">
              <div
                className="bg-[#F7C631] h-2 rounded"
                style={{ width: "75%" }}
              ></div>
            </div>
            {/* Tropy History */}
            <div class="trophy-history-title pt-4 pb-2 border-b-2 border-solid border-[#3C3B39]">
              Rank History
            </div>
            <table class="w-full table-auto">
              <tbody>
                <tr>
                  <td class="pr-4 py-2">Season 1</td>
                  <td class="pr-4 py-2">Gold IV</td>
                  <td class="pr-4 py-2">45 LP</td>
                </tr>
                <tr>
                  <td class="pr-4 py-2">Season 2</td>
                  <td class="pr-4 py-2">Platinum V</td>
                  <td class="pr-4 py-2">50 LP</td>
                </tr>
                <tr>
                  <td class="pr-4 py-2">Season 2</td>
                  <td class="pr-4 py-2">Platinum V</td>
                  <td class="pr-4 py-2">50 LP</td>
                </tr>
                <tr>
                  <td class="pr-4 py-2">Season 2</td>
                  <td class="pr-4 py-2">Platinum V</td>
                  <td class="pr-4 py-2">50 LP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
