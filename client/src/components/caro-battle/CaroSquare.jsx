import React from "react";

function CaroSquare({
  value = null,
  onSquareClick = () => {},
  onSquareMouseOver = () => {},
  onSquareMouseLeave = () => {},
  isHovered = false,
}) {
  let valueColorCSS;
  if (value === "X") {
    if (isHovered) valueColorCSS = "text-blue-400";
    else valueColorCSS = "text-blue-600";
  } else if (value === "O") {
    if (isHovered) valueColorCSS = "text-red-400";
    else valueColorCSS = "text-red-600";
  }

  return (
    <div
      className="caro_square"
      onClick={onSquareClick}
      onMouseOver={onSquareMouseOver}
      onMouseLeave={onSquareMouseLeave}
    >
      <button
        tabIndex={-1}
        className={`flex items-center justify-center w-8 h-8  text-2xl font-bold font-caroFont select-none ${valueColorCSS}`}
      >
        {value}
      </button>
    </div>
  );
}

export default CaroSquare;
