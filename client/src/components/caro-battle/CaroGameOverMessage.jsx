import React from "react";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

function CaroGameOverMessage({ gameObject }) {
  const result = gameObject.result;
  const { user } = useUserContext();
  const userStats = gameObject.players[user._id];

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
            <Link
              to={`/member/${result.winner}`}
              className="hover:text-[#DFDEDE] font-bold"
              target="_blank"
            >
              {result.winner}
            </Link>{" "}
            won {result.reason} ({gameObject.turnDuration} seconds)
          </span>
          <br />
          <span>
            Your new rating is{" "}
            {userStats.rankId.tier +
              " " +
              userStats.currentDivision +
              " (" +
              userStats.lp +
              " LP)"}
          </span>
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
