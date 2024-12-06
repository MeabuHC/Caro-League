import React from "react";

function CaroSquare({
  value = null,
  onSquareClick = () => {},
  onSquareMouseOver = () => {},
  onSquareMouseLeave = () => {},
  isHovered = false,
  isClickable = true,
  size = "default",
}) {
  let valueColorCSS;
  if (value === "X") {
    if (isHovered) valueColorCSS = "text-blue-400";
    else valueColorCSS = "text-blue-600";
  } else if (value === "O") {
    if (isHovered) valueColorCSS = "text-red-400";
    else valueColorCSS = "text-red-600";
  }

  let sizeCSS;
  if (size === "default") {
    sizeCSS = "w-8 h-8";
  } else if (size === "medium") {
    sizeCSS = "w-6 h-6";
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
        className={`flex items-center justify-center ${sizeCSS}  text-2xl font-bold font-caroFont select-none ${valueColorCSS} ${
          !isClickable && "cursor-default"
        } `}
      >
        {value}
      </button>
    </div>
  );
}

export default CaroSquare;
