import React, { useEffect, useState } from "react";

import { useUserContext } from "../../context/UserContext";
import { Link, useParams } from "react-router-dom";

function ChatConversationList({ conversationList }) {
  const { user } = useUserContext();
  const { id: conversationId } = useParams();

  return (
    <div className="contact-list w-full h-[536px] max-h-[536px] pt-3 px-2 overflow-y-auto">
      {conversationList.map((conversation) => {
        const isSelected = conversation._id.toString() === conversationId;
        const friend =
          conversation.user1.username === user.username
            ? conversation.user2
            : conversation.user1;

        return (
          <Link
            className={`contact-item w-full h-[68px] rounded-lg px-[10px] py-[10px] flex flex-row select-none ${
              isSelected ? "bg-[#3A3A3A]" : "hover:bg-[#474747]"
            } `}
            key={conversation._id.toString()}
            to={`/chats/${conversation._id}`}
          >
            <div className={`h-full w-[48px] mr-4 relative`}>
              <img
                className="w-full h-full rounded-full"
                src={friend.avatarUrl}
              />
              {conversation.active_status.online && (
                <div className="absolute bg-[#31A24C] w-[16px] h-[16px] rounded-full -bottom-0.5 right-0 border-2 border-[#1F1F1F]"></div>
              )}
            </div>
            <div className="contact-text h-full flex-1 flex flex-col items-start whitespace-nowrap overflow-hidden">
              <span className="username text-white font-medium text-base">
                {friend.username}
              </span>
              {conversation.last_message && (
                <span className="text-[#8B8B8B] whitespace-nowrap overflow-hidden">
                  {conversation.last_message.senderId === user._id.toString() ||
                    (conversation.last_message?.senderId?._id ===
                      user._id.toString() &&
                      "You: ")}{" "}
                  {conversation.last_message.message}{" "}
                  {getTimeAgoSpan(conversation.last_message.createdAt)}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ChatConversationList;

function getTimeAgoSpan(timestamp) {
  const currentTime = new Date();
  const pastTime = new Date(timestamp);
  const timeDifference = currentTime - pastTime; // difference in milliseconds

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (minutes < 1) return null; // Do not show anything for 0 sec or less than 1 min

  return (
    <>
      <span className="font-bold">·</span>{" "}
      {minutes < 60
        ? `${minutes} min${minutes !== 1 ? "s" : ""}`
        : hours < 24
        ? `${hours} hr${hours !== 1 ? "s" : ""}`
        : `${days} day${days !== 1 ? "s" : ""}`}
    </>
  );
}
