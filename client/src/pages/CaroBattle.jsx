import React, { useEffect, useState } from "react";
import CaroTable from "../components/caro-battle/CaroTable";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import CaroTimer from "../components/caro-battle/CaroTimer";
import { useCaroSocket } from "../context/CaroSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import CaroResultModal from "../components/caro-battle/CaroResultModal";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useUserContext } from "../context/UserContext";

function CaroBattle() {
  const [isModalOpen, setIsModalOpen] = useState(true); //Result modal
  const { gameId } = useParams(); // Take gameId from param
  const [gameObject, setGameObject] = useState(null);
  const [result, setResult] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();
  const socket = useCaroSocket();
  const { user } = useUserContext();

  useEffect(() => {
    // Emit request for initial game data when the component is mounted
    if (gameId) {
      socket.emit("get-game-object", gameId);
    }

    const handleReceiveGameObject = (gameObj) => {
      console.log("Receive game object!");
      console.log(gameObj);
      if (!gameObj) navigate("/caro"); // If no game object, redirect
      setGameObject(gameObj);
    };

    const handleReceiveGameResult = (resultObj) => {
      console.log("Receive result!");
      console.log(resultObj);
      setResult(resultObj);
    };

    socket.on("receive-game-object", handleReceiveGameObject);
    socket.on("gameResult", handleReceiveGameResult);

    return () => {
      socket.emit("leave-game", gameId); // Leave current game
      socket.off("receive-game-object", handleReceiveGameObject);
      socket.off("gameResult", handleReceiveGameResult);
    };
  }, []);

  // Poll for updates until the game is over
  useEffect(() => {
    if (!gameObject) {
      return;
    }

    if (gameObject.state === "completed") {
      console.log("Game over runs!");
      console.log(gameObject.remainingTime);
      setRemainingTime(gameObject.remainingTime);
      return;
    }

    // Reset timer to real timer
    setRemainingTime(gameObject.remainingTime);

    // Update timer every 3 seconds
    const getGameIntervalId = setInterval(() => {
      socket.emit("get-game-object", gameId);
    }, 3000);

    //Reset timer
    const countdownIntervalId = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(getGameIntervalId);
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
    <div className="max-h-full min-h-full h-screen overflow-y-auto flex flex-col items-center bg-neutral-700">
      <div className="caro-body flex flex-col p-10">
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
            playerSymbol={playerSymbol}
            isPlayerTurn={isPlayerTurn}
            pattern={result?.pattern}
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
      </div>
      {result && (
        <CaroResultModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          result={result}
          socket={socket}
          gameId={gameId}
        />
      )}
    </div>
  );
}

export default CaroBattle;
