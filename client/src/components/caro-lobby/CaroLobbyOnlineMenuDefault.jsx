import React, { useState } from "react";
import CaroLobbyDropdown from "./CaroLobbyDropdown";
import handshake from "../../assets/svg/handshake.svg";
import tournaments from "../../assets/svg/tournaments.svg";
import clock from "../../assets/svg/icons8-clock.svg";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

function CaroLobbyOnlineMenuDefault() {
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const { selectedTime, setSelectedTime, selectedMode, setSelectedMode } =
    useOutletContext();
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
      `/play/online/new?action=matchmaking&time=${selectedTime}&mode=${selectedMode}`
    );
  };

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
    <>
      <div className="my-8 mx-9 overflow-y-auto">
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
          className="play-button h-[70px] w-full bg-[#81B64C] hover:bg-[#9DCB5E] border-b-4 border-[#45753C] hover:border-[#558D44] rounded-lg mt-5 text-white text-2xl font-bold transition-all duration-300 mb-20"
          onClick={handlePlayClick}
        >
          Play
        </button>

        {/* Sub Buttons */}
        <div className="sub_buttons flex flex-col gap-1">
          <Link
            to={`/play/online/friend`}
            className="h-[56px] w-full bg-[#1E1E1B] hover:bg-[#21201D] border-b-4 border-[#171614] rounded-md px-[24px] py-[8px] flex flex-row items-center justify-center transition-all duration-300"
          >
            <div className="img-container h-full w-[32px]">
              <img src={handshake} />
            </div>
            <div className="button-info text-left ml-3">
              <span className="text-lg text-white font-semibold block">
                Play a Friend
              </span>
            </div>
          </Link>

          <button className="h-[56px] w-full bg-[#1E1E1B] hover:bg-[#21201D] border-b-4 border-[#171614] rounded-md px-[24px] py-[8px] flex flex-row items-center justify-center transition-all duration-300">
            <div className="img-container h-full w-[32px]">
              <img src={tournaments} />
            </div>
            <div className="button-info text-left ml-3">
              <span className="text-lg text-white font-semibold block">
                Tournaments
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

export default CaroLobbyOnlineMenuDefault;
