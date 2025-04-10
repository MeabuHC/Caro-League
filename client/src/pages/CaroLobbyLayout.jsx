import React, { useEffect, useState } from "react";
import CaroPlayerCard from "../components/caro-battle/CaroPlayerCard";
import CaroTimer from "../components/caro-battle/CaroTimer";
import CaroTableSpectator from "../components/caro-battle/CaroTableSpectator";
import { useUserContext } from "../context/UserContext";
import { Spin, message } from "antd";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

function CaroLobbyLayout() {
  const [playerStats, setPlayerStats] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(10);
  const [selectedMode, setSelectedMode] = useState(0);
  const [selectedRank, setSelectedRank] = useState("Bronze");
  const [selectedSymbol, setSelectedSymbol] = useState("X");

  const isNewGame = location.pathname === "/play/online/new";
  const isPlayWithBot = location.pathname.startsWith("/play/computer");

  function resetSelected() {
    setSelectedMode(0);
    setSelectedTime(10);
  }

  useEffect(() => {
    const fetchUserGameStats = async () => {
      try {
        const response = await axiosWithRefreshToken("/api/v1/game-stats/me");
        setPlayerStats(response.data.data);
      } catch (error) {
        message.error("Internal server error!");
        navigate("/home", {
          replace: true,
        });
        console.log(error);
      }
    };
    fetchUserGameStats();
  }, []);

  useEffect(() => {
    if (isNewGame) {
      const searchParams = new URLSearchParams(location.search);
      const timeValue = searchParams.get("time");
      const modeValue = searchParams.get("mode");

      // Validate action, time, and mode
      const isValidTime = !isNaN(timeValue) && Number(timeValue) > 0;
      const isValidMode = !isNaN(modeValue) && Number(modeValue) >= 0;

      if (!isValidTime || !isValidMode) {
        resetSelected();
        message.error("Invalid request!");
        navigate("/play/online", { replace: true });
        return;
      }

      setSelectedTime(timeValue);
      setSelectedMode(modeValue);
    }
  }, [location, navigate]);

  if (!playerStats)
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#302E2B",
        }}
      >
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ color: "#9ECC5E" }}
        />
      </div>
    );

  const isIndexRoute = location.pathname === "/play";

  return (
    <div className="bg-[#302E2B] w-full h-full max-h-full overflow-auto container grid grid-cols-[auto_auto_1fr] px-14  gap-10">
      {/* First Column */}
      <div className="caro-body flex flex-col relative h-full max-h-screen justify-between">
        <div className="player-card self-start flex flex-row w-full items-center flex-1">
          <CaroPlayerCard playerStats={playerStats} />
          {!isIndexRoute && <CaroTimer type={false} seconds={selectedTime} />}
        </div>
        <div className="caro-table self-center my-1">
          <CaroTableSpectator moveHistory={{ boardState: createBoard() }} />
        </div>
        <div className="opponent-card self-start flex flex-row w-full items-center flex-1">
          {isPlayWithBot ? (
            <CaroPlayerCard
              type="bot"
              playerStats={{ rankTier: selectedRank }}
            />
          ) : isNewGame ? (
            <CaroPlayerCard type="matchmaking" />
          ) : (
            <CaroPlayerCard type="opponent" />
          )}
          {!isIndexRoute && <CaroTimer type={false} seconds={selectedTime} />}
        </div>
      </div>

      {/* Second Column */}
      <Outlet
        context={{
          selectedTime,
          setSelectedTime,
          selectedMode,
          setSelectedMode,
          selectedRank,
          setSelectedRank,
          selectedSymbol,
          setSelectedSymbol,
        }}
      />
    </div>
  );
}

export default CaroLobbyLayout;

function createBoard() {
  const board = Array.from({ length: 15 }, () => Array(20).fill(null));
  return board;
}
