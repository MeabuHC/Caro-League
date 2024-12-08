import React from "react";

function CaroLobbyButtons({ imgSRC, buttonHeader, buttonInfo, handleClick }) {
  return (
    <button
      onClick={handleClick}
      className="h-[96px] w-full bg-[#1E1E1B] hover:bg-[#21201D] border-b-4 border-[#171614] rounded-md px-[18px] py-[18px] flex flex-row transition-all duration-200"
    >
      <div className="img-container h-full w-[48px]">
        <img src={imgSRC} />
      </div>
      <div className="button-info text-left ml-5">
        <span className="text-2xl text-white font-bold block">
          {buttonHeader}
        </span>
        <span className="text-xs text-[#C1C1C0]">{buttonInfo}</span>
      </div>
    </button>
  );
}

export default CaroLobbyButtons;
