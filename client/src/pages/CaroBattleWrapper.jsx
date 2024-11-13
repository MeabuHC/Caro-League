import { useParams } from "react-router-dom";
import CaroBattle from "../pages/CaroBattle";
import CaroBattleHistory from "../pages/CaroBattleHistory";
import ProtectedRoute from "../components/ProtectedRoute";
import axios from "axios";
import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;

function CaroBattleWrapper() {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [isHistory, setIsHistory] = useState(null); // Initialize as null for loading state

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/games/${gameId}`);
        if (response.data.data) {
          setGameData(response.data.data);
          setIsHistory(true);
        } else {
          setIsHistory(false);
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
        setIsHistory(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  if (isHistory === null) {
    return;
  }

  return isHistory ? (
    <CaroBattleHistory key={gameId} gameData={gameData} />
  ) : (
    <ProtectedRoute>
      <CaroBattle key={gameId} />
    </ProtectedRoute>
  );
}

export default CaroBattleWrapper;
