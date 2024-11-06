import React from "react";
import { Modal } from "antd";
import styles from "../../styles/components/CaroResultModal.module.css";
import { useNavigate } from "react-router-dom";

function CaroResultModal({ isModalOpen, setIsModalOpen, result }) {
  const navigate = useNavigate();
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleBackToLobby = () => {
    navigate("/caro");
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
      onCancel={handleCancel}
    >
      <div className="flex flex-row gap-2 px-4 py-10">
        <button className="flex-1 " onClick={handleBackToLobby}>
          Back to lobby
        </button>
        <button className="flex-1"> Rematch</button>
      </div>
    </Modal>
  );
}

export default CaroResultModal;
