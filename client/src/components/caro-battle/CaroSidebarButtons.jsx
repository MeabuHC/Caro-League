import React from "react";
import styles from "../../styles/components/CaroSidebarButtons.module.css";
import {
  LeftOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";

function CaroSidebarButtons({ setMoveIndex, moveLength, isDisabled }) {
  const handleBeginningMove = () => {
    if (!isDisabled) setMoveIndex(0);
  };

  const handleBackMove = () => {
    if (!isDisabled) {
      setMoveIndex((prev) => {
        if (prev === 0) return prev;
        return prev - 1;
      });
    }
  };

  const handleForwardMove = () => {
    if (!isDisabled) {
      setMoveIndex((prev) => {
        if (prev === moveLength - 1) return prev;
        return prev + 1;
      });
    }
  };

  const handleEndingMove = () => {
    if (!isDisabled) setMoveIndex(moveLength - 1);
  };

  return (
    <div className={`${styles.sidebar_buttons} h-[40px] w-full`}>
      <button
        className={`${styles.tooltip}`}
        onClick={handleBeginningMove}
        disabled={isDisabled}
      >
        <VerticalRightOutlined className={`${styles.icon}`} />
        <span className={`${styles.tooltiptext}`}>Beginning</span>
      </button>
      <button
        className={`${styles.tooltip}`}
        onClick={handleBackMove}
        disabled={isDisabled}
      >
        <LeftOutlined className={`${styles.icon}`} />
        <span className={`${styles.tooltiptext}`}>Back</span>
      </button>
      <button
        className={`${styles.tooltip}`}
        onClick={handleForwardMove}
        disabled={isDisabled}
      >
        <RightOutlined className={`${styles.icon}`} />
        <span className={`${styles.tooltiptext}`}>Forward</span>
      </button>
      <button
        className={`${styles.tooltip}`}
        onClick={handleEndingMove}
        disabled={isDisabled}
      >
        <VerticalLeftOutlined className={`${styles.icon}`} />
        <span className={`${styles.tooltiptext}`}>Ending</span>
      </button>
    </div>
  );
}

export default CaroSidebarButtons;
