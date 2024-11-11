import React, { useEffect, useState } from "react";
import CaroSquare from "./CaroSquare";
import { useCaroSocket } from "../../context/CaroSocketContext";

const rows = 15;
const columns = 20;

function CaroTable({
  board,
  gameId,
  playerSymbol,
  isPlayerTurn,
  pattern,
  isGameOver,
}) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const { socket } = useCaroSocket();

  // Check if a cell is part of the winning pattern
  const isInWinningPattern = (i, y) => {
    return (
      pattern &&
      pattern.some(([patternI, patternY]) => patternI === i && patternY === y)
    );
  };

  // Make move
  function handleSquareClick(i, y) {
    if (
      hoveredCell &&
      hoveredCell.i === i &&
      hoveredCell.y === y &&
      board[i][y] === null
    ) {
      console.log("Make move!");
      setHoveredCell(null);
      socket.emit("makeMove", gameId, [i, y]);
    }
  }

  // Make hover effect
  function handleSquareMouseOver(i, y) {
    if (board[i][y] === null) {
      setHoveredCell({ i, y });
    }
  }

  function handleSquareMouseLeave() {
    setHoveredCell(null);
  }

  // Create the caro table from data
  const table = [];
  for (let i = 0; i < board.length; i++) {
    const rowCells = [];
    for (let y = 0; y < board[i].length; y++) {
      const isHovered =
        hoveredCell && hoveredCell.i === i && hoveredCell.y === y;
      const cellValue = isHovered ? playerSymbol : board[i][y];
      const isWinningCell = isInWinningPattern(i, y);

      rowCells.push(
        <td
          key={`${i}-${y}`}
          className={`border border-black border-collapse ${
            isWinningCell ? "bg-green-100" : ""
          }`}
        >
          {isPlayerTurn && !pattern && !isGameOver ? (
            <CaroSquare
              value={cellValue}
              onSquareClick={() => handleSquareClick(i, y)}
              onSquareMouseOver={() => handleSquareMouseOver(i, y)}
              onSquareMouseLeave={handleSquareMouseLeave}
              isHovered={isHovered}
            />
          ) : (
            <CaroSquare value={cellValue} />
          )}
        </td>
      );
    }
    table.push(<tr key={i}>{rowCells}</tr>);
  }

  return (
    <table className="table-fixed border-2px border-black">
      <tbody>{table}</tbody>
    </table>
  );
}

export default CaroTable;
