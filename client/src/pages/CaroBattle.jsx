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
import CaroSidebar from "../components/caro-battle/CaroSidebar";
import CaroTableSpectator from "../components/caro-battle/CaroTableSpectator";

function CaroBattle() {
  const { gameId } = useParams(); // Take gameId from param
  const [isModalOpen, setIsModalOpen] = useState(true); //Result modal
  const [gameObject, setGameObject] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();
  const [waitingRematch, setWaitingRematch] = useState(false);
  const [receiveRematch, setReceiveRematch] = useState(false);
  const [moveIndex, setMoveIndex] = useState(null);

  useEffect(() => {
    //Re-connect
    if (!socket) {
      initializeConnection();
      return;
    }

    // Emit request for initial game data when the component is mounted
    if (gameId && socket) {
      console.log(socket.id + " currently!");
      console.log(socket);
      socket.emit("get-initial-game", gameId);
    }

    const handleReceiveGameObject = (gameObj) => {
      console.log("Receive game object!");
      console.log(gameObj);
      if (!gameObj) navigate("/caro"); // If no game object, redirect
      setGameObject((prevGameObject) => {
        //New move was made
        if (
          prevGameObject &&
          prevGameObject.moveHistory.length != gameObj.moveHistory.length
        ) {
          setMoveIndex(gameObj.moveHistory.length - 1);
        }
        //First time receving
        else if (!prevGameObject && gameObj.moveHistory.length > 0) {
          setMoveIndex(gameObj.moveHistory.length - 1);
        }
        return gameObj;
      });
    };

    if (socket) {
      socket.on("receive-game-object", handleReceiveGameObject);
    }

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

  let playerLpChange = null;
  let opponentLpChange = null;
  if (gameObject.result && gameObject.result?.type != "abort") {
    if (user.username === gameObject.result.winner) {
      playerLpChange = gameObject.lpChanges[user._id].win;
      opponentLpChange = gameObject.lpChanges[opponentId].lose;
    } else {
      playerLpChange = gameObject.lpChanges[user._id].lose;
      opponentLpChange = gameObject.lpChanges[opponentId].win;
    }
  } else if (gameObject.result?.type === "draw") {
    playerLpChange = gameObject.lpChanges[user._id].draw;
    opponentLpChange = gameObject.lpChanges[opponentId].draw;
  }

  return (
    <div
      className={`${styles.container} max-h-full min-h-full h-full overflow-y-auto items-center grid grid-cols-[auto_1fr_auto] px-10 py-3 gap-4`}
    >
      <div className="caro-body flex flex-col relative h-full max-h-screen justify-between">
        <div className="player-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={playerStats} lpChange={playerLpChange} />
          <CaroTimer
            type={isPlayerTurn}
            seconds={isPlayerTurn ? remainingTime : turnDuration}
          />
        </div>
        <div className="caro-table self-center bg-slate-300 my-4">
          {/* No move was made || Newest move */}
          {moveIndex === null ||
          moveIndex === gameObject.moveHistory.length - 1 ? (
            <CaroTable
              board={gameObject.board}
              gameId={gameObject.id}
              playerSymbol={playerSymbol}
              isPlayerTurn={isPlayerTurn}
              pattern={gameObject?.result?.pattern}
              isGameOver={gameObject?.state === "completed"}
              newMovePosition={gameObject?.moveHistory[moveIndex]?.position}
            />
          ) : (
            <CaroTableSpectator
              moveHistory={gameObject?.moveHistory[moveIndex]}
            />
          )}
        </div>
        <div className="opponent-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard
            playerStats={opponentStats}
            lpChange={opponentLpChange}
          />
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
            gameId={gameId}
            receiveRematch={receiveRematch}
            setReceiveRematch={setReceiveRematch}
            setWaitingRematch={setWaitingRematch}
            waitingRematch={waitingRematch}
          />
        )}
      </div>

      <div className={`second-column h-full`}>
        <CaroSidebar
          receiveRematch={receiveRematch}
          setReceiveRematch={setReceiveRematch}
          setWaitingRematch={setWaitingRematch}
          waitingRematch={waitingRematch}
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
          isModalOpen={isModalOpen}
          gameObject={gameObject}
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

export default CaroBattle;
