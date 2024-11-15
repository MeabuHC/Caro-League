import React from "react";
import styles from "../../styles/components/CaroSidebarSpectator.module.css";
import {
  LeftOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";
import CaroResultButtons from "./CaroResultButtons";
import CaroHistoryBoard from "./CaroHistoryBoard";

function CaroSidebarSpectator({
  moveIndex,
  setMoveIndex,
  moveHistory,
  isModalOpen,
}) {
  const handleBeginningMove = () => {
    setMoveIndex(0);
  };

  const handleBackMove = () => {
    setMoveIndex((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  };

  const handleForwardMove = () => {
    setMoveIndex((prev) => {
      if (prev === moveHistory.length - 1) return prev;
      return prev + 1;
    });
  };

  const handleEndingMove = () => {
    setMoveIndex(moveHistory.length - 1);
  };

  const handleMoveHistoryClick = (moveIndex) => {
    setMoveIndex(moveIndex);
  };

  return (
    <div
      className={`overflow-y-hidden h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
    >
      <div className="flex-1"></div>
      <CaroHistoryBoard
        moveHistory={moveHistory}
        onMoveHistoryClick={handleMoveHistoryClick}
        moveIndex={moveIndex}
      />
      <div className={`relative h-[120px] w-full`}>
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

      <div className={`${styles.live_game_buttons} h-[40px] w-full`}>
        <button className={`${styles.tooltip}`} onClick={handleBeginningMove}>
          <VerticalRightOutlined className={`${styles.icon}`} />
          <span className={`${styles.tooltiptext}`}>Beginning</span>
        </button>
        <button className={`${styles.tooltip}`} onClick={handleBackMove}>
          <LeftOutlined className={`${styles.icon}`} />
          <span className={`${styles.tooltiptext}`}>Back</span>
        </button>
        <button className={`${styles.tooltip}`} onClick={handleForwardMove}>
          <RightOutlined className={`${styles.icon}`} />
          <span className={`${styles.tooltiptext}`}>Forward</span>
        </button>
        <button className={`${styles.tooltip}`} onClick={handleEndingMove}>
          <VerticalLeftOutlined className={`${styles.icon}`} />
          <span className={`${styles.tooltiptext}`}>Ending</span>
        </button>
      </div>
    </div>
  );
}

export default CaroSidebarSpectator;
