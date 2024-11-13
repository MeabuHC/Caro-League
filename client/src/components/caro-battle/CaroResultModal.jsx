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
  gameId,
  waitingRematch,
  receiveRematch,
  setWaitingRematch,
  setReceiveRematch,
}) {
  const { socket } = useCaroSocket();

  console.log(receiveRematch);
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
      navigate("/caro/game/live/" + newGameId);
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
      getContainer={false}
      maskClosable={true}
      mask={false}
      focusTriggerAfterClose={false}
      wrapClassName={styles.modal_wrapper}
    >
      <div className="px-4 py-10">
        <CaroResultButtons
          receiveRematch={receiveRematch}
          setReceiveRematch={setReceiveRematch}
          waitingRematch={waitingRematch}
          setWaitingRematch={setWaitingRematch}
          gameId={gameId}
        />
      </div>
    </Modal>
  );
}

export default CaroResultModal;
