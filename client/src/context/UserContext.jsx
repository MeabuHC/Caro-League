import React, { createContext, useState, useEffect, useContext } from "react";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import delay from "../utils/delay";
import { Spin, message, notification } from "antd";
import { io } from "socket.io-client";
import { LoadingOutlined } from "@ant-design/icons";
import LoadingSpin from "../components/LoadingSpin";
import { PlusSquareOutlined, CheckOutlined } from "@ant-design/icons";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const [socket, setSocket] = useState(null);
  const [challengeRequest, setChallengeRequest] = useState(null);
  const [openChallenge, setOpenChallenge] = useState(false);

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
          });

          socketConnection.on("challenge-canceled", (challengeObj) => {
            console.log("Challenge canceled!");
            console.log(challengeObj);
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

      {user && (
        <div className="relative">
          <button
            className={`h-[44px] w-[44px] fixed right-10 bottom-10 flex items-center justify-center select-none rounded-md ${
              openChallenge ? "bg-[#4C4847] rounded-t-none" : "bg-[#262522]"
            } transition-colors duration-300 ease-in-out`}
            onClick={() => {
              setOpenChallenge(!openChallenge);
            }}
          >
            <PlusSquareOutlined className="text-[22px] text-white" />
            {!openChallenge && (
              <div className="count-challenge h-[15px] w-[15px] bg-[#E02828] absolute bottom-0 right-0 flex items-center justify-center text-xs text-white font-semibold rounded-br-md">
                1
              </div>
            )}

            {openChallenge && (
              <div
                className="challenge-box w-[420px] max-h-[144px] absolute bottom-[100%] right-0 z-10 transition-all duration-300 ease-in-out cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="challenge-item w-full h-[72px] flex flex-row bg-[#4C4847]">
                  <img
                    src="https://res.cloudinary.com/dfa4flhk3/image/upload/v1731655958/avatars/tzywao7dpiyjkjphico8.jpg"
                    className="h-full w-[72px]"
                  />
                  <div className="challenge-text w-[226px] text-left flex items-center px-3 py-3">
                    <p className="text-[#E3E1E0]">
                      <span className="text-white inline font-bold">
                        Meabuuuuuu
                      </span>{" "}
                      wants to play (30 seconds | Basic Mode)
                    </p>
                  </div>
                  <div className="buttons w-[122px] flex flex-row items-center justify-center gap-3">
                    <button className="decline-request w-[40px] h-[40px] bg-[#5C5B59] rounded-lg font-caroFont text-[#BAB8B7]">
                      X
                    </button>
                    <button className="decline-request w-[40px] h-[40px] bg-[#5C5B59] rounded-lg text-lg font-bold text-[#BAB8B7]">
                      <CheckOutlined />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>
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
