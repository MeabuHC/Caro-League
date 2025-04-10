import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useCaroSocket } from "../context/CaroSocketContext";
import delay from "../utils/delay";
import { LoadingOutlined } from "@ant-design/icons";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import styles from "../styles/pages/CaroBattle.module.css";
import { Spin, message } from "antd";
import CaroTimer from "../components/caro-battle/CaroTimer";
import CaroTable from "../components/caro-battle/CaroTable";
import CaroResultModal from "../components/caro-battle/CaroResultModal";
import CaroSidebarSpectator from "../components/caro-battle/CaroSidebarSpectator";

function CaroComputerBattle() {
  const { gameId } = useParams(); // Take gameId from param
  const [isModalOpen, setIsModalOpen] = useState(true); //Result modal
  const [gameObject, setGameObject] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();
  const [moveIndex, setMoveIndex] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      if (!socket) {
        initializeConnection();
        return;
      }

      if (gameId && socket) {
        await delay(1000); // Delay for connection
        console.log("Reconnect game request!");
        socket.emit("reconnect-computer-game", gameId);
      }

      const handleReceiveComputerGameObject = (gameObj, messageText) => {
        console.log("Receive game object!");
        console.log(gameObj);
        if (!gameObj) {
          message.error(messageText);
          navigate("/play/computer", { replace: true }); // If no game object, redirect
        }
        setGameObject((prevGameObject) => {
          // New move was made
          if (
            prevGameObject &&
            prevGameObject.moveHistory.length !== gameObj.moveHistory.length
          ) {
            setMoveIndex(gameObj.moveHistory.length - 1);
          }
          // First time receiving
          else if (!prevGameObject && gameObj.moveHistory.length > 0) {
            setMoveIndex(gameObj.moveHistory.length - 1);
          }
          return gameObj;
        });
      };

      if (socket) {
        socket.on(
          "receive-computer-game-object",
          handleReceiveComputerGameObject
        );
      }
    };

    fetchGameData();

    return () => {
      if (socket) {
        console.log("Socket disconnected!");
        disconnectSocket();
      }
    };
  }, [socket, gameId]);

  // Poll for updates until the game is over
  useEffect(() => {
    if (!gameObject) {
      return;
    }

    if (gameObject.state === "completed") {
      setRemainingTime(gameObject.remainingTime);
      return;
    }

    // Reset timer to real timer
    setRemainingTime(gameObject.remainingTime);

    //Reset timer
    const countdownIntervalId = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(countdownIntervalId);
    };
  }, [gameObject]);

  //Wait loading
  if (!gameObject) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#302E2B",
        }}
      >
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ color: "#9ECC5E" }}
        />
      </div>
    );
  }

  const isPlayerTurn = gameObject.turn === gameObject.playerSymbol;

  return (
    <div
      className={`${styles.container} max-h-full min-h-full h-full overflow-y-auto items-center grid grid-cols-[auto_1fr_auto] px-10 py-3 gap-4`}
    >
      <div className="caro-body flex flex-col relative h-full max-h-screen justify-between">
        <div className="player-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={gameObject.playerStats} />
          <CaroTimer
            type={isPlayerTurn}
            seconds={isPlayerTurn ? remainingTime : gameObject.turnDuration}
          />
        </div>
        <div className="caro-table self-center my-4">
          {/* No move was made || Newest move */}
          <CaroTable
            board={gameObject.board}
            gameId={gameObject.id}
            playerSymbol={gameObject.playerSymbol}
            isPlayerTurn={isPlayerTurn}
            pattern={gameObject?.result?.pattern}
            isGameOver={gameObject?.state === "completed"}
            newMovePosition={gameObject?.moveHistory[moveIndex]?.position}
            type="computer"
          />
        </div>
        <div className="opponent-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard
            type="bot"
            playerStats={{ rankTier: gameObject.rank }}
          />
          <CaroTimer
            type={!isPlayerTurn}
            seconds={!isPlayerTurn ? remainingTime : gameObject.turnDuration}
          />
        </div>
        {gameObject.result && (
          <CaroResultModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            result={gameObject.result}
            isSpectator={true}
          />
        )}
      </div>

      <div className={`second-column h-full`}>
        <CaroSidebarSpectator
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
          moveHistory={gameObject.moveHistory}
          isModalOpen={isModalOpen}
          mode={gameObject.mode}
        />
      </div>

      <div className={`third-column h-full w-[235px]`}>
        <img
          src="https://img.freepik.com/premium-vector/sports-betting-online-web-banner-template-smartphone-with-football-field-screen_257312-638.jpg"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default CaroComputerBattle;
