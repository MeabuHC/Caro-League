import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd"; // Importing Spin for loading

const CaroSocketContext = createContext();

export const CaroSocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //Make connection
    socketRef.current = io("http://localhost:8000/caro", {
      withCredentials: true,
    });

    setIsLoading(false); // Set loading to false after socket is ready

    //Clean up
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Show loading spinner while connecting
  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <CaroSocketContext.Provider value={socketRef.current}>
      {children}
    </CaroSocketContext.Provider>
  );
};

export const useCaroSocket = () => {
  const context = useContext(CaroSocketContext);
  if (!context) {
    throw new Error(
      "useCaroSocket must be used within a CaroSocketContextProvider"
    );
  }
  return context;
};

export default CaroSocketContext;
