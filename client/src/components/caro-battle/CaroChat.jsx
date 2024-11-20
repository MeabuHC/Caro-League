import React, { useState, useEffect, useRef } from "react";
import { SendOutlined } from "@ant-design/icons";
import CaroGameMessages from "./CaroGameMessages";
import { useCaroSocket } from "../../context/CaroSocketContext";

function CaroChat({ gameObject }) {
  const { socket } = useCaroSocket();
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [gameObject.messages]); // Trigger when messages change

  return (
    <div
      className={`max-h-[200px] h-[200px] flex flex-col`}
      style={{
        backgroundColor: "#262522",
        color: "#C3C2C1",
      }}
    >
      <div
        ref={containerRef}
        className={`flex-1 max-h-[165px] mx-[15px] pr-28 overflow-y-auto`}
      >
        <CaroGameMessages gameObject={gameObject} />
      </div>

      <form
        className="chat-input flex flex-row"
        style={{
          backgroundColor: "#262522",
          color: "#C3C2C1",
          borderTop: "1px solid #3C3B39",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          socket.emit("send-message", gameObject.id, message);
          setMessage("");
        }}
      >
        <input
          placeholder="Send a message..."
          className="h-[35px] flex-1 px-3 outline-none self-end"
          style={{ backgroundColor: "#262522" }}
          maxLength={100}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="send-icon w-8 h-full flex items-center justify-center hover:text-white transition-colors">
          <button className="w-full h-full">
            <SendOutlined />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CaroChat;
