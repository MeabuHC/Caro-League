import React from "react";
import CaroSquare from "./CaroSquare";

function CaroTableSpectator({ moveHistory, pattern, size = "default" }) {
  const board = moveHistory.boardState;
  const position = moveHistory.position;
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
      const isNewMove = position && i === position[0] && y === position[1];
      rowCells.push(
        <td
          key={`${i}-${y}`}
          className={`border border-black border-collapse ${
            isNewMove ? "bg-amber-200" : isWinningCell ? "bg-green-100" : ""
          }`}
        >
          <CaroSquare value={board[i][y]} isClickable={false} size={size} />
        </td>
      );
    }
    table.push(<tr key={i}>{rowCells}</tr>);
  }

  return (
    <table className="table-fixed border border-black bg-slate-300">
      <tbody>{table}</tbody>
    </table>
  );
}

export default CaroTableSpectator;
