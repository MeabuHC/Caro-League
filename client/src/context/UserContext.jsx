import React, { createContext, useState, useEffect, useContext } from "react";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import delay from "../utils/delay";
import { Spin } from "antd";
import { io } from "socket.io-client";
import { LoadingOutlined } from "@ant-design/icons";
import LoadingSpin from "../components/LoadingSpin";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const [socket, setSocket] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axiosWithRefreshToken(
        `/api/v1/users/me`,
        "GET",
        null,
        {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        }
      );
      // console.log(response.data.data.user);
      setUser(response.data.data.user);
      //Establish socket
      if (!socket) {
        // Now create the socket connection
        const socketConnection = io("http://localhost:8000/app", {
          withCredentials: true,
        });
        setSocket(socketConnection);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      await delay(1500); // Visual
      setLoading(false);
      setRefetch(false);
    }
  };

  useEffect(() => {
    if (refetch) fetchUserData();
  }, [refetch]);

  // Loading screen
  if (loading || refetch) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#302E2B",
        }}
      >
        <LoadingSpin />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, setRefetch, socket, setSocket }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}
