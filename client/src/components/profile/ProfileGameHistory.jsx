import React from "react";
import {
  RightOutlined,
  MinusSquareFilled,
  PlusSquareFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function ProfileGameHistory({ profileData }) {
  const top10GameHistories = profileData.top10GameHistories;
  // const top10GameHistories = [];

  return (
    <div className="game-history w-full rounded-md overflow-hidden">
      <Link className="game-history-header h-[48px] bg-[#262522] flex flex-row items-center px-7 hover:text-white text-[#DFDEDE]">
        <span className=" font-semibold">Completed Games</span>
        <RightOutlined className="ml-auto" />
      </Link>
      <table className="w-full table-auto text-[#C1C0C0]">
        <thead className="bg-[#1F1E1C]">
          <tr>
            <th className="w-[100px]">Mode</th>
            <th className="w-[245px] p-2 text-left">Players</th>
            <th className="w-[75px]">Result</th>
            <th>Moves</th>
            <th className="w-[150px] text-right p-2 pr-6">Date</th>
            <th>Status</th>
          </tr>
        </thead>
        {top10GameHistories.length === 0 ? (
          <tbody>
            <tr className="bg-[#262522] h-[75px]">
              <td colSpan={6} className="text-center">
                No game records available
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {top10GameHistories.map((element) => {
              const playerX = element.players.find(
                (player) => player.symbol === "X"
              );
              const playerO = element.players.find(
                (player) => player.symbol === "O"
              );
              const isXWinner =
                element.result.type === "win" ||
                element.result.type === "timeout"
                  ? playerX.userId.username === element.result.winner
                  : null;

              const isUserWinner =
                element.result.type === "win" ||
                element.result.type === "timeout"
                  ? profileData.userId.username === element.result.winner
                  : null;

              const lpChange = element.lpChanges[profileData.userId._id];

              return (
                <tr
                  className="bg-[#262522] h-[75px] hover:bg-[#21201D] hover:cursor-pointer"
                  key={element._id}
                >
                  {/* Mode */}
                  <td className="h-[75px] p-0 select-none">
                    <Link
                      className="w-full h-full flex items-center justify-center text-center hover:text-current"
                      to={`/caro/game/live/${element.gameId}`}
                    >
                      {element.mode === 0 ? "Basic" : "Open"}
                    </Link>
                  </td>
                  {/* Players */}
                  <td className="h-[75px]">
                    <div className="w-full h-full text-center flex flex-row items-center hover:text-current relative">
                      <Link
                        to={`/caro/game/live/${element.gameId}`}
                        className="absolute top-0 left-0 w-full h-full z-[1]"
                      />
                      <div className="game-players h-[34px] flex flex-col items-start z-[2]">
                        <div className="player-tagline">
                          <span className="player-symbol mr-2 font-caroFont text-blue-600">
                            X
                          </span>
                          <Link
                            className="player-username hover:text-[#DEDEDD] mr-1"
                            to={`/profile/${playerX.userId.username}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {playerX.userId.username}
                          </Link>
                          <span className="player-tier text-[#90908E]">
                            (
                            {playerX.rankId.tier +
                              " " +
                              playerX.currentDivision}
                            )
                          </span>
                        </div>
                        <div className="player-tagline">
                          <span className="player-symbol mr-2 font-caroFont text-red-600">
                            O
                          </span>
                          <Link
                            className="player-username hover:text-[#DEDEDD] mr-1"
                            to={`/profile/${playerO.userId.username}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {playerO.userId.username}
                          </Link>
                          <span className="player-tier text-[#90908E]">
                            (
                            {playerO.rankId.tier +
                              " " +
                              playerO.currentDivision}
                            )
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Result */}
                  <td className="h-[75px]">
                    <Link
                      className="w-full h-full text-center flex flex-row items-center hover:text-current"
                      to={`/caro/game/live/${element.gameId}`}
                    >
                      <div className="w-full h-full flex flex-row items-center justify-center">
                        {isXWinner != null ? (
                          <>
                            <div className="player-scores mr-2">
                              <div className="player-score">
                                {isXWinner ? 1 : 0}
                              </div>
                              <div className="player-score">
                                {isXWinner ? 0 : 1}
                              </div>
                            </div>
                            <span>
                              {isUserWinner ? (
                                <PlusSquareFilled style={{ color: "green" }} />
                              ) : (
                                <MinusSquareFilled style={{ color: "red" }} />
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="player-scores mr-2">
                              <div className="player-score">1</div>
                              <div className="player-score">1</div>
                            </div>
                            <span>
                              <div className="w-[12.5px] h-[12.5px] bg-[#C1C0C0] flex items-center justify-center">
                                <span className="text-black text-[10px]">
                                  =
                                </span>
                              </div>
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  </td>
                  {/* Moves */}
                  <td className="h-[75px]">
                    <Link
                      className="w-full h-full flex items-center justify-center text-center hover:text-current"
                      to={`/caro/game/live/${element.gameId}`}
                    >
                      {element.totalMoves}
                    </Link>
                  </td>
                  {/* Date */}
                  <td className="h-[75px]">
                    <Link
                      className="w-full h-full flex items-center justify-end text-center hover:text-current pr-6"
                      to={`/caro/game/live/${element.gameId}`}
                    >
                      {formatDate(element.createdAt)}
                    </Link>
                  </td>
                  {/* Status */}
                  <td className="h-[75px]">
                    <Link
                      className="w-full h-full flex flex-col items-center justify-center text-center hover:text-current"
                      to={`/caro/game/live/${element.gameId}`}
                    >
                      {isUserWinner != null && isUserWinner ? (
                        <>
                          <div className="lp-change text-sm font-bold text-green-600">
                            +{lpChange.win} LP
                          </div>
                        </>
                      ) : (
                        <div className="lp-change text-sm font-bold text-red-600">
                          {lpChange.lose} LP
                        </div>
                      )}
                      {isUserWinner === null && (
                        <>
                          <div className="lp-change text-sm font-bold text-[#C1C0C0]">
                            {lpChange.draw >= 0 && "+"}
                            {lpChange.draw} LP
                          </div>
                        </>
                      )}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default ProfileGameHistory;

function formatDate(dateString) {
  const date = new Date(dateString); // Convert input string to Date object

  const options = {
    year: "numeric", // Full year
    month: "short", // Short month (e.g., Jan, Feb, Mar)
    day: "numeric", // Numeric day (e.g., 1, 15)
  };

  const formattedDate = date.toLocaleDateString("en-US", options); // Format date
  return formattedDate;
}
