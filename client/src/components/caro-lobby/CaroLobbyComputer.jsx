import React, { useState } from "react";
import CaroLobbyDropdown from "./CaroLobbyDropdown";
import handshake from "../../assets/svg/handshake.svg";
import tournaments from "../../assets/svg/tournaments.svg";
import clock from "../../assets/svg/icons8-clock.svg";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function CaroLobbyComputer() {
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isRankOpen, setIsRankOpen] = useState(false);
  const [isSymbolOpen, setIsSymbolOpen] = useState(false);

  const {
    selectedTime,
    setSelectedTime,
    selectedMode,
    setSelectedMode,
    selectedRank,
    setSelectedRank,
    selectedSymbol,
    setSelectedSymbol,
  } = useOutletContext();
  const navigate = useNavigate();

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setIsTimeOpen(false);
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setIsModeOpen(false);
  };

  const handleSelectRank = (rank) => {
    setSelectedRank(rank);
    setIsRankOpen(false);
  };
  const handleSelectSymbol = (Symbol) => {
    setSelectedSymbol(Symbol);
    setIsSymbolOpen(false);
  };

  const handlePlayClick = () => {
    navigate(
      `/play/computer/new?time=${selectedTime}&mode=${selectedMode}&rank=${selectedRank}&symbol=${selectedSymbol}`
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

  const rankOptions = [
    { label: "Bronze", value: "Bronze" },
    { label: "Silver", value: "Silver" },
    { label: "Gold", value: "Gold" },
    { label: "Platinum", value: "Platinum" },
    { label: "Emerald", value: "Emerald" },
    { label: "Diamond", value: "Diamond" },
    { label: "Master", value: "Master" },
  ];

  const symbolOptions = [
    { label: "X", value: "X" },
    { label: "O", value: "O" },
    { label: "Random", value: "Random" },
  ];

  const selectedTimeLabel =
    timeOptions.find((option) => option.value == selectedTime)?.label ||
    "Select time";

  const selectedModeLabel =
    modeOptions.find((option) => option.value == selectedMode)?.label ||
    "Select mode";

  const selectedRankLabel =
    rankOptions.find((option) => option.value === selectedRank)?.label ||
    "Select rank";

  const selectedSymbolLabel =
    symbolOptions.find((option) => option.value === selectedSymbol)?.label ||
    "Select symbol";

  return (
    <>
      <div className="lobby-menu mt-3 my-5 w bg-[#262522] w-[380px] overflow-hidden flex flex-col">
        <div className="header h-[28px] flex flex-row justify-center items-center relative mt-7">
          <ArrowLeftOutlined
            className="absolute left-10 text-[#939291] text-xl hover:text-[#C3C2C1]"
            onClick={() => {
              navigate("/play");
            }}
          />
          <img
            src={handshake}
            className="inline-block w-[24px] h-[24px] mr-3"
          />
          <span className="text-white text-xl font-bold">Play with bots</span>
        </div>

        <div className="my-8 px-9 overflow-y-auto">
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

          <CaroLobbyDropdown
            text={selectedRankLabel}
            isOpen={isRankOpen}
            setIsOpen={setIsRankOpen}
          >
            <div className="grid grid-cols-[1fr_1fr] gap-3 mb-4">
              {rankOptions.map((option) => (
                <button
                  key={option.value}
                  className={`h-[46px] bg-[#3C3B39] hover:bg-[#494846] text-[#E2E2E1] hover:text-[#FFFFFF] rounded-md font-semibold text-sm transition-all duration-300 ${
                    selectedRank === option.value
                      ? "border-2 border-solid border-[#81B64C]"
                      : ""
                  }`}
                  onClick={() => handleSelectRank(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CaroLobbyDropdown>

          <CaroLobbyDropdown
            text={selectedSymbolLabel}
            isOpen={isSymbolOpen}
            setIsOpen={setIsSymbolOpen}
          >
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 mb-4">
              {symbolOptions.map((option) => (
                <button
                  key={option.value}
                  className={`h-[46px] bg-[#3C3B39] hover:bg-[#494846] text-[#E2E2E1] hover:text-[#FFFFFF] rounded-md font-semibold text-sm transition-all duration-300 ${
                    selectedSymbol === option.value
                      ? "border-2 border-solid border-[#81B64C]"
                      : ""
                  }`}
                  onClick={() => handleSelectSymbol(option.value)}
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
        </div>
      </div>
    </>
  );
}

export default CaroLobbyComputer;
