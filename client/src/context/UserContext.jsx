import React, { createContext, useState, useEffect, useContext } from "react";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import delay from "../utils/delay";
import { Spin } from "antd";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axiosWithRefreshToken(`/api/v1/users/me`);
      // console.log(response.data.data.user);
      setUser(response.data.data.user);
      setRefetch(false); // Reset refetch after fetching
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      await delay(1000); // Visual
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refetch) fetchUserData();
  }, [refetch]);

  // Loading screen
  if (loading) {
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
    <UserContext.Provider value={{ user, setUser, setRefetch }}>
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
