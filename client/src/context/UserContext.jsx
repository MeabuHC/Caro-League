import React, { createContext, useState, useEffect, useContext } from "react";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import delay from "../utils/delay";
import { message } from "antd";
import { io } from "socket.io-client";
import LoadingSpin from "../components/LoadingSpin";
import ChallengeBox from "../components/ChallengeBox";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const [socket, setSocket] = useState(null);
  const [challengeList, setChallengeList] = useState([]);

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

        socketConnection.on("connect", () => {
          socketConnection.on("receive-challenge-request", (request) => {
            console.log("Receive challenge request!");
            console.log(request);

            setChallengeList((prevChallengeList) => {
              const updatedList = prevChallengeList
                ? [...prevChallengeList]
                : [];
              updatedList.push(request);
              return updatedList;
            });
          });

          socketConnection.on("challenge-canceled", (challengeObj) => {
            console.log("Challenge canceled!");

            setChallengeList((prevChallengeList) => {
              if (!prevChallengeList) {
                return [];
              }

              const updatedList = prevChallengeList.filter((oldChallenge) => {
                const match = oldChallenge.sender.id === challengeObj.sender.id;
                return !match;
              });

              return updatedList;
            });
          });

          socketConnection.on("lmao", () => {
            console.log("lmaooooooooooooooooooooooo");
          });
        });

        setSocket(socketConnection);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.message === "Network Error") message.error("Network Error!");
    } finally {
      await delay(1500); // Visual
      setLoading(false);
      setRefetch(false);
    }
  };

  const fetchChallenge = async () => {
    try {
      const response = await axiosWithRefreshToken(
        `/api/v1/users/me/challenges`,
        "GET",
        null,
        {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        }
      );

      // Parse each element in the array
      const challengeListArray = response.data.data.map((item) =>
        JSON.parse(item)
      );

      console.log(challengeListArray);
      setChallengeList(challengeListArray);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.message === "Network Error") message.error("Network Error!");
    }
  };

  useEffect(() => {
    if (refetch) {
      fetchUserData();
      fetchChallenge();
    }
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

      {/* Challenge Box */}
      {user && (
        <ChallengeBox
          challengeList={challengeList}
          setChallengeList={setChallengeList}
          socket={socket}
        />
      )}
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
