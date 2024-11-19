import React from "react";
import styles from "../../styles/components/CaroChat.module.css";
import CaroStartGameMessage from "./CaroStartGameMessage";

function CaroChat({ gameObject }) {
  return (
    <div
      className={`max-h-[200px] h-[200px] flex flex-col`}
      style={{
        backgroundColor: "#262522",
        color: "#C3C2C1",
      }}
    >
      <div className={`flex-1 max-h-[165px] mx-[15px] overflow-y-auto`}>
        <CaroStartGameMessage gameObject={gameObject} />
      </div>
      <input
        placeholder="Send a message..."
        className="h-[35px] w-full px-3 outline-none self-end"
        style={{
          backgroundColor: "#262522",
          color: "#C3C2C1",
          borderTop: "1px solid #3C3B39",
        }}
      />
    </div>
  );
}

export default CaroChat;
