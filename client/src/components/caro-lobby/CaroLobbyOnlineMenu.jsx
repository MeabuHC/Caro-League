import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CaroLobbyOnlineMenuDefault from "./CaroLobbyOnlineMenuDefault";
import CaroLobbyOnlineMenuFriend from "./CaroLobbyOnlineMenuFriend";

function CaroLobbyOnlineMenu() {
  const location = useLocation();

  const [tab, setTab] = useState(null);

  useEffect(() => {
    const newTab =
      location.pathname === "/play/online/friend" ? "friend" : "default";
    setTab(newTab);
  }, [location]);

  return (
    <div className="online-menu h-[100%] w-[450px] overflow-hidden flex flex-col">
      <div className="menu-content mt-3 my-5 bg-[#262522] h-full flex flex-col rounded-md overflow-hidden">
        {tab === "friend" ? (
          <CaroLobbyOnlineMenuFriend />
        ) : (
          <CaroLobbyOnlineMenuDefault />
        )}
      </div>
    </div>
  );
}

export default CaroLobbyOnlineMenu;
