import React from "react";
import styles from "../../styles/components/CaroSidebarSpectator.module.css";

import CaroResultButtons from "./CaroResultButtons";
import CaroHistoryBoard from "./CaroHistoryBoard";
import CaroSidebarButtons from "./CaroSidebarButtons";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

function CaroSidebarSpectator({
  moveIndex,
  setMoveIndex,
  moveHistory,
  isModalOpen,
  mode,
}) {
  return (
    <div
      className={`overflow-y-hidden h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
    >
      <div className="game-mode flex-1 flex flex-row items-center px-[15px] text-[#C3C2C1]">
        <strong>{mode === 0 ? `Basic Mode` : `Open Mode`}</strong>
        <Tooltip
          title={
            mode === 0
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
      <CaroHistoryBoard
        moveHistory={moveHistory}
        moveIndex={moveIndex}
        setMoveIndex={setMoveIndex}
        isSpectator={true}
      />
      <div
        className={`relative h-[120px] w-full`}
        style={{ borderTop: "1px solid #3C3B39" }}
      >
        <div
          className={`${
            isModalOpen
              ? styles.hide_result_buttons
              : styles.show_result_buttons
          } transition-all duration-300 absolute w-full`}
        >
          <CaroResultButtons isSpectator={true} />
        </div>
      </div>

      <CaroSidebarButtons
        setMoveIndex={setMoveIndex}
        moveLength={moveHistory.length}
      />
    </div>
  );
}

export default CaroSidebarSpectator;
