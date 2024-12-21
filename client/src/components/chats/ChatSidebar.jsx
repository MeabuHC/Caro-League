import React from "react";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import ChatConversationList from "./ChatConversationList";

function ChatSidebar({ conversationList }) {
  return (
    <div className="chat-sidebar bg-[#1F1F1F] h-full w-[367px] rounded-lg">
      {/* Header */}
      <div className="sidebar-header px-4 py-2 flex flex-row select-none">
        <p className="text-white text-2xl font-bold ">Chats</p>
        <a className="w-9 h-9 bg-[#474747] hover:bg-[#5A5A5A] active:scale-90 ml-auto rounded-full flex items-center justify-center text-[20px] text-[#E4E6EB] hover:text-[#E4E6EB] decoration-current">
          <FormOutlined />
        </a>
      </div>
      {/* Search  */}
      <div className="search-box h-[52px] w-full px-4 py-2">
        <div className="search w-full h-full rounded-2xl bg-[#3A3B3C] overflow-hidden flex flex-row">
          <div className="icon h-full w-[42px] pr-2 text-xl text-[#939394] flex items-center justify-end">
            <SearchOutlined />
          </div>
          <input
            className="bg-inherit w-full pr-6 outline-none text-[white] placeholder:text-[#939394] text-base"
            placeholder="Find on chat"
          ></input>
        </div>
      </div>
      <ChatConversationList conversationList={conversationList} />
    </div>
  );
}

export default ChatSidebar;
