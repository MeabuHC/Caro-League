import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

function CaroLobbyDropdown({
  children,
  imgSRC,
  isOpen,
  setIsOpen,
  text,
  style = null,
}) {
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="h-[56px] bg-[#3C3B39] hover:bg-[#494846] text-[#E2E2E1] hover:text-[#FFFFFF] w-full rounded-md relative transition-all duration-300 mb-4"
        style={style}
        onClick={handleClick}
      >
        {imgSRC && (
          <img
            src={imgSRC}
            className="h-[30px] w-[30px] mr-2 pb-1 inline-block"
          />
        )}
        <span className="font-semibold text-lg">{text}</span>

        {isOpen ? (
          <UpOutlined className="absolute right-[30px] top-1/2 -translate-y-1/2 text-[18px]" />
        ) : (
          <DownOutlined className="absolute right-[30px] top-1/2 -translate-y-1/2 text-[18px]" />
        )}
      </button>
      {isOpen && children}
    </>
  );
}

export default CaroLobbyDropdown;
