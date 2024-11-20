import React from "react";
import { useUserContext } from "../../context/UserContext";

function CaroGameOverMessage({ gameObject }) {
  const result = gameObject.result;
  let text;
  switch (result.type) {
    case "abort": {
      text = <span>Game aborted ({gameObject.turnDuration} seconds)</span>;
      break;
    }
    case "draw": {
      text = (
        <span>Game ended in a draw ({gameObject.turnDuration} seconds)</span>
      );
      break;
    }

    case "timeout":
    case "win": {
      text = (
        <>
          <span>
            <a
              href={`/member/${result.winner}`}
              className="hover:text-[#DFDEDE] font-bold"
              target="_blank"
            >
              {result.winner}
            </a>{" "}
            won {result.reason} ({gameObject.turnDuration} seconds)
          </span>
          <br />
          <span></span>
        </>
      );
      break;
    }
    default: {
      text = <span>Unknown result</span>;
    }
  }
  return (
    <div className="game-over-message my-2">
      <strong>GAME OVER</strong>
      <br />
      {text}
    </div>
  );
}

export default CaroGameOverMessage;
