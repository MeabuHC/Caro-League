import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import styles from "../../styles/components/CaroResultModal.module.css";
import { useNavigate } from "react-router-dom";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function CaroResultModal({
  isModalOpen,
  setIsModalOpen,
  result,
  socket,
  gameId,
}) {
  const [waitingRematch, setWaitingRematch] = useState(false);
  const [receiveRematch, setReceiveRematch] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    //On receiving rematch request
    socket.on("receive-rematch-request", () => {
      console.log("Receive rematch request!");
      setReceiveRematch(true);
    });

    //Requester cancel the rematch request
    socket.on("cancel-rematch-request", () => {
      console.log("Cancel rematch request!");
      setReceiveRematch(false);
    });

    //Accept
    socket.on("new-game", (newGameId) => {
      console.log("receive new-game" + newGameId);
      navigate("/caro/" + newGameId);
    });

    //Opponent decline rematch request
    socket.on("decline-rematch-request", () => {
      console.log("Decline-rematch-request run!");
      setWaitingRematch(false);
    });
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <div className="text-xl font-bold text-center font-roboto text-white">
            {result.type === "draw" ? "Draw" : result.winner + " Won"}
          </div>
          <div className="text-center font-roboto text-base">
            by {result.reason}
          </div>
        </div>
      }
      open={isModalOpen}
      centered={true}
      footer={null}
      className={styles.modal}
      onCancel={handleCloseModal}
    >
      {!receiveRematch ? (
        <div className="flex flex-row gap-2 px-4 py-10">
          <button className="flex-1 " onClick={handleBackToLobby}>
            Back to lobby
          </button>
          {!waitingRematch && (
            <button className="flex-1" onClick={handleSendRematch}>
              Rematch
            </button>
          )}
          {waitingRematch && (
            <button className="flex-1" onClick={handleCancelRematch}>
              Cancel
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-4 py-10 items-center">
          <h1>Good game! Rematch?</h1>
          <div className="flex flex-row gap-2 w-full">
            <button
              className="flex-1 flex flex-row justify-center items-center gap-2"
              onClick={handleDeclineRematch}
            >
              <CloseOutlined /> Decline
            </button>
            <button
              className="flex-1 flex flex-row justify-center items-center gap-2"
              onClick={handleAcceptRematch}
            >
              <CheckOutlined /> Accept
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CaroResultModal;
