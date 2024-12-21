import React, { useState } from "react";
import friendSVG from "../assets/svg/friends.svg";

import FriendList from "../components/friends/FriendList";
import FriendRequestList from "../components/friends/FriendRequestList";

function Friends() {
  return (
    <>
      <div className="h-full w-full bg-[#312E2B] p-3 overflow-x-auto">
        <div className="grid grid-cols-[728px,300px] w-[1028px] grid-rows-[auto,auto] mx-auto gap-4 max-w-full">
          <div className="py-5 header flex flex-row text-white text-3xl font-bold">
            <img src={friendSVG} className="w-[40px] h-[40px] mr-3" />
            <h1 className="">Friends</h1>
          </div>
          <FriendList />
          <FriendRequestList />
        </div>
      </div>
    </>
  );
}

export default Friends;
