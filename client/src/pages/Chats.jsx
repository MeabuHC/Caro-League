import React from "react";
import { FormOutlined } from "@ant-design/icons";

export default function Chats() {
  return (
    <>
      <div className="h-full bg-[#312E2B] flex items-center justify-center relative p-3">
        <div className="content flex flex-row w-full h-full">
          <div className="chat-sidebar bg-[#1F1F1F] h-full w-[367px] rounded-lg">
            <div className="sidebar-header px-4 py-2 flex flex-row">
              <p className="text-white text-2xl font-bold ">Chats</p>
              <a className="w-9 h-9 bg-[#474747] ml-auto rounded-full flex items-center justify-center text-[20px] text-[#E4E6EB] hover:text-[#E4E6EB]">
                <FormOutlined />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
