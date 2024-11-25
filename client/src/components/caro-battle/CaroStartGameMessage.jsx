import React, { useRef } from "react";
import { useUserContext } from "../../context/UserContext";

function CaroStartGameMessage({ gameObject }) {
  const { user } = useUserContext();
  const snapshotRef = useRef(null);

  // Capture the snapshot only on the first render
  if (!snapshotRef.current && gameObject) {
    snapshotRef.current = {
      lpChanges: gameObject.lpChanges[user._id],
      players: Object.values(gameObject.players).map((element) => ({
        username: element.userId.username,
        currentDivision: element.currentDivision,
        tier: element.rankId.tier,
      })),
      turnDuration: gameObject.turnDuration,
    };
  }

  const snapshot = snapshotRef.current;

  if (!snapshot) return null; // Handle cases where the snapshot isn’t ready

  return (
    <div className="game-start-message my-2">
      <strong>NEW GAME</strong>
      <br />
      <a
        href={`/member/${snapshot.players[0].username}`}
        className="hover:text-[#DFDEDE] font-bold"
        target="_blank"
      >
        {`${snapshot.players[0].username} `}
      </a>
      {`(${snapshot.players[0].tier} ${snapshot.players[0].currentDivision})`}{" "}
      vs.
      <a
        href={`/member/${snapshot.players[1].username}`}
        target="_blank"
        className="hover:text-[#DFDEDE] font-bold"
      >
        {" "}
        {snapshot.players[1].username}{" "}
      </a>
      {`(${snapshot.players[1].tier} ${snapshot.players[1].currentDivision})`}
      <br />({snapshot.turnDuration} seconds)
      <br />
      {`win +${snapshot.lpChanges.win} / draw ${
        snapshot.lpChanges.draw >= 0
          ? "+" + snapshot.lpChanges.draw
          : snapshot.lpChanges.draw
      } / lose ${snapshot.lpChanges.lose}`}
    </div>
  );
}

export default CaroStartGameMessage;
