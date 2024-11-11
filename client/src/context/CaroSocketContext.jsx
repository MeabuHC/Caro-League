import React, { createContext, useContext, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Spin } from "antd"; // Importing Spin for loading
import axios from "axios";

const CaroSocketContext = createContext();
const baseUrl = import.meta.env.VITE_BASE_URL;

export const CaroSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const initializeConnection = async () => {
    try {
      // Attempt to refresh the token
      await axios.post(
        `${baseUrl}/refresh-token`,
        {},
        { withCredentials: true }
      );

      // Now create the socket connection
      const socketConnection = io("http://localhost:8000/caro", {
        withCredentials: true,
      });

      // Set the socket connection in the state
      setSocket(socketConnection);
    } catch (error) {
      console.error("Failed to refresh token or connect socket:", error);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <CaroSocketContext.Provider
      value={{
        socket,
        initializeConnection,
        disconnectSocket,
      }}
    >
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
