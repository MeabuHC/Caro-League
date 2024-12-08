import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import styles from "../../styles/components/CaroResultModal.module.css";
import { useNavigate } from "react-router-dom";
import CaroResultButtons from "./CaroResultButtons";
import { useCaroSocket } from "../../context/CaroSocketContext";

function CaroResultModal({
  isModalOpen,
  setIsModalOpen,
  result,
  isSpectator = false,
  gameId,
  waitingRematch,
  receiveRematch,
  setWaitingRematch,
  setReceiveRematch,
  isOpponentLeft = false,
}) {
  const { socket } = useCaroSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSpectator) {
      const handleReceiveRematch = () => {
        console.log("Receive rematch request!");
        setReceiveRematch(true);
      };

      const handleCancelRematch = () => {
        console.log("Cancel rematch request!");
        setReceiveRematch(false);
      };

      const handleNewGame = (newGameId) => {
        console.log("receive new-game" + newGameId);
        navigate("/play/game/live/" + newGameId);
      };

      const handleDeclineRematch = () => {
        console.log("Decline-rematch-request run!");
        setWaitingRematch(false);
      };

      socket.on("receive-rematch-request", handleReceiveRematch);
      socket.on("cancel-rematch-request", handleCancelRematch);
      socket.on("new-game", handleNewGame);
      socket.on("decline-rematch-request", handleDeclineRematch);

      return () => {
        socket.off("receive-rematch-request", handleReceiveRematch);
        socket.off("cancel-rematch-request", handleCancelRematch);
        socket.off("new-game", handleNewGame);
        socket.off("decline-rematch-request", handleDeclineRematch);
      };
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <div className="text-xl font-bold text-center font-roboto text-white">
            {result.type === "draw"
              ? "Draw"
              : result.type === "abort"
              ? "Game Abort"
              : result.winner + " Won"}
          </div>
          <div className="text-center font-roboto text-base">
            {result.reason}
          </div>
        </div>
      }
      open={isModalOpen}
      centered={true}
      footer={null}
      className={styles.modal}
      onCancel={handleCloseModal}
      getContainer={false}
      maskClosable={true}
      mask={false}
      focusTriggerAfterClose={false}
      wrapClassName={styles.modal_wrapper}
    >
      <div className="px-4 py-10">
        {isSpectator ? (
          <CaroResultButtons isSpectator={true} />
        ) : (
          <CaroResultButtons
            receiveRematch={receiveRematch}
            setReceiveRematch={setReceiveRematch}
            waitingRematch={waitingRematch}
            setWaitingRematch={setWaitingRematch}
            gameId={gameId}
            isOpponentLeft={isOpponentLeft}
          />
        )}
      </div>
    </Modal>
  );
}

export default CaroResultModal;
