import React from "react";
import { useUserContext } from "../../context/UserContext";

function CaroStartGameMessage({ gameObject }) {
  const { user } = useUserContext();
  const lpChanges = gameObject.lpChanges[user._id];

  const playerArray = Object.values(gameObject.players).map((element) => ({
    username: element.userId.username,
    currentDivision: element.currentDivision,
    tier: element.rankId.tier,
  }));

  console.log(playerArray);
  return (
    <div className="game-start-message mt-3">
      <strong>NEW GAME</strong>
      <br />
      <a
        href={`/member/${playerArray[0].username}`}
        className="hover:text-[#DFDEDE]"
        target="_blank"
      >
        {`${playerArray[0].username} `}
      </a>
      {`(${playerArray[0].tier} ${playerArray[0].currentDivision})`} vs.
      <a href={`/member/${playerArray[1].username}`} target="_blank">
        {" "}
        {playerArray[1].username}{" "}
      </a>
      {`(${playerArray[1].tier} ${playerArray[1].currentDivision})`} (
      {gameObject?.turnDuration} seconds)
      <br />
      {`win +${lpChanges.win} / draw ${
        lpChanges.draw >= 0 ? "+" + lpChanges.draw : lpChanges.draw
      } / lose ${lpChanges.lose}`}
    </div>
  );
}

export default CaroStartGameMessage;
