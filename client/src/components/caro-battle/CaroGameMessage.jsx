import React from "react";
import { Link } from "react-router-dom";

function CaroGameMessage({ messageObj, isSender = false, hideSender = false }) {
  return (
    <div className="game-message my-2">
      {!hideSender && (
        <Link
          to={`/member/${messageObj.sender}`}
          className={`hover:text-[#C3C2C1] ${
            isSender ? "text-[#F7C631]" : ""
          } font-bold`}
        >
          {messageObj.sender}:{" "}
        </Link>
      )}
      <span className="break-words hyphens-auto">{messageObj.message}</span>
    </div>
  );
}

export default CaroGameMessage;
