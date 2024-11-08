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
import axios from "axios";

const CaroSocketContext = createContext();
const baseUrl = import.meta.env.VITE_BASE_URL;

export const CaroSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Attempt to refresh the token
        await axios.post(
          `${baseUrl}/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Now create the socket connection
        socketRef.current = io("http://localhost:8000/caro", {
          withCredentials: true,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to refresh token or connect socket:", error);
      }
    };

    initializeConnection();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
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
