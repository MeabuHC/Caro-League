import React from "react";
import styles from "../../styles/components/CaroHistoryBoard.module.css";

function CaroHistoryBoard({
  moveHistory,
  moveIndex,
  setMoveIndex,
  isSpectator = false,
}) {
  const handleMoveHistoryClick = (moveIndex) => {
    setMoveIndex(moveIndex);
  };

  // Grouped 2 history together
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

  return (
    <div className={`${styles.history_board} w-full`}>
      <div
        className={`${styles.history_board_header} h-14 flex flex-row items-center`}
      >
        <div className="w-20 text-center">Move</div>
        <div className="w-20 text-center">X</div>
        <div className="w-20 text-center">O</div>
      </div>

      <div
        className={`${
          styles.history_board_body
        } flex flex-col overflow-x-auto overflow-y-auto ${
          !isSpectator ? `max-h-[150px] h-[150px]` : `max-h-[375px] h-[375px]`
        }`}
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
                {"[" + moveData[0].position.map((el) => el + 1).join(",") + "]"}
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
  );
}

export default CaroHistoryBoard;
