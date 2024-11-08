import { useParams } from "react-router-dom";
import CaroBattle from "../pages/CaroBattle";

function CaroBattleWrapper() {
  const { roomId } = useParams();
  return <CaroBattle key={roomId} />;
}

export default CaroBattleWrapper;
