import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PlusCircleFilled,
  SendOutlined,
  LoadingOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Spin, Tooltip, message } from "antd";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import { useUserContext } from "../../context/UserContext";
import { format, isToday, differenceInMinutes } from "date-fns";

import delay from "../../utils/delay";

function ChatMessages() {
  const { id: conversationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const { user, socket: userSocket } = useUserContext();
  const [page, setPage] = useState(1);
  const [showBackToBottom, setShowBackToBottom] = useState(false);

  const messagesEndRef = useRef(null);

  const handleScrollBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  const handleScrollMessage = () => {
    // console.log("scrollTop:", messagesEndRef.current.scrollTop);
    // console.log("scrollHeight:", messagesEndRef.current.scrollHeight);
    // console.log("clientHeight:", messagesEndRef.current.clientHeight);
    if (-messagesEndRef.current.scrollTop > 80) {
      setShowBackToBottom(true);
    } else {
      setShowBackToBottom(false);
    }
    if (
      -messagesEndRef.current.scrollTop ===
      messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight
    ) {
      fetchMessagesList(page);
    }
  };

  // Scroll to bottom only when its near or the newest message is yours
  // useEffect(() => {
  //   if (
  //     messagesEndRef.current &&
  //     -messagesEndRef.current.scrollTop <= 200 && // Check if near the bottom
  //     -messagesEndRef.current.scrollTop > 0 // Ensure scroll is not at the very top
  //   ) {
  //     handleScrollBottom();
  //   }
  // }, [messages]);

  // Load chat
  const fetchMessagesList = async (page = 1) => {
    try {
      const response = await axiosWithRefreshToken(
        `/api/v1/conversations/${conversationId}/messages?page=${page}`,
        "GET"
      );
      console.log(response.data.data);

      if (response.data.data.messages.length != 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.data.messages,
        ]);

        setPage((n) => n + 1);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      message.error("Loading messages failed!");
    } finally {
      setLoading(false);
    }
  };

  //Initial chat
  useEffect(() => {
    fetchMessagesList(page);
  }, []);

  useEffect(() => {
    if (userSocket) {
      const handleReceiveMessage = async (message, conversationId2) => {
        console.log(message);
        if (conversationId === conversationId2) {
          setMessages((prevMessages) => [message, ...prevMessages]);
        }
        if (message?.senderId._id.toString() === user._id.toString()) {
          await delay(0);
          handleScrollBottom();
        }
      };

      userSocket.on("receive-message", handleReceiveMessage);

      return () => {
        userSocket.off("receive-message", handleReceiveMessage);
      };
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim().length === 0) {
      setMessageText("");
      return;
    }

    try {
      const response = await axiosWithRefreshToken(
        `/api/v1/conversations/${conversationId}/messages`,
        "POST",
        {
          message: messageText,
        }
      );
      console.log(response);

      //Emit messages
      userSocket.emit("send-message", response.data.data, conversationId);
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!");
    } finally {
      setMessageText("");
    }
  };
  return (
    <>
      {loading ? (
        <div className="h-[512px] max-h-[512px] w-full flex items-center justify-center">
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            style={{ color: "#9ECC5E" }}
          />
        </div>
      ) : (
        <div
          className="h-[512px] max-h-[512px] w-full flex flex-col-reverse px-3 gap-2 overflow-y-auto pb-5 scroll-smooth relative"
          ref={messagesEndRef}
          onScroll={handleScrollMessage}
        >
          {messages.map((message, index) => {
            const isLastInRow =
              index === messages.length - 1 ||
              messages[index + 1].senderId._id !== message.senderId._id;

            const showTimestampDivider =
              index === messages.length - 1 || // Show for the first message
              differenceInMinutes(
                new Date(message.createdAt),
                new Date(messages[index + 1].createdAt)
              ) > 15;

            if (message.senderId._id === user._id.toString()) {
              return (
                <div key={message?._id}>
                  {showTimestampDivider && (
                    <div className="w-full text-center text-gray-500 text-xs my-2">
                      {format(
                        new Date(message.createdAt),
                        "MMMM d, yyyy HH:mm"
                      )}
                    </div>
                  )}
                  <div className="my-message w-full flex" key={message?._id}>
                    <Tooltip
                      title={formatMessageTime(message.createdAt)}
                      placement="left"
                    >
                      <div className="text-content bg-[#7925FF] w-auto py-1 px-3 rounded-2xl ml-auto text-white text-sm font-normal max-w-[500px] break-words">
                        {message.message}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={message?._id}>
                  {showTimestampDivider && (
                    <div className="w-full text-center text-gray-500 text-xs my-2">
                      {format(
                        new Date(message.createdAt),
                        "MMMM d, yyyy HH:mm"
                      )}
                    </div>
                  )}
                  <div className="friend-message-content w-full flex">
                    {/* Invisible block to reserve space for the avatar */}
                    {!isLastInRow && (
                      <div
                        className="w-[28px] h-[28px] mr-3"
                        style={{ visibility: "hidden" }}
                      ></div>
                    )}
                    {isLastInRow && (
                      <img
                        className="w-[28px] h-[28px] rounded-full mr-3"
                        src={message.senderId.avatarUrl}
                        alt="avatar"
                      />
                    )}
                    <Tooltip
                      title={formatMessageTime(message.createdAt)}
                      placement="right"
                    >
                      <div className="text-content bg-[#4C4C4C] w-auto py-1 px-3 rounded-2xl text-white text-sm font-normal max-w-[450px] break-words">
                        {message.message}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
      {/* Bottom */}
      <div className="chat-bottom h-[60px] py-3 w-full flex items-center mt-auto px-4 relative">
        <div
          className={`absolute w-[40px] h-[40px] left-1/2 -translate-x-1/2 rounded-full bg-[#4B4C4F] hover:bg-[#6B6C6F] text-[#4E4BF5] flex items-center justify-center text-lg cursor-pointer z-10 transition-all duration-300 ${
            showBackToBottom
              ? "bottom-[5rem] opacity-100 pointer-events-auto"
              : "bottom-[3rem] opacity-0 pointer-events-none"
          } `}
          onClick={handleScrollBottom}
        >
          <ArrowDownOutlined />
        </div>

        {/* Plus Icon */}
        <div className="text-[#2E97FF] text-[20px] h-[36px] w-[36px] rounded-full hover:bg-[#363636] flex items-center justify-center cursor-pointer mr-3">
          <PlusCircleFilled />
        </div>

        {/* Chat Input */}
        <form
          className="flex flex-row h-full w-full"
          onSubmit={handleSendMessage}
        >
          <div className="chat-input flex-1 h-full rounded-2xl bg-[#3A3B3C] overflow-hidden">
            <input
              className="w-full h-full bg-inherit outline-none px-3 text-[#E4E6EB] text-base"
              placeholder="Aa"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
              }}
            />
          </div>

          {/* Send Icon */}
          <button className="text-[#2E97FF] text-[20px] h-[36px] w-[36px] rounded-full hover:bg-[#363636] flex items-center justify-center cursor-pointer ml-3">
            <SendOutlined />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatMessages;

const formatMessageTime = (createdAt) => {
  const date = new Date(createdAt);

  if (isToday(date)) {
    return format(date, "HH:mm"); // Time in 24-hour format (e.g., 10:46, 23:59)
  }

  return format(date, "EEEE HH:mm"); // Day of the week + time (e.g., Monday 23:59)
};
