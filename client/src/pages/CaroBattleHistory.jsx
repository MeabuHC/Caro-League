import React, { useState } from "react";
import styles from "../styles/pages/CaroBattleHistory.module.css";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import CaroTableSpectator from "../components/caro-battle/CaroTableSpectator";
import CaroSidebarSpectator from "../components/caro-battle/CaroSidebarSpectator";

function CaroBattleHistory({ gameData }) {
  const [moveIndex, setMoveIndex] = useState(0);
  const playerOneSymbol = gameData.players[0].userId._id;
  console.log(gameData);
  return (
    <div
      className={`${styles.container} max-h-full min-h-full h-full overflow-y-auto items-center grid grid-cols-[auto_auto_1fr] px-10 py-3`}
    >
      <div className="caro-body flex flex-col relative mr-10 h-full max-h-screen justify-between">
        <div className="player-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={gameData.players[0]} />
        </div>
        <div className="caro-table self-center bg-slate-300 my-4">
          <CaroTableSpectator moveHistory={gameData.moveHistory[moveIndex]} />
        </div>
        <div className="opponent-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={gameData.players[1]} />
        </div>
      </div>

      <div className={`second-column h-full`}>
        <CaroSidebarSpectator
          setMoveIndex={setMoveIndex}
          moveLength={gameData.moveHistory.length}
        />
      </div>
    </div>
  );
}

export default CaroBattleHistory;
