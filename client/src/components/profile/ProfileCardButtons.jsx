import React, { useEffect, useState } from "react";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken.js";
import { useUserContext } from "../../context/UserContext.jsx";
import {
  EllipsisOutlined,
  MessageOutlined,
  UserAddOutlined,
  PlusCircleOutlined,
  UndoOutlined,
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal.js";
import styles from "../../styles/components/ProfileCardButtons.module.css";
import { message } from "antd";

function ProfileCardButtons({ profileData }) {
  const [friendStatus, setFriendStatus] = useState(null);
  const [isRemoveFriendModalOpen, setIsRemoveFriendModalOpen] = useState(false);
  const { user } = useUserContext();
  const friends = profileData.userId.friends;
  const friendRequest = profileData?.friendRequest;
  useEffect(() => {
    if (profileData.isFriend) {
      setFriendStatus("isFriend");
    } else if (user && friendRequest) {
      //Check if logged in and having pending friend request
      if (friendRequest.senderId === user._id) {
        setFriendStatus("senderPending");
      } else {
        setFriendStatus("receiverPending");
      }
    }
  }, []);

  const handleAddFriend = async () => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests",
        "post",
        {
          receiverId: profileData.userId._id,
        }
      );
      setFriendStatus("senderPending");
      message.success(
        `A request has been sent to ${profileData.userId.username} to be added to your friends list`
      );
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests",
        "delete",
        {
          receiverId: profileData.userId._id,
        }
      );
      setFriendStatus(null);
      message.success(
        `You have canceled the friend request for ${profileData.userId.username}`
      );
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests/accept",
        "patch",
        {
          requestId: profileData.friendRequest?._id,
        }
      );
      console.log(response);
      setFriendStatus("isFriend");
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  const handleDeclineFriendRequest = async () => {
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests/decline",
        "patch",
        {
          requestId: profileData.friendRequest?._id,
        }
      );
      setFriendStatus(null);
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  // Remove Friend
  const handleRemoveFriend = async () => {
    setIsRemoveFriendModalOpen(true);
  };

  const handleCancelRemoveFriend = async () => {
    setIsRemoveFriendModalOpen(false);
  };

  const handleAcceptRemoveFriend = async () => {
    console.log(profileData.userId._id);
    try {
      const response = await axiosWithRefreshToken(
        "/api/v1/friend-requests/remove",
        "delete",
        {
          friendId: profileData.userId._id,
        }
      );
      setIsRemoveFriendModalOpen(false);
      setFriendStatus(null);
      message.success(
        `${profileData.userId.username} has been removed from your friends list`
      );
    } catch {
      message.error("Something went wrong! Please reload");
    }
  };

  return (
    <div className="profile-bottom-function-buttons flex flex-row gap-2 text-sm text-[#C7C6C6] hover:text-[#E2E2E2]">
      {friendStatus === "receiverPending" ? (
        <>
          <div className="h-[48px] w-full flex flex-row items-center justify-center gap-8">
            <div className="font-semibold text-white text-lg">
              Accept Friend Request?
            </div>
            <div className="accept-decline-buttons flex flex-row gap-4">
              <button
                className="h-[48px] w-[160px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2"
                onClick={handleAcceptFriendRequest}
              >
                <CheckOutlined /> Accept
              </button>
              <button
                className="h-[48px] w-[160px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2"
                onClick={handleDeclineFriendRequest}
              >
                <CloseOutlined /> Decline
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {friendStatus === null && (
            <button
              className="h-[48px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2"
              onClick={handleAddFriend}
            >
              <UserAddOutlined className="text-[20px]" /> Add Friend
            </button>
          )}
          {friendStatus === "senderPending" && (
            <button
              className="h-[48px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2"
              onClick={handleCancelFriendRequest}
            >
              <UndoOutlined className="text-[20px]" /> Cancel Friend Request
            </button>
          )}
          {friendStatus === "isFriend" && (
            <button
              className="h-[48px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2"
              onClick={handleRemoveFriend}
            >
              <UserDeleteOutlined className="text-[20px]" /> Remove Friend
            </button>
          )}
          <button className="h-[48px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2">
            <PlusCircleOutlined className="text-[20px]" /> Challenge
          </button>
          <button className="h-[48px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2">
            <MessageOutlined className="text-[20px]" /> Message
          </button>
          <button className="h-[48px] bg-[#3C3B39] flex-1 rounded-md px-5 py-2 hover:bg-[#454441] transition-all ease-in-out duration-300 font-semibold flex flex-row justify-center items-center gap-2">
            <EllipsisOutlined className="text-[32px]" />
            More
          </button>
        </>
      )}
      <Modal
        open={isRemoveFriendModalOpen}
        centered={true}
        footer={null}
        closable={false}
        maskClosable={true}
        mask={true}
        wrapClassName={`${styles.modalWrapper}`}
      >
        <div className="confirm-message text-center text-[#DFDEDE] mb-4">
          Are you sure you want to remove {profileData.userId.username}?
        </div>
        <div className="confirm-buttons flex flex-row gap-4">
          <button
            className="h-[40px] flex-1 bg-[#3C3A38] text-[#C7C6C6] hover:bg-[#454340] hover:text-[#E2E2E1] rounded-md"
            onClick={handleCancelRemoveFriend}
          >
            Cancel
          </button>
          <button
            className="h-[40px] flex-1 bg-[#81B64C] text-white hover:bg-[#8EBC58] rounded-md"
            onClick={handleAcceptRemoveFriend}
          >
            Yes
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileCardButtons;
