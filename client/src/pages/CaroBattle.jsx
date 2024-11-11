import React, { useEffect, useRef, useState } from "react";
import CaroTable from "../components/caro-battle/CaroTable";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import CaroTimer from "../components/caro-battle/CaroTimer";
import { useCaroSocket } from "../context/CaroSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import CaroResultModal from "../components/caro-battle/CaroResultModal";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useUserContext } from "../context/UserContext";
import styles from "../styles/pages/CaroBattle.module.css";

function CaroBattle() {
  const { gameId } = useParams(); // Take gameId from param
  const [isModalOpen, setIsModalOpen] = useState(true); //Result modal
  const [gameObject, setGameObject] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();

  useEffect(() => {
    //Re-connect
    if (!socket) {
      initializeConnection();
      return;
    }

    // Emit request for initial game data when the component is mounted
    if (gameId && socket) {
      socket.emit("get-initial-game", gameId);
    }

    const handleReceiveGameObject = (gameObj) => {
      console.log("Receive game object!");
      console.log(gameObj);
      if (!gameObj) navigate("/caro"); // If no game object, redirect
      setGameObject(gameObj);
    };

    if (socket) {
      socket.on("receive-game-object", handleReceiveGameObject);
    }

    return () => {
      if (socket) {
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
      <Spin
        indicator={<LoadingOutlined spin />}
        size="small"
        style={{ color: "white" }}
      />
    );
  }

  // Taking out both user data
  const playerSymbol = gameObject.symbols[user._id];
  const playerStats = gameObject.players[user._id];

  // Find the opponent ID by excluding the playerId
  const opponentId = Object.keys(gameObject.players).find(
    (id) => id !== user._id
  );

  // Access the opponent's stats
  const opponentStats = gameObject.players[opponentId];

  const isPlayerTurn = playerSymbol && playerSymbol === gameObject.turn;
  const turnDuration = gameObject.turnDuration;

  return (
    <div
      className={`${styles.container} max-h-full min-h-full h-screen overflow-y-auto items-center bg-neutral-700 grid grid-cols-[auto_auto_1fr] px-10`}
    >
      <div className="caro-body flex flex-col pt-2 relative self-start overflow-auto mr-10">
        <div className="player-card self-start flex flex-row w-full items-center">
          <CaroPlayerCard playerStats={playerStats} />
          <CaroTimer
            type={isPlayerTurn}
            seconds={isPlayerTurn ? remainingTime : turnDuration}
          />
        </div>
        <div className="caro-table self-center my-5 bg-slate-300">
          <CaroTable
            board={gameObject.board}
            gameId={gameObject.id}
            playerSymbol={playerSymbol}
            isPlayerTurn={isPlayerTurn}
            pattern={gameObject?.result?.pattern}
            isGameOver={gameObject?.state === "completed"}
          />
        </div>
        <div className="opponent-card self-start flex flex-row w-full items-center">
          <CaroPlayerCard playerStats={opponentStats} />
          <CaroTimer
            type={!isPlayerTurn}
            seconds={!isPlayerTurn ? remainingTime : turnDuration}
          />
        </div>
        {gameObject.result && (
          <CaroResultModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            result={gameObject.result}
            socket={socket}
            gameId={gameId}
          />
        )}
      </div>

      <div className="second-column bg-neutral-800 p-5 overflow-auto">
        {/* Add your content for the second column here */}
        <p>Some content for the second column</p>
      </div>
    </div>
  );
}

export default CaroBattle;
