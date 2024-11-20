import React from "react";
import styles from "../../styles/components/CaroSidebar.module.css";
import CaroResultButtons from "./CaroResultButtons";
import CaroSidebarButtons from "./CaroSidebarButtons";
import CaroHistoryBoard from "./CaroHistoryBoard";
import CaroChat from "./CaroChat";

function CaroSidebar({
  waitingRematch,
  receiveRematch,
  setWaitingRematch,
  setReceiveRematch,
  moveIndex,
  setMoveIndex,
  isModalOpen,
  gameObject,
}) {
  const isGameOver = gameObject?.state === "completed";
  const moveHistory = gameObject?.moveHistory;
  const gameId = gameObject?.id;

  return (
    <div
      className={`overflow-y-auto h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
      style={{ borderRadius: "0 0 0.3rem 0.3rem" }}
    >
      {/* Header */}
      <div className="flex-1">{/* Your header content */}</div>

      {/* Content Section */}
      <div className="overflow-y-auto">
        {/* CaroHistoryBoard */}
        <CaroHistoryBoard
          moveHistory={moveHistory}
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
        />
      </div>

      {/* Result Buttons */}
      <div
        className={`relative w-full transition-all duration-300`}
        style={{
          height: "140px",
          borderTop: "1px solid #3C3B39",
        }}
      >
        <div
          className={`${
            !isGameOver || (isGameOver && isModalOpen)
              ? styles.hide_result_buttons
              : styles.show_result_buttons
          } transition-all duration-300 absolute w-full`}
        >
          <CaroResultButtons
            receiveRematch={receiveRematch}
            setReceiveRematch={setReceiveRematch}
            waitingRematch={waitingRematch}
            setWaitingRematch={setWaitingRematch}
            gameId={gameId}
            icon={true}
          />
        </div>
      </div>

      {/* Sidebar buttons */}
      <CaroSidebarButtons
        moveLength={moveHistory.length}
        setMoveIndex={setMoveIndex}
        isDisabled={moveIndex === null}
      />

      {/* Game chat */}
      <CaroChat gameObject={gameObject} />
    </div>
  );
}

export default CaroSidebar;
