import React from "react";
import styles from "../../styles/components/CaroSidebarSpectator.module.css";
import {
  LeftOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";

function CaroSidebarSpectator({ setMoveIndex, moveLength }) {
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
      if (prev === moveLength - 1) return prev;
      return prev + 1;
    });
  };

  const handleEndingMove = () => {
    setMoveIndex(moveLength - 1);
  };

  return (
    <div
      className={`overflow-auto h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
    >
      <div className="something flex-1"></div>
      <div className={`${styles.live_game_buttons} h-[40px] mt-7 w-full`}>
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
