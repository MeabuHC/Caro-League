import React, { useState } from "react";
import styles from "../styles/pages/CaroBattleHistory.module.css";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import CaroTableSpectator from "../components/caro-battle/CaroTableSpectator";
import CaroSidebarSpectator from "../components/caro-battle/CaroSidebarSpectator";
import CaroTimer from "../components/caro-battle/CaroTimer";
import CaroResultModal from "../components/caro-battle/CaroResultModal";

function CaroBattleHistory({ gameData }) {
  const [moveIndex, setMoveIndex] = useState(gameData.moveHistory.length - 1);
  const [isModalOpen, setIsModalOpen] = useState(true); //Result modal

  const isPlayerOneTurn =
    gameData.players[0].symbol === gameData.moveHistory[moveIndex].symbol;
  const pattern = gameData.result?.pattern;
  console.log(gameData);
  return (
    <div
      className={`${styles.container} max-h-full min-h-full h-full overflow-y-auto items-center grid grid-cols-[auto_auto_1fr] px-10 py-3`}
    >
      <div className="caro-body flex flex-col relative mx-10 h-full max-h-screen justify-between">
        <div className="player-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={gameData.players[0]} />
          <CaroTimer
            type={isPlayerOneTurn}
            seconds={
              isPlayerOneTurn
                ? gameData.moveHistory[moveIndex].remainingTime
                : gameData.turnDuration
            }
          />
        </div>
        <div className="caro-table self-center bg-slate-300 my-4">
          <CaroTableSpectator
            moveHistory={gameData.moveHistory[moveIndex]}
            pattern={
              moveIndex === gameData.moveHistory.length - 1 ? pattern : null
            }
          />
        </div>
        <div className="opponent-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={gameData.players[1]} />
          <CaroTimer
            type={!isPlayerOneTurn}
            seconds={
              !isPlayerOneTurn
                ? gameData.moveHistory[moveIndex].remainingTime
                : gameData.turnDuration
            }
          />
        </div>
        <CaroResultModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          result={gameData.result}
          isSpectator={true}
        />
      </div>

      <div className={`second-column h-full`}>
        <CaroSidebarSpectator
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
          moveHistory={gameData.moveHistory}
          isModalOpen={isModalOpen}
        />
      </div>
    </div>
  );
}

export default CaroBattleHistory;
