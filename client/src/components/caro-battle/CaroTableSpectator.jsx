import React from "react";
import CaroSquare from "./CaroSquare";

function CaroTableSpectator({ moveHistory, pattern }) {
  const board = moveHistory.boardState;
  const [moveX, moveY] = moveHistory.position;
  // Check if a cell is part of the winning pattern
  const isInWinningPattern = (i, y) => {
    return (
      pattern &&
      pattern.some(([patternI, patternY]) => patternI === i && patternY === y)
    );
  };

  // Create the table layout
  const table = [];
  for (let i = 0; i < board.length; i++) {
    const rowCells = [];
    for (let y = 0; y < board[i].length; y++) {
      const isWinningCell = isInWinningPattern(i, y);
      const isNewMove = i === moveX && y === moveY;
      rowCells.push(
        <td
          key={`${i}-${y}`}
          className={`border border-black border-collapse ${
            isNewMove ? "bg-amber-200" : isWinningCell ? "bg-green-100" : ""
          }`}
        >
          <CaroSquare value={board[i][y]} isClickable={false} />
        </td>
      );
    }
    table.push(<tr key={i}>{rowCells}</tr>);
  }

  return (
    <table className="table-fixed mx-auto border border-black">
      <tbody>{table}</tbody>
    </table>
  );
}

export default CaroTableSpectator;
