import React from "react";

function CaroGameMessage({ messageObj, isSender = false, hideSender = false }) {
  return (
    <div className="game-message my-2">
      {!hideSender && (
        <a
          href={`/member/${messageObj.sender}`}
          className={`hover:text-[#C3C2C1] ${
            isSender ? "text-[#F7C631]" : ""
          } font-bold`}
        >
          {messageObj.sender}:{" "}
        </a>
      )}
      <span className="break-words hyphens-auto">{messageObj.message}</span>
    </div>
  );
}

export default CaroGameMessage;
