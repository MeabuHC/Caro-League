import React, { useEffect, useState } from "react";
import { RightOutlined, CheckOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import { useUserContext } from "../../context/UserContext";
import { message } from "antd";

function FriendRequestList() {
  const [loading, setLoading] = useState(false);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [showIncomingList, setShowIncomingList] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosWithRefreshToken(
          `/api/v1/friend-requests/me`,
          "get",
          null,
          {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          }
        );

        console.log(response.data.data);
        setFriendRequestList(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Split to two
  const incomingList = friendRequestList.filter(
    (req) => req.receiverId._id === user._id.toString()
  );
  const outgoingList = friendRequestList.filter(
    (req) => req.senderId._id === user._id.toString()
  );

  //Handle buttons
  const handleAcceptFriendRequest = async (requestId, username) => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests/accept",
        "patch",
        {
          requestId: requestId,
        }
      );
      console.log(response);
      message.success(`You and ${username} is now friend!`);
      // Remove the accepted request from the list
      setFriendRequestList((prevList) =>
        prevList.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.log(error);
      message.error("Something went wrong! Please reload");
    }
  };

  const handleDeclineFriendRequest = async (requestId, username) => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests/decline",
        "patch",
        {
          requestId: requestId,
        }
      );
      console.log(response);
      message.success(`You declined ${username} friend request!`);
      // Remove the declined request from the list
      setFriendRequestList((prevList) =>
        prevList.filter((request) => request._id !== requestId)
      );
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  const handleCancelFriendRequest = async (requestId, receiverId, username) => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests",
        "delete",
        {
          receiverId: receiverId,
        }
      );

      setFriendRequestList((prevList) =>
        prevList.filter((request) => request._id !== requestId)
      );

      message.success(`You have canceled the friend request for ${username}`);
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  return (
    <div className="friend-request h-[310px] col-start-2 row-start-2 pr-5">
      <div className=" bg-[#262522] h-full rounded-lg text-[#DFDEDE]">
        {/* Header */}
        <Link className="stats-board-header h-[58px] bg-[#262522] flex flex-row items-center mx-3 hover:text-white ">
          <span className=" font-semibold text-lg">Friend Requests</span>
          <RightOutlined className="ml-auto" />
        </Link>

        <div className="w-full h-[50px] flex flex-row">
          <button
            className={`flex-1 font-semibold border-b-2 ${
              showIncomingList ? "border-[#DFDEDE]" : "border-[#262522]"
            }`}
            onClick={() => setShowIncomingList(true)}
          >
            Incoming{" "}
            <span className="inline-block bg-[#3C3B39] text-[#C9C8C8] rounded-md text-center select-none py-[0.1rem] px-[0.4rem] ml-2">
              {incomingList.length}
            </span>
          </button>
          <button
            className={`flex-1 font-semibold border-b-2 ${
              !showIncomingList ? "border-[#DFDEDE]" : "border-[#262522]"
            }`}
            onClick={() => setShowIncomingList(false)}
          >
            {" "}
            Outgoing{" "}
            <span className="inline-block bg-[#3C3B39] text-[#C9C8C8] rounded-md text-center select-none py-[0.1rem] px-[0.4rem] ml-2">
              {outgoingList.length}
            </span>
          </button>
        </div>

        {/* List */}
        <div className="list mt-5 h-[170px] max-h-[170px] overflow-y-auto px-3">
          {showIncomingList
            ? incomingList.map((req) => {
                return (
                  <div
                    className="friend-request-item h-[32px] w-full flex items-center mb-3"
                    key={req._id}
                  >
                    <img
                      src={req.senderId.avatarUrl}
                      className="h-full w-[32px] mr-3"
                    />

                    <Link
                      to={`/profile/${req.senderId.username}`}
                      className="text-[#B9C2C1] hover:text-[#C3C2C1] font-semibold"
                    >
                      {req.senderId.username}
                    </Link>
                    <button
                      className="button w-[32px] h-full bg-[#3C3B39] hover:bg-[#444340] rounded-md font-bold ml-auto text-white"
                      onClick={() =>
                        handleDeclineFriendRequest(
                          req._id,
                          req.senderId.username
                        )
                      }
                    >
                      X
                    </button>
                    <button
                      className="button w-[32px] h-full bg-[#81B64C] hover:bg-[#8BBA57] rounded-md font-bold ml-3 text-white"
                      onClick={() =>
                        handleAcceptFriendRequest(
                          req._id,
                          req.senderId.username
                        )
                      }
                    >
                      <CheckOutlined />
                    </button>
                  </div>
                );
              })
            : outgoingList.map((req) => {
                return (
                  <div
                    className="friend-request-item h-[32px] w-full flex items-center mb-3"
                    key={req._id}
                  >
                    <img
                      src={req.receiverId.avatarUrl}
                      className="h-full w-[32px] mr-3"
                    />

                    <Link
                      to={`/profile/${req.receiverId.username}`}
                      className="text-[#B9C2C1] hover:text-[#C3C2C1] font-semibold"
                    >
                      {req.receiverId.username}
                    </Link>
                    <button
                      className="button w-[32px] h-full bg-[#3C3B39] hover:bg-[#444340] rounded-md font-bold ml-auto text-white"
                      onClick={() =>
                        handleCancelFriendRequest(
                          req._id,
                          req.receiverId._id,
                          req.receiverId.username
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default FriendRequestList;
