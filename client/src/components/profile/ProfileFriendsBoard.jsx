import React, { useEffect, useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

function ProfileFriendsBoard({ profileData }) {
  const [friendActiveStatus, setFriendActiveStatus] = useState(
    profileData?.friendActiveStatus || {}
  );
  const friendList = profileData?.userId?.friends || [];
  const gridRows = friendList.length > 5 ? "grid-rows-2" : "grid-rows-1";
  const { socket: userSocket } = useUserContext();

  useEffect(() => {
    if (userSocket) {
      const handleUserActiveStatus = (data) => {
        setFriendActiveStatus((prevStatus) => ({
          ...prevStatus,
          [data.userId]: {
            isActive: data.online,
            last_active: data.last_active,
          },
        }));
      };

      userSocket.on("user-active-status", handleUserActiveStatus);

      return () => {
        userSocket.off("user-active-status", handleUserActiveStatus);
      };
    }
  }, [userSocket]);

  return (
    <div className="friends-board w-full bg-[#262522] rounded-md">
      <Link className="friends-board-header h-[48px] bg-[#262522] flex flex-row items-center mx-3 hover:text-white text-[#DFDEDE] border-b-2 border-solid border-[#3C3B39]">
        <span className="font-semibold">Friends ({friendList.length})</span>
        <RightOutlined className="ml-auto" />
      </Link>
      {friendList.length === 0 ? (
        <div className="mx-3 py-3">Nothing to display yet</div>
      ) : (
        <div
          className={`friends-board-content grid grid-cols-5 gap-[10px] ${gridRows} mx-3 my-3`}
        >
          {friendList.map((friend) => (
            <Link
              to={`/profile/${friend?.username}`}
              title={friend?.username || ""}
              key={friend?._id}
            >
              <div className="w-[50px] h-[50px] relative">
                <img
                  src={friend?.avatarUrl || ""}
                  alt="Avatar"
                  className="w-full h-full"
                />
                {friendActiveStatus?.[friend?._id]?.isActive && (
                  <div className="h-[15px] w-[15px] absolute bg-[#81B64C] bottom-0 right-0"></div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileFriendsBoard;
