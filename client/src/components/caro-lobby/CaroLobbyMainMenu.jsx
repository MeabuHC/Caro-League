import React from "react";
import CaroLobbyButton from "./CaroLobbyButton";
import blitz from "../../assets/svg/blitz.svg";
import bot from "../../assets/svg/cute-bot.svg";
import handshake from "../../assets/svg/handshake.svg";
import archive from "../../assets/svg/archive.svg";
import leaderboard from "../../assets/svg/leaderboard.svg";

import { Link, useNavigate } from "react-router-dom";

function CaroLobbyMainMenu() {
  const navigate = useNavigate();
  const handlePlayOnlineClick = () => {
    navigate("/play/online");
  };
  const handlePlayBotsClick = () => {
    navigate("/not-found");
  };
  const handlePlayFriendsClick = () => {
    navigate("/play/online/friend");
  };
  return (
    <div className="lobby-menu mt-3 my-5 w bg-[#262522] w-[380px] overflow-hidden flex flex-col">
      <h1 className="text-3xl text-center text-white mt-[20px] mb-[30px] font-bold">
        Play Caro
      </h1>

      <div className="menu-buttons px-[32px] pb-[24px] flex flex-col gap-2">
        <CaroLobbyButton
          imgSRC={blitz}
          buttonHeader={"Play Online"}
          buttonInfo={"Play vs a person of similar skill"}
          handleClick={handlePlayOnlineClick}
        />
        <CaroLobbyButton
          imgSRC={bot}
          buttonHeader={"Play Bots"}
          buttonInfo={"Challenge a bot from Easy to Master"}
          handleClick={handlePlayBotsClick}
        />
        <CaroLobbyButton
          imgSRC={handshake}
          buttonHeader={"Play a Friend"}
          buttonInfo={"Invite a friend to a game of chess"}
          handleClick={handlePlayFriendsClick}
        />
      </div>

      <div className="menu-footer flex flex-row h-[24px] justify-center mt-auto mb-8 gap-8">
        <div className="archive">
          <Link to={"/games/archive"}>
            <img className="w-[24px] h-full inline-block mr-2" src={archive} />
            <span className="text-[#C3C2C1] hover:text-[#D9D6D8] font-semibold">
              Archive
            </span>
          </Link>
        </div>

        <div className="leaderboard">
          <Link to={"/leaderboard"}>
            <img
              className="w-[24px] h-full inline-block mr-2"
              src={leaderboard}
            />
            <span className="text-[#C3C2C1] hover:text-[#D9D6D8] font-semibold">
              Leaderboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CaroLobbyMainMenu;
