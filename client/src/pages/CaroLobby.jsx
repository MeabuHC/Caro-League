import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useCaroSocket } from "../context/CaroSocketContext";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Games() {
  const socket = useCaroSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState(null); //For leave room
  const [playerStats, setPlayerStats] = useState(null);
  const navigate = useNavigate();
  /* Socket configuration */
  useEffect(() => {
    // Handlers
    const handleGetPlayerStats = (playerStats) => {
      console.log(playerStats);
      setPlayerStats(playerStats);
    };

    const handleWaitMatchMaking = (roomId) => {
      console.log("You are in room: " + roomId);
      setRoomId(roomId);
    };

    const handleStartMatch = (roomId) => {
      console.log("Start game at " + roomId);
      navigate("/caro/" + roomId);
    };

    // On getting player stats
    socket.on("receive-player-stats", handleGetPlayerStats);

    // On wait match
    socket.on("wait-match-making", handleWaitMatchMaking);

    // On start match
    socket.on("start-match", handleStartMatch);

    /* Emit */
    socket.emit("get-player-stats");

    // Cleanup
    return () => {
      socket.off("receive-player-stats", handleGetPlayerStats);
      socket.off("wait-match-making", handleWaitMatchMaking);
      socket.off("start-match", handleStartMatch);
    };
  }, []);

  if (!playerStats) return; //Wait loading

  /* Buttons method */
  const startQuickPlay = () => {
    setIsModalOpen(true);
    socket.emit("find-match-making");
    console.log("Start quick play");
  };

  const cancelQuickPlay = () => {
    console.log("Cancel quick play at: " + roomId);
    if (socket && roomId) {
      socket.emit("leave-room", roomId);
      setRoomId(null); //Reset current room
    }
    setIsModalOpen(false);
  };

  const progressBarPercent =
    playerStats.rankId.tier === "master"
      ? "100%"
      : (playerStats.lp / playerStats.rankId.lpThreshold) * 100 + "%";

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Rank Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-80">
        <div className="flex items-center mb-4">
          <img
            src={baseUrl + "/" + playerStats.rankId.imageUrl}
            alt="Rank Image"
            className="w-16 h-16 mr-4"
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {playerStats.rankId.tier} {playerStats.currentDivision}
            </h3>
            <span className="text-sm text-gray-500">
              Tier progress: {playerStats.lp} LP
            </span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="bg-gray-300 h-2 rounded">
          <div
            className="bg-yellow-500 h-2 rounded"
            style={{ width: progressBarPercent }}
          ></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
          onClick={startQuickPlay}
        >
          Quick Play
        </button>
        <button className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          Find Room
        </button>
      </div>

      {/* Quick Play Modal */}
      <Modal
        title="Waiting for Opponent"
        open={isModalOpen}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        closable={false}
      >
        <div className="flex flex-col items-center justify-center">
          <Spin size="large" className="mb-4" />
          <p className="text-lg">Waiting for Opponent...</p>
          <button
            className="mt-4 px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={cancelQuickPlay}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
