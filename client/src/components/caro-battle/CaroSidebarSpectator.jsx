import React from "react";
import styles from "../../styles/components/CaroSidebarSpectator.module.css";
import {
  LeftOutlined,
  RightOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";
import CaroResultButtons from "./CaroResultButtons";

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

  //Grouped 2 history together
  const groupedMoveHistory = moveHistory.reduce((acc, moveData, index) => {
    if (index % 2 === 0) {
      if (index + 1 < moveHistory.length) {
        acc.push([moveData, moveHistory[index + 1]]);
      } else {
        acc.push([moveData]);
      }
    }
    return acc;
  }, []);

  const handleMoveHistoryClick = (moveIndex) => {
    setMoveIndex(moveIndex);
  };

  return (
    <div
      className={`overflow-y-hidden h-full w-[450px] ${styles.caro_sidebar} flex flex-col`}
    >
      <div className="flex-1"></div>

      {/* History board */}
      <div className={`${styles.history_board} w-full`}>
        <div
          className={`${styles.history_board_header} h-14 flex flex-row items-center`}
        >
          <div className="w-20 text-center">Move</div>
          <div className="w-20 text-center">X</div>
          <div className="w-20 text-center">O</div>
        </div>

        {/* Table body */}
        <div
          className={`${styles.history_board_body} flex flex-col overflow-x-auto overflow-y-auto max-h-[300px] h-[300px]`}
        >
          {groupedMoveHistory.map((moveData, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0
                  ? styles.history_board_content_1
                  : styles.history_board_content_2
              } min-h-[40px] h-[40px] flex flex-row items-center`}
            >
              <div className="w-20 text-center">{index + 1 + "."}</div>

              <div className="w-20 text-center">
                <button
                  className={
                    moveIndex === index * 2 // First move of the group
                      ? styles.select_move
                      : ""
                  }
                  onClick={() => handleMoveHistoryClick(index * 2)}
                >
                  {"[" +
                    moveData[0].position.map((el) => el + 1).join(",") +
                    "]"}
                </button>
              </div>

              <div className="w-20 text-center">
                <button
                  className={
                    moveIndex === index * 2 + 1 // Second move of the group
                      ? styles.select_move
                      : ""
                  }
                  onClick={() => handleMoveHistoryClick(index * 2 + 1)}
                >
                  {moveData[1]
                    ? "[" + moveData[1].position.join(",") + "]"
                    : null}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
