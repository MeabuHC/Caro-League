import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import clock from "../../assets/svg/rapid.svg";
import styles from "../../styles/components/CaroMatchMaking.module.css";
import { useCaroSocket } from "../../context/CaroSocketContext";
import { message } from "antd";

function CaroMatchmakingComputer() {
  const [findingDots, setFindingDots] = useState("");
  const { selectedTime, selectedMode, selectedRank, selectedSymbol } =
    useOutletContext();
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();
  const navigate = useNavigate();

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
    timeOptions.find((option) => option.value === selectedTime)?.label || "N/A";

  const selectedModeLabel =
    modeOptions.find((option) => option.value === selectedMode)?.label || "N/A";

  const selectedRankLabel =
    rankOptions.find((option) => option.value === selectedRank)?.label || "N/A";

  const selectedSymbolLabel =
    symbolOptions.find((option) => option.value === selectedSymbol)?.label ||
    "N/A";

  useEffect(() => {
    if (!socket) {
      initializeConnection();
    } else if (socket.connected) {
      socket.emit("start-computer-match", {
        time: selectedTime,
        mode: selectedMode,
        rank: selectedRank,
        symbol: selectedSymbol,
      });

      const handleError = (errorText) => {
        message.error(errorText);
        navigate("/play/computer");
      };

      const handleNavigateGame = (gameId) => {
        console.log("Navigate to: " + gameId);
        console.log(socket);
        console.log(socket.id + " from navigate game!");
        navigate("/play/game/computer/" + gameId, { replace: true });
      };

      socket.on("error", handleError);
      socket.on("navigate-game", handleNavigateGame);
    }
  }, [socket?.connected]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFindingDots((prevDots) =>
        prevDots.length >= 3 ? "" : prevDots + "."
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  //Disconnect socket if unmount
  useEffect(() => {
    return () => {
      if (socket?.connected) {
        console.log("Socket disconnected!");
        console.log(socket);
        disconnectSocket();
      }
    };
  }, [socket]);

  return (
    <div className="matchmaking-menu mt-3 my-5 w bg-[#262522] w-[380px] overflow-hidden flex flex-col">
      <div className="menu-header h-[56px] w-full text-[#C3C2C1] flex flex-row items-center border-b-2 border-[hsla(0,0%,100%,.1)]">
        <span className="ml-5">{`Getting ready${findingDots}`}</span>
      </div>

      <div className="menu-body flex-1 flex flex-row items-center justify-center">
        <div className="finding-board w-[280px] px-[40px] pt-[40px] flex flex-col bg-[#1E1F1A] rounded-md">
          <img
            src={clock}
            className={`${styles.clock} self-center w-[48px] h-[48px] mb-4`}
            alt="clock"
          />
          <div className="text-white self-center w-full flex flex-col items-center text-sm text-center">
            <div className="flex flex-row gap-2 justify-center items-center">
              <span>{selectedTimeLabel}</span>
              <span className="text-[#555]">|</span>
              <span>{selectedModeLabel}</span>
            </div>
            <div className="mt-1">{selectedRankLabel} Rank</div>
          </div>

          <p className="mt-4 mb-10 text-[#71716F] w-full text-center">{`Loading bot${findingDots}`}</p>

          <button
            className="h-[16px] mb-6 text-[#71716F] hover:text-[#C0C0BF] text-center"
            onClick={() => navigate("/play/computer")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaroMatchmakingComputer;
