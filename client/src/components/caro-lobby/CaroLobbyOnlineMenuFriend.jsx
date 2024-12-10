import React from "react";
import handshake from "../../assets/svg/handshake.svg";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import CaroLobbyFriendSearch from "./CaroLobbyFriendSearch";
import CaroLobbyFriendChallenge from "./CaroLobbyFriendChallenge";

function CaroLobbyOnlineMenuFriend() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const opponent = searchParams.get("opponent");

  return (
    <>
      <div className="header h-[28px] flex flex-row justify-center items-center relative mt-7">
        <ArrowLeftOutlined
          className="absolute left-10 text-[#939291] text-xl hover:text-[#C3C2C1]"
          onClick={() => {
            if (opponent) navigate("/play/online/friend");
            else navigate("/play/online");
          }}
        />
        <img src={handshake} className="inline-block w-[24px] h-[24px] mr-3" />
        <span className="text-white text-xl font-bold">Play a Friend</span>
      </div>
      {opponent ? (
        <CaroLobbyFriendChallenge opponent={opponent} />
      ) : (
        <CaroLobbyFriendSearch />
      )}
    </>
  );
}

export default CaroLobbyOnlineMenuFriend;
