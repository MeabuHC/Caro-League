import React, { useState } from "react";
import { PlusSquareOutlined, CheckOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

function ChallengeBox({ challengeList, setChallengeList, socket }) {
  const [openChallenge, setOpenChallenge] = useState(false);
  const navigate = useNavigate();
  const timeOptions = [
    { label: "10 seconds", value: 10 },
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
  ];

  const modeOptions = [
    { label: "Basic Mode", value: 0 },
    { label: "Open Mode", value: 1 },
  ];

  const handleDeclineRequest = (challengeObj) => {
    socket.emit("decline-challenge-request", challengeObj);
    setChallengeList((prevChallengeList) => {
      if (!prevChallengeList) {
        console.log("Challenge list is empty or null.");
        return [];
      }

      console.log("Current challenge list:", prevChallengeList);

      const updatedList = prevChallengeList.filter((oldChallenge) => {
        const match = oldChallenge.sender.id === challengeObj.sender.id;
        return !match;
      });

      return updatedList;
    });
  };

  const handleDeclineAll = () => {
    setChallengeList((prevChallengeList) => {
      if (!prevChallengeList) return [];
      prevChallengeList.forEach((challenge) => {
        socket.emit("decline-challenge-request", challenge);
      });
      return [];
    });
  };

  const handleAcceptRequest = (challenge) => {
    navigate(
      `/play/online/new?action=accept-challenge&opponent=${challenge.sender.username}&time=${challenge.time}&mode=${challenge.mode}`
    );
    setOpenChallenge(!openChallenge);

    // setChallengeList((prevChallengeList) => {
    //   if (!prevChallengeList) {
    //     console.log("Challenge list is empty or null.");
    //     return [];
    //   }

    //   console.log("Current challenge list:", prevChallengeList);

    //   const updatedList = prevChallengeList.filter((oldChallenge) => {
    //     const match = oldChallenge.sender.id === challenge.sender.id;
    //     return !match;
    //   });

    //   return updatedList;
    // });
  };

  return (
    <div className="relative">
      <button
        className={`h-[44px] w-[44px] fixed right-10 bottom-10 flex items-center justify-center select-none rounded-md outline-none ${
          openChallenge ? "bg-[#4C4847] rounded-t-none" : "bg-[#262522]"
        } transition-colors duration-300 ease-in-out`}
        onClick={() => {
          setOpenChallenge(!openChallenge);
        }}
      >
        <PlusSquareOutlined className="text-[22px] text-white" />
        {!openChallenge && challengeList && challengeList.length != 0 && (
          <div className="count-challenge h-[15px] w-[15px] bg-[#E02828] absolute bottom-0 right-0 flex items-center justify-center text-xs text-white font-semibold rounded-br-md">
            {challengeList.length}
          </div>
        )}

        {openChallenge && (
          <div
            className="challenge-box w-[420px] absolute bottom-[100%] right-0 z-10 transition-all duration-300 ease-in-out cursor-default rounded-t-md rounded-bl-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="box-header h-[42px] bg-[#4C4847] border-b-2 border-[hsla(0,0%,100%,.1)] flex flex-row items-center">
              <div className="flex flex-row gap-2 ml-3 text-[#E3E1E0]">
                Incoming{" "}
                <div className="count-box w-[21px] h-[21px] bg-[#5C5B59] flex items-center justify-center rounded-md font-bold text-xs">
                  {challengeList.length}
                </div>
              </div>

              {challengeList.length > 0 && (
                <div
                  className="ml-auto mr-3 text-[#E3E1E0] font-normal text-xs cursor-pointer"
                  onClick={() => handleDeclineAll()}
                >
                  Decline all
                </div>
              )}
            </div>

            <div className="max-h-[144px] overflow-y-auto">
              {challengeList && challengeList.length > 0 ? (
                challengeList.map((challenge, index) => {
                  const selectedTimeLabel =
                    timeOptions.find((option) => option.value == challenge.time)
                      ?.label || "Select time";

                  const selectedModeLabel =
                    modeOptions.find((option) => option.value == challenge.mode)
                      ?.label || "Select mode";

                  return (
                    <div
                      key={index}
                      className="challenge-item w-full h-[72px] flex flex-row bg-[#4C4847]"
                    >
                      <img
                        src={challenge.sender.avatarUrl}
                        alt={`${challenge.sender.username}'s avatar`}
                        className="h-full w-[72px]"
                      />
                      <div className="challenge-text w-[226px] text-left flex items-center px-3 py-3">
                        <p className="text-[#E3E1E0]">
                          <span className="text-white inline font-bold">
                            {challenge.sender.username}
                          </span>{" "}
                          wants to play ({selectedTimeLabel} |{" "}
                          {selectedModeLabel})
                        </p>
                      </div>
                      <div className="buttons w-[122px] flex flex-row items-center justify-center gap-3">
                        <div
                          className="decline-request w-[40px] h-[40px] bg-[#5C5B59] hover:bg-[#2a2a28] hover:text-[#E2E2E1] rounded-lg font-caroFont text-[#BAB8B7] flex flex-row items-center justify-center cursor-pointer"
                          onClick={() => handleDeclineRequest(challenge)}
                        >
                          X
                        </div>
                        <button
                          className="accept-request w-[40px] h-[40px] bg-[#81B64C] hover:bg-[#9DCB5E] rounded-lg text-lg font-bold text-[white] flex flex-row items-center justify-center cursor-pointer"
                          onClick={() => handleAcceptRequest(challenge)}
                        >
                          <CheckOutlined />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-challenge w-full h-[72px] flex flex-row items-center justify-center bg-[#4C4847] text-[#E3E1E0]">
                  No challenge requests available yet.
                </div>
              )}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

export default ChallengeBox;
