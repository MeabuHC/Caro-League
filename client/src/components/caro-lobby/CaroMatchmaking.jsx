import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clock from "../../assets/svg/rapid.svg";
import styles from "../../styles/components/CaroMatchMaking.module.css";
import { useCaroSocket } from "../../context/CaroSocketContext";
import { LoadingOutlined } from "@ant-design/icons";

import { Spin, message } from "antd";
import delay from "../../utils/delay";

function CaroMatchmaking() {
  const [findingDots, setFindingDots] = useState("");
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const initSocket = async () => {
      if (!socket) {
        initializeConnection();
      } else if (socket.connected) {
        console.log(socket);
        const handleNavigateGame = (gameId, errorText) => {
          console.log("Navigate to: " + gameId);
          console.log(socket);
          console.log(socket.id + " from navigate game!");
          if (errorText) message.error(errorText);
          navigate("/play/game/live/" + gameId, { replace: true });
        };

        socket.on("navigate-game", handleNavigateGame);
        socket.on("already-in-game", handleNavigateGame);

        await delay(2000); //UI purpose
        console.log("Send find match signal!");

        socket.emit("find-match-making", {
          mode: modeValue,
          time: timeValue,
        });
      }
    };

    initSocket();
  }, [socket?.connected]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setFindingDots((prevDots) =>
        prevDots.length >= 3 ? "" : prevDots + "."
      );
    }, 500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const actionValue = searchParams.get("action");
  const timeValue = searchParams.get("time");
  const modeValue = searchParams.get("mode");

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
    timeOptions.find((option) => option.value == timeValue)?.label || "N/A";

  const selectedModeLabel =
    modeOptions.find((option) => option.value == modeValue)?.label || "N/A";

  return (
    <div className="matchmaking-menu mt-3 my-5 w bg-[#262522] w-[380px] overflow-hidden flex flex-col">
      {socket?.connected === true ? (
        <>
          <div className="menu-header h-[56px] w-full text-[#C3C2C1] flex flex-row items-center border-b-2 border-[hsla(0,0%,100%,.1)]">
            <span className="ml-5">{`Finding${findingDots}`}</span>
          </div>
          <div className="menu-body flex-1 flex flex-row items-center justify-center">
            <div className="finding-board w-[280px] px-[40px] pt-[40px] flex flex-col bg-[#1E1F1A] rounded-md">
              <img
                src={clock}
                className={`${styles.clock} self-center w-[48px] h-[48px] mb-4`}
              />
              <span className="text-white self-center flex flex-row items-center justify-center w-full">
                <div className="h-full flex-1 text-right">
                  {selectedTimeLabel}
                </div>
                <span className="mx-2">{`|`}</span>
                <div className="h-full flex-1">{selectedModeLabel}</div>
              </span>

              <p className="mt-4 mb-10 text-[#71716F] w-full text-center">{`Finding${findingDots}`}</p>
              <button
                className="h-[16px] mb-6 text-[#71716F] hover:text-[#C0C0BF] text-center"
                onClick={() => {
                  navigate("/play/online");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-row w-full h-full justify-center items-center">
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            style={{ color: "#9ECC5E" }}
          />
        </div>
      )}
    </div>
  );
}

export default CaroMatchmaking;
