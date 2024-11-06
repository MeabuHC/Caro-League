import React, { useEffect, useState } from "react";
import CaroTable from "../components/caro-battle/CaroTable";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import CaroTimer from "../components/caro-battle/CaroTimer";
import { useCaroSocket } from "../context/CaroSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import CaroResultModal from "../components/caro-battle/CaroResultModal";

function CaroBattle() {
  const socket = useCaroSocket();
  const [isModalOpen, setIsModalOpen] = useState(true); //Result modal
  const { roomId } = useParams(); // Take roomId from param
  const [roomObject, setRoomObject] = useState(null);
  const [result, setResult] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();
  // Config socket
  useEffect(() => {
    // Handlers //
    const handleReceiveRoomObject = (roomObj) => {
      console.log("Receive room object!");
      console.log(roomObj);
      if (!roomObj) navigate("/caro");
      setRoomObject(roomObj);
    };

    const handleReceiveGameResult = (resultObj) => {
      console.log("Receive result!");
      console.log(resultObj);
      setResult(resultObj);
    };

    socket.on("receive-room-object", handleReceiveRoomObject);
    socket.on("gameResult", handleReceiveGameResult);

    // Emitting //
    // Get initial room
    socket.emit("get-room-object", roomId);

    return () => {
      socket.emit("leave-room", roomId); //Leave current room
      socket.off("receive-room-object", handleReceiveRoomObject);
      socket.off("gameResult", handleReceiveGameResult);
    };
  }, []);

  // Poll for updates until the game is over
  useEffect(() => {
    if (!roomObject) {
      return;
    }

    if (roomObject.isGameOver) {
      console.log("Game over runs!");
      console.log(roomObject.remainingTime);
      setRemainingTime(roomObject.remainingTime);
      return;
    }

    // Reset timer to real timer
    setRemainingTime(roomObject.remainingTime);

    // Update timer every 3 seconds
    const getRoomIntervalId = setInterval(() => {
      socket.emit("get-room-object", roomId);
    }, 3000);

    //Reset timer
    const countdownIntervalId = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(getRoomIntervalId);
      clearInterval(countdownIntervalId);
    };
  }, [roomObject]);

  //Wait loading
  if (roomObject === null) {
    return;
  }

  //Taking out both user data
  const playerIds = Object.keys(roomObject.players);
  const playerStats = roomObject.players[socket.id];
  const opponentId = playerIds.find((id) => id !== socket.id);
  const opponentStats = roomObject.players[opponentId];

  const playerSymbol = roomObject.symbols[socket.id]; // Take player symbol
  const isPlayerTurn = playerSymbol && playerSymbol === roomObject.turn;
  const turnDuration = roomObject.turnDuration;

  return (
    <div className="max-h-full min-h-full overflow-y-auto flex flex-col items-center bg-neutral-700">
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
            board={roomObject.board}
            playerSymbol={playerSymbol}
            isPlayerTurn={isPlayerTurn}
            pattern={result?.pattern}
            isGameOver={roomObject?.isGameOver}
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
        />
      )}
    </div>
  );
}

export default CaroBattle;
