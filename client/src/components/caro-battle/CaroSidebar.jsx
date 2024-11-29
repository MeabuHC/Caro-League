import React from "react";
import styles from "../../styles/components/CaroSidebar.module.css";
import CaroResultButtons from "./CaroResultButtons";
import CaroSidebarButtons from "./CaroSidebarButtons";
import CaroHistoryBoard from "./CaroHistoryBoard";
import CaroChat from "./CaroChat";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

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
      <div className="game-mode flex-1 flex flex-row items-center px-[15px] text-[#C3C2C1]">
        <strong>{gameObject.mode === 0 ? `Basic Mode` : `Open Mode`}</strong>
        <Tooltip
          title={
            gameObject.mode === 0
              ? "Traditional Caro/Gomoku modes where exactly 5 in a row wins, but it must not be blocked on both sides."
              : "A mode where 5 or more stones in a row wins, regardless of being blocked on one or both sides."
          }
          className="hover: cursor-pointer"
        >
          <InfoCircleOutlined
            className="ml-auto text-lg"
            style={{ fontSize: "20px", verticalAlign: "middle" }}
          />
        </Tooltip>
      </div>

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
