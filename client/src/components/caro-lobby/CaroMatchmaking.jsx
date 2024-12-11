import React, { useEffect, useState } from "react";
import { Link, replace, useLocation, useNavigate } from "react-router-dom";
import clock from "../../assets/svg/rapid.svg";
import styles from "../../styles/components/CaroMatchMaking.module.css";
import { useCaroSocket } from "../../context/CaroSocketContext";
import { LoadingOutlined } from "@ant-design/icons";

import { Spin, message } from "antd";
import delay from "../../utils/delay";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import { useUserContext } from "../../context/UserContext";

function CaroMatchmaking() {
  const [findingDots, setFindingDots] = useState("");
  const [opponentData, setOpponentData] = useState(null);
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();
  const searchParams = new URLSearchParams(location.search);
  const actionValue = searchParams.get("action");
  const validActions = ["matchmaking", "challenge", "accept-challenge"];
  const isValidAction = validActions.includes(actionValue);
  const { user, socket: userSocket } = useUserContext();

  const opponentValue =
    (actionValue === "challenge" || actionValue === "accept-challenge") &&
    searchParams.get("opponent");
  const navigate = useNavigate();

  if (!isValidAction) {
    message.error("Bad request!");
    navigate(`/play/online/`);
  }

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

  //For challenge
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosWithRefreshToken(
          `/api/v1/users/?username=${opponentValue}`,
          "get",
          null,
          {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          }
        );

        if (!response.data.data.users[0]) {
          message.error("Player not existed!");
          navigate(`/play/online/friend`, { replace: true });
        } else if (opponentValue === user.username) {
          message.error("You can't challenge yourself!");
          navigate(`/play/online/friend`, { replace: true });
        } else setOpponentData(response.data.data.users[0]);
        console.log(response.data.data.users[0]);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    if (actionValue === "challenge" || actionValue === "accept-challenge")
      fetchData();
  }, []);

  //For matchmaking
  useEffect(() => {
    const initSocket = async () => {
      if (!socket) {
        initializeConnection();
      } else if (socket.connected) {
        const handleNavigateGame = (gameId, errorText) => {
          console.log("Navigate to: " + gameId);
          console.log(socket);
          console.log(socket.id + " from navigate game!");
          if (errorText) message.error(errorText);
          navigate("/play/game/live/" + gameId, { replace: true });
        };

        const handleError = (errorText) => {
          message.error(errorText);
          navigate("/play/online");
        };

        socket.on("navigate-game", handleNavigateGame);
        socket.on("already-in-game", handleNavigateGame);
        socket.on("error", handleError);

        const handleDeclinedChallengeRequest = () => {
          message.info(opponentValue + " declined your request!");
          navigate("/play/online/friend");
        };

        userSocket.on(
          "declined-challenge-request",
          handleDeclinedChallengeRequest
        );

        if (actionValue === "matchmaking") {
          console.log("Send find match signal!");

          socket.emit("find-match-making", {
            mode: modeValue,
            time: timeValue,
          });
        } else if (actionValue === "accept-challenge") {
          console.log("Send accept-challenge signal!");
          socket.emit("accept-challenge-request", opponentData._id.toString());
        } else if (actionValue === "challenge") {
          console.log("Send challenge request!");
          console.log(socket);
          userSocket.emit("send-challenge-request", {
            sender: user.username,
            receiver: opponentValue,
            time: timeValue,
            mode: modeValue,
            senderSocketId: socket.id,
          });
        }
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

  //Emit cancel if umount challenge
  useEffect(() => {
    return () => {
      if (actionValue === "challenge") {
        userSocket.off("declined-challenge-request");
        userSocket.emit("cancel-challenge-request");
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFindingDots((prevDots) =>
        prevDots.length >= 3 ? "" : prevDots + "."
      );
    }, 500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="matchmaking-menu mt-3 my-5 w bg-[#262522] w-[380px] overflow-hidden flex flex-col">
      {socket?.connected === true ? (
        <>
          <div className="menu-header h-[56px] w-full text-[#C3C2C1] flex flex-row items-center border-b-2 border-[hsla(0,0%,100%,.1)]">
            {actionValue != "matchmaking" && opponentData ? (
              <span className="ml-5">{`Waiting for opponent${findingDots}`}</span>
            ) : (
              <span className="ml-5">{`Finding${findingDots}`}</span>
            )}
          </div>
          <div className="menu-body flex-1 flex flex-row items-center justify-center">
            <div className="finding-board w-[280px] px-[40px] pt-[40px] flex flex-col bg-[#1E1F1A] rounded-md">
              <img
                src={
                  actionValue != "matchmaking" && opponentData
                    ? opponentData.avatarUrl
                    : clock
                }
                className={`${styles.clock} self-center w-[48px] h-[48px] mb-4`}
              />
              <span className="text-white self-center flex flex-row items-center justify-center w-full">
                <div className="h-full flex-1 text-right">
                  {selectedTimeLabel}
                </div>
                <span className="mx-2">{`|`}</span>
                <div className="h-full flex-1">{selectedModeLabel}</div>
              </span>

              {actionValue === "challenge" && opponentData ? (
                <p className="mt-4 mb-10 text-[#71716F] w-full text-center">{`Waiting for opponent${findingDots}`}</p>
              ) : (
                <p className="mt-4 mb-10 text-[#71716F] w-full text-center">{`Finding${findingDots}`}</p>
              )}
              <button
                className="h-[16px] mb-6 text-[#71716F] hover:text-[#C0C0BF] text-center"
                onClick={() => {
                  if (actionValue === "challenge" && opponentData)
                    navigate(`/play/online/friend?opponent=${opponentValue}`);
                  else navigate("/play/online");
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
