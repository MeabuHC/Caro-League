import React, { useEffect, useState } from "react";
import ChatSidebar from "../components/chats/ChatSidebar";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export default function Chats() {
  const [conversationList, setConversationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, socket: userSocket } = useUserContext();

  useEffect(() => {
    const fetchConversationList = async () => {
      try {
        const response = await axiosWithRefreshToken(
          "/api/v1/conversations/me"
        );
        console.log(response.data.data);
        // Sort by updatedAt in descending order (most recent at the top)
        const sortedConversations = response.data.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setConversationList(sortedConversations);

        // Join the room using the conversationId
        if (userSocket) {
          userSocket.emit(
            "join-room",
            response.data.data.map((conversation) => {
              return conversation._id.toString();
            })
          );
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        message.error("Loading conversation failed!");
      } finally {
        setLoading(false);
      }
    };

    fetchConversationList();
  }, []);

  useEffect(() => {
    if (userSocket) {
      const handleReceiveMessage = (message, conversationId2) => {
        console.log("Receive message:", message);

        // Update and sort the conversationList
        setConversationList((prevConversationList) => {
          const updatedList = prevConversationList.map((conversation) =>
            conversation._id === conversationId2
              ? {
                  ...conversation,
                  last_message: message,
                  updatedAt: new Date(),
                }
              : conversation
          );

          // Sort by updatedAt in descending order
          return updatedList.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
        });
      };

      userSocket.on("receive-message", handleReceiveMessage);

      return () => {
        userSocket.off("receive-message", handleReceiveMessage);
      };
    }
  }, []);

  useEffect(() => {
    if (userSocket) {
      const handleUserActiveStatus = (data) => {
        setConversationList((prevConversationList) =>
          prevConversationList.map((conversation) => {
            // Check if the user is part of the conversation
            if (
              conversation.user1._id === data.userId ||
              conversation.user2._id === data.userId
            ) {
              return {
                ...conversation,
                active_status: {
                  online: data.online,
                  last_active: data.last_active,
                },
              };
            }
            return conversation;
          })
        );
      };

      userSocket.on("user-active-status", handleUserActiveStatus);

      return () => {
        userSocket.off("user-active-status", handleUserActiveStatus);
      };
    }
  }, [userSocket, setConversationList]);

  return (
    <>
      <div className="h-full w-full bg-[#312E2B] flex items-center justify-center relative p-3 overflow-auto">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              size="large"
              style={{ color: "#9ECC5E" }}
            />
          </div>
        ) : (
          <div className="content flex flex-row w-full h-[640px] gap-4">
            <ChatSidebar conversationList={conversationList} />
            <Outlet context={{ conversationList }} />
          </div>
        )}
      </div>
    </>
  );
}
