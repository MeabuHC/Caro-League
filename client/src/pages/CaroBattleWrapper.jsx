import { useParams } from "react-router-dom";
import CaroBattle from "../pages/CaroBattle";

function CaroBattleWrapper() {
  const { gameId } = useParams();
  return <CaroBattle key={gameId} />;
}

export default CaroBattleWrapper;
