import React from "react";
import styles from "../../styles/components/CaroSidebar.module.css";
import {} from "@ant-design/icons";
import CaroResultButtons from "./CaroResultButtons";

function CaroSidebar({
  waitingRematch,
  receiveRematch,
  setWaitingRematch,
  setReceiveRematch,
  gameId,
  moveHistory,
}) {
  return (
    <div
      className={`overflow-auto h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
    >
      <div className={`${styles.move_history} flex-1`}>
        {/* <CaroHistoryBoard /> */}
      </div>
      <div className={`${styles.game_review_content}`}>
        <CaroResultButtons
          receiveRematch={receiveRematch}
          setReceiveRematch={setReceiveRematch}
          waitingRematch={waitingRematch}
          setWaitingRematch={setWaitingRematch}
          gameId={gameId}
          icon={true}
        />
      </div>
      <div className={`${styles.game_chat}`}></div>
    </div>
  );
}

export default CaroSidebar;
