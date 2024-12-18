import React from "react";
import { CommentOutlined } from "@ant-design/icons";

function ChatBodyEmpty() {
  return (
    <div className="pr-[20px] flex-1 flex flex-col items-center justify-center">
      <div className="chat-messages bg-[#1F1F1F] w-full h-full rounded-lg flex flex-col items-center justify-center">
        <CommentOutlined className="text-5xl text-gray-50 mb-4" />
        <p className="text-white text-center text-lg font-medium">
          Start a conversation
        </p>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Select a contact or create a new conversation to begin chatting.
        </p>
      </div>
    </div>
  );
}

export default ChatBodyEmpty;
