import React from "react";
import styles from "../../styles/components/CaroSidebarSpectator.module.css";

import CaroResultButtons from "./CaroResultButtons";
import CaroHistoryBoard from "./CaroHistoryBoard";
import CaroSidebarButtons from "./CaroSidebarButtons";

function CaroSidebarSpectator({
  moveIndex,
  setMoveIndex,
  moveHistory,
  isModalOpen,
}) {
  return (
    <div
      className={`overflow-y-hidden h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
    >
      <div className="flex-1"></div>
      <CaroHistoryBoard
        moveHistory={moveHistory}
        moveIndex={moveIndex}
        setMoveIndex={setMoveIndex}
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
