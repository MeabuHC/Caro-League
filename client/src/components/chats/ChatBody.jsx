import React, { useState } from "react";
import {
  PhoneFilled,
  VideoCameraFilled,
  MoreOutlined,
} from "@ant-design/icons";

import ChatMessages from "./ChatMessages";
import { useOutletContext, useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { message } from "antd";

function ChatBody() {
  const { id: conversationId } = useParams();
  const { conversationList } = useOutletContext();
  const { user } = useUserContext();
  const [messageContent, setMessageContent] = useState("");

  const conversation = conversationList.find(
    (conv) => conv._id === conversationId
  );

  const friend =
    conversation.user1.username === user.username
      ? conversation.user2
      : conversation.user1;

  return (
    <div className="pr-[20px] flex-1">
      <div className="chat-messages  bg-[#1F1F1F] h-full rounded-lg">
        {/* Header */}
        <div className="chat-header w-full h-[68px] py-[10px] px-3 flex flex-row">
          {/* Left header */}
          <div className="chat-user h-full px-[6px] py-[6px] flex flex-row hover:bg-[#474747] cursor-pointer rounded-lg">
            <div className="w-9 h-9 mr-4 relative">
              <img className="rounded-full" src={friend.avatarUrl} />
              {conversation.active_status.online && (
                <div className="absolute bg-[#31A24C] w-[16px] h-[16px] rounded-full -bottom-0.5 right-0 border-2 border-[#1F1F1F]"></div>
              )}
            </div>

            <div className="user-text h-full flex flex-col items-start">
              <span className="username text-white text-[0.9375rem] leading-[18px] whitespace-nowrap overflow-hidden">
                {friend.username}
              </span>
              <span className="text-[#8B8B8B] text-[0.8125rem] leading-[16px] whitespace-nowrap overflow-hidden">
                {conversation.active_status.online
                  ? "Online Now"
                  : timeAgo(conversation.active_status.last_active)}
              </span>
            </div>
          </div>
          {/* Right Header */}
          <div className="chat-function h-full flex items-center ml-auto gap-4">
            <div className="w-[36px] h-[36px] text-[20px] text-[#B31AFF] rounded-full hover:bg-[#363636] flex items-center justify-center cursor-pointer">
              <PhoneFilled />
            </div>
            <div className="w-[36px] h-[36px] text-[20px] text-[#B31AFF] rounded-full hover:bg-[#363636] flex items-center justify-center cursor-pointer">
              <VideoCameraFilled />
            </div>
            <div className="w-[36px] h-[36px] text-[20px] text-[#B31AFF] rounded-full hover:bg-[#363636] flex items-center justify-center cursor-pointer rotate-90">
              <MoreOutlined />
            </div>
          </div>
        </div>

        {/* Body */}
        <ChatMessages />
      </div>
    </div>
  );
}

export default ChatBody;

function timeAgo(timestamp) {
  const now = Date.now(); // Current time in milliseconds
  const difference = now - timestamp; // Time difference in milliseconds

  // Calculate the time in various units
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeString = "Active ";

  if (seconds < 60) {
    timeString += `${seconds} seconds ago`;
  } else if (minutes < 60) {
    timeString += `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    timeString += `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    timeString += `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return timeString;
}
