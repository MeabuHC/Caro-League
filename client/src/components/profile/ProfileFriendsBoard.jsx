import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ProfileFriendsBoard({ profileData }) {
  const friendList = profileData.userId.friends;
  const gridRows = friendList.length > 5 ? "grid-rows-2" : "grid-rows-1";

  return (
    <div className="friends-board w-full bg-[#262522] rounded-md">
      <Link className="friends-board-header h-[48px] bg-[#262522] flex flex-row items-center mx-3 hover:text-white text-[#DFDEDE] border-b-2 border-solid border-[#3C3B39]">
        <span className=" font-semibold">Friends ({friendList.length})</span>
        <RightOutlined className="ml-auto" />
      </Link>
      {friendList.length === 0 ? (
        <div className="mx-3 py-3">Nothing to display yet</div>
      ) : (
        <div
          className={`friends-board-content grid grid-cols-5 gap-[10px] ${gridRows} mx-3 my-3`}
        >
          {friendList.map((friend) => {
            return (
              <Link
                to={`/profile/${friend.username}`}
                title={`${friend.username}`}
                key={friend._id}
              >
                <img
                  src={`${friend.avatarUrl}`}
                  alt="Avatar"
                  className="w-[50px] h-[50px]"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProfileFriendsBoard;
