import React, { useEffect, useState } from "react";
import ChatSidebar from "../components/chats/ChatSidebar";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { message } from "antd";

import ChatBody from "../components/chats/ChatBody";
import { Outlet } from "react-router-dom";

export default function Chats() {
  const [conversationList, setConversationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversationList = async () => {
      try {
        const response = await axiosWithRefreshToken(
          "/api/v1/conversations/me"
        );
        console.log(response.data.data);
        setConversationList(response.data.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        message.error("Loading conversation failed!");
      } finally {
        setLoading(false);
      }
    };

    fetchConversationList();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-full w-full bg-[#312E2B] flex items-center justify-center relative p-3 overflow-auto">
        <div className="content flex flex-row w-full h-[640px] gap-4">
          <ChatSidebar conversationList={conversationList} />
          <Outlet context={{ conversationList }} />
        </div>
      </div>
    </>
  );
}
