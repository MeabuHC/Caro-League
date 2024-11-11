import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useCaroSocket } from "../context/CaroSocketContext";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Games() {
  const { socket, initializeConnection, disconnectSocket } = useCaroSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameId, setGameId] = useState(null); //For leave game
  const [playerStats, setPlayerStats] = useState(null);
  const [matchMaking, setMatchMaking] = useState(false);
  const navigate = useNavigate();

  /* Socket configuration */
  useEffect(() => {
    setPlayerStats({
      _id: "6728dd5a8ccd5cfb65f6dcfd",
      userId: {
        _id: "67112be6d170d40b77e2b600",
        username: "Meabu",
        email: "congminh23092004@gmail.com",
        avatarUrl:
          "https://res.cloudinary.com/dfa4flhk3/image/upload/v1730947678/avatars/ep8kzyjuzvcvaof36jyu.jpg",
        role: "player",
        createdAt: "2024-10-17T15:23:18.831Z",
        passwordChangedAt: "2024-10-28T07:44:30.886Z",
      },
      seasonId: {
        _id: "670f30e72fdaab7bd6c6c242",
        name: "S2-2024",
        startDate: "2024-06-30T17:00:00.000Z",
        endDate: "2024-12-30T17:00:00.000Z",
        active: true,
      },
      rankId: {
        _id: "67190d9b7d9cfb73241731e4",
        tier: "Master",
        divisions: [],
        lpThreshold: 0,
        imageUrl: "/img/ranks/master.png",
        nextRankTier: null,
        previousRankTier: "Diamond",
        __v: 0,
      },
      totalGames: 152,
      wins: 91,
      losses: 53,
      draws: 0,
      lp: 110,
      createdAt: "2024-11-04T14:42:34.557Z",
      currentDivision: "IV",
    });

    if (socket) {
      console.log("Socket is available");
      const handleWaitMatchMaking = (gameId) => {
        console.log("You are in game: " + gameId);
        setGameId(gameId);
      };

      const handleNavigateGame = (gameId) => {
        console.log("Navigate to: " + gameId);
        navigate("/caro/game/" + gameId);
      };

      socket.on("wait-match-making", handleWaitMatchMaking);
      socket.on("navigate-game", handleNavigateGame);

      socket.emit("get-player-stats");

      return () => {
        socket.off("wait-match-making", handleWaitMatchMaking);
        socket.off("navigate-game", handleNavigateGame);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (matchMaking && socket) {
      setIsModalOpen(true);
      socket.emit("find-match-making");
      console.log("Start quick play");
    }
  }, [matchMaking, socket]);

  if (!playerStats) return null;

  /* Buttons method */
  const startQuickPlay = () => {
    setMatchMaking(true);
    initializeConnection();
  };

  const cancelQuickPlay = () => {
    console.log("Cancel quick play at: " + gameId);
    if (socket && gameId) {
      socket.emit("leave-match-making", gameId);
      setGameId(null);
    }
    setIsModalOpen(false);
    disconnectSocket(); // Disconnect after canceling
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
              {playerStats.rankId.tier}{" "}
              {playerStats.rankId.tier != "Master" &&
                playerStats.currentDivision}
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
          Find Game
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
