import React from "react";
import {
  CheckOutlined,
  CloseOutlined,
  StarFilled,
  ReloadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import styles from "../../styles/components/CaroResultButtons.module.css";
import { useCaroSocket } from "../../context/CaroSocketContext";
import { useNavigate } from "react-router-dom";

function CaroResultButtons({
  isSpectator = false,
  receiveRematch = false,
  setReceiveRematch = () => {},
  waitingRematch = false,
  setWaitingRematch = () => {},
  gameId = null,
  icon = false,
}) {
  const { socket } = useCaroSocket();
  const navigate = useNavigate();

  const handleBackToLobby = () => {
    navigate("/caro");
    if (waitingRematch) socket.emit("cancel-rematch-request", gameId);
    if (receiveRematch) socket.emit("decline-rematch");
  };

  const handleSendRematch = () => {
    socket.emit("send-rematch-request", gameId);
    setWaitingRematch(true);
  };

  const handleCancelRematch = () => {
    socket.emit("cancel-rematch-request", gameId);
    setWaitingRematch(false);
  };

  const handleDeclineRematch = () => {
    socket.emit("decline-rematch-request", gameId);
    setReceiveRematch(false);
  };

  const handleAcceptRematch = () => {
    socket.emit("accept-rematch-request", gameId);
  };

  const renderSpectatorButtons = () => (
    <div className="flex flex-row gap-2 mt-3 w-full">
      <button className="flex-1 max-h-[36px]" onClick={handleBackToLobby}>
        {icon && <HomeOutlined />} Back to lobby
      </button>
    </div>
  );

  const renderPlayerButtons = () => (
    <div className="flex flex-row gap-2 mt-3">
      <button className="flex-1 max-h-[36px]" onClick={handleBackToLobby}>
        {icon && <HomeOutlined />} Back to lobby
      </button>
      {!waitingRematch ? (
        <button className="flex-1 max-h-[36px]" onClick={handleSendRematch}>
          {icon && <ReloadOutlined />} Rematch
        </button>
      ) : (
        <button className="flex-1 max-h-[36px]" onClick={handleCancelRematch}>
          {icon && <CloseOutlined />} Cancel
        </button>
      )}
    </div>
  );

  const renderRematchRequest = () => (
    <div className="flex flex-col gap-2 mt-2 items-center">
      <h1>Good game! Rematch?</h1>
      <div className="flex flex-row gap-2 w-full">
        <button
          className="flex-1 flex flex-row justify-center items-center gap-2 max-h-[36px]"
          onClick={handleDeclineRematch}
        >
          <CloseOutlined /> Decline
        </button>
        <button
          className="flex-1 flex flex-row justify-center items-center gap-2 max-h-[36px]"
          onClick={handleAcceptRematch}
        >
          <CheckOutlined /> Accept
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${styles.result_buttons} flex flex-col px-4 py-4`}>
      <button className={`${styles.btn_review} h-10 w-full rounded-md`}>
        <StarFilled /> Game Review
      </button>

      {isSpectator ? (
        renderSpectatorButtons()
      ) : (
        <>{receiveRematch ? renderRematchRequest() : renderPlayerButtons()}</>
      )}
    </div>
  );
}

export default CaroResultButtons;
