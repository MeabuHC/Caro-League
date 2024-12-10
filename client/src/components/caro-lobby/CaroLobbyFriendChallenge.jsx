import React, { useEffect, useState } from "react";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import CaroLobbyDropdown from "./CaroLobbyDropdown";
import clock from "../../assets/svg/icons8-clock.svg";
import challengelink from "../../assets/svg/challengelink.svg";

import { useNavigate, useOutletContext } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";
import { useUserContext } from "../../context/UserContext";

import delay from "../../utils/delay";

function CaroLobbyFriendChallenge({ opponent }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const { selectedTime, setSelectedTime, selectedMode, setSelectedMode } =
    useOutletContext();
  const { user } = useUserContext();

  const navigate = useNavigate();
  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setIsTimeOpen(false);
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setIsModeOpen(false);
  };

  const handlePlayClick = () => {
    navigate(
      `/play/online/new?action=challenge&opponent=${opponent}&time=${selectedTime}&mode=${selectedMode}`
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosWithRefreshToken(
          `/api/v1/users/?username=${opponent}`,
          "get",
          null,
          {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          }
        );

        if (!response.data.data.users[0]) {
          message.error("Player not existed!");
          navigate(`/play/online/friend`);
        } else if (opponent === user.username) {
          message.error("You can't challenge yourself!");
          navigate(`/play/online/friend`);
        } else setData(response.data.data.users[0]);
        console.log(response.data.data.users[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ color: "#9ECC5E" }}
        />
      </div>
    );

  const timeOptions = [
    { label: "10 seconds", value: 10 },
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
  ];

  const modeOptions = [
    { label: "Basic Mode", value: 0 },
    { label: "Open Mode", value: 1 },
  ];

  const selectedTimeLabel =
    timeOptions.find((option) => option.value == selectedTime)?.label ||
    "Select time";

  const selectedModeLabel =
    modeOptions.find((option) => option.value == selectedMode)?.label ||
    "Select mode";

  return (
    <div className="body mt-10 flex flex-col flex-1 items-center overflow-y-auto">
      <img src={data.avatarUrl} className="w-[100px] h-[100px]"></img>
      <span className="text-[#DFDEDE] font-semibold mt-3 text-lg">
        {data.username}
      </span>

      {/* Dropdown */}
      <div className="w-full px-9 py-8">
        <CaroLobbyDropdown
          text={selectedTimeLabel}
          isOpen={isTimeOpen}
          setIsOpen={setIsTimeOpen}
          imgSRC={clock}
        >
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 mb-4">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                className={`h-[46px] bg-[#3C3B39] hover:bg-[#494846] text-[#E2E2E1] hover:text-[#FFFFFF] rounded-md font-semibold text-sm transition-all duration-300 ${
                  selectedTime === option.value
                    ? "border-2 border-solid border-[#81B64C]"
                    : ""
                }`}
                onClick={() => handleSelectTime(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CaroLobbyDropdown>

        <CaroLobbyDropdown
          text={selectedModeLabel}
          isOpen={isModeOpen}
          setIsOpen={setIsModeOpen}
        >
          <div className="grid grid-cols-[1fr_1fr] gap-3 mb-4">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                className={`h-[46px] bg-[#3C3B39] hover:bg-[#494846] text-[#E2E2E1] hover:text-[#FFFFFF] rounded-md font-semibold text-sm transition-all duration-300 ${
                  selectedMode === option.value
                    ? "border-2 border-solid border-[#81B64C]"
                    : ""
                }`}
                onClick={() => handleSelectMode(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CaroLobbyDropdown>

        <button
          className="play-button h-[70px] w-full bg-[#81B64C] hover:bg-[#9DCB5E] border-b-4 border-[#45753C] hover:border-[#558D44] rounded-lg mt-5 text-white text-2xl font-bold transition-all duration-300 mb-5"
          onClick={handlePlayClick}
        >
          Play
        </button>

        <button className="h-[56px] w-full bg-[#383734] hover:bg-[#454441] text-[#E1E1E1] hover:text-[#FFFFFF] rounded-lg pl-6 pr-6 font-semibold text-base flex flex-row items-center justify-center">
          <img
            src={challengelink}
            className="inline-block w-[30px] h-[30px] mr-3"
          />
          Create Challenge Link
        </button>
      </div>
    </div>
  );
}

export default CaroLobbyFriendChallenge;
