import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleFilled, SendOutlined } from "@ant-design/icons";
import { message } from "antd";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import { useUserContext } from "../../context/UserContext";

function ChatMessages() {
  const { id: conversationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const { user } = useUserContext();

  useEffect(() => {
    const fetchMessagesList = async () => {
      try {
        const response = await axiosWithRefreshToken(
          `/api/v1/conversations/${conversationId}/messages`,
          "GET"
        );
        console.log(response.data.data);
        setMessages(response.data.data.messages);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        message.error("Loading messages failed!");
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesList();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim().length === 0) {
      setMessageText = "";
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
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!");
    } finally {
      setMessageText("");
    }
  };
  return (
    <>
      <div className="h-[512px] max-h-[512px] w-full flex flex-col px-3 gap-2 overflow-x-auto pb-2">
        {messages.map((message, index) => {
          const isLastInRow =
            index === messages.length - 1 ||
            messages[index + 1].senderId._id !== message.senderId._id;

          if (message.senderId._id === user._id.toString()) {
            return (
              <div className="my-message w-full flex" key={message._id}>
                <div className="text-content bg-[#7925FF] w-auto py-1 px-3 rounded-2xl ml-auto text-white text-sm font-normal max-w-[500px] break-words">
                  {message.message}
                </div>
              </div>
            );
          } else {
            return (
              <div className="friend-message w-full flex" key={message._id}>
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
                <div className="text-content bg-[#4C4C4C] w-auto py-1 px-3 rounded-2xl text-white text-sm font-normal max-w-[450px] break-words">
                  {message.message}
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Bottom */}
      <div className="chat-bottom h-[60px] py-3 w-full flex items-center mt-auto px-4">
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
