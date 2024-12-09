import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
const baseUrl = import.meta.env.VITE_BASE_URL;

function CaroLeaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosWithRefreshToken(
          "/api/v1/game-stats/top-10"
        );
        setData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="season-stats rounded-md overflow-hidden">
      <Link
        className="season-board-header h-[48px] bg-[#262522] flex flex-row items-center px-3 hover:text-white text-[#DFDEDE] border-b-2 border-solid border-[#3C3B39]"
        to="/leaderboard"
      >
        <span className="font-semibold">{`Leaderboard`}</span>
        <RightOutlined className="ml-auto" />
      </Link>

      <table className="w-full table-auto text-[#C1C0C0]">
        <thead className="bg-[#1F1E1C]">
          <tr>
            <th className="w-[80px]"></th>
            <th className="w-[170px] p-2 text-left">Player</th>
            <th className="w-[250px]">Rank</th>
            <th className="">LP</th>
            <th className="">Matches</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((player, index) => (
              <tr
                key={player._id}
                className="bg-[#262522] hover:bg-[#21201D] hover:cursor-pointer"
              >
                {/* Position */}
                <td>
                  <Link
                    to={`/profile/${player.userId.username}`}
                    className="flex items-center justify-center"
                  >
                    <span
                      className={`w-[40px] h-[40px] flex items-center justify-center font-semibold rounded-md ${
                        index === 0
                          ? "bg-[#f7c631] text-black"
                          : index === 1
                          ? "bg-[#BEBDB9] text-black"
                          : index === 2
                          ? "bg-[#D5A47D] text-black"
                          : "bg-inherit text-[#C0C0BF]"
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </Link>
                </td>

                {/* Player */}
                <td className="p-2">
                  <Link
                    to={`/profile/${player.userId.username}`}
                    className="flex items-center justify-start hover:text-current"
                  >
                    <img
                      src={player.userId.avatarUrl}
                      className="w-[50px] h-[50px] mr-4"
                    />
                    <span>{player.userId.username || "Unknown Player"}</span>
                  </Link>
                </td>

                {/* Rank */}
                <td>
                  <Link
                    to={`/profile/${
                      player.userId.username || player.userId._id
                    }`}
                    className="flex h-[100px] w-full items-center hover:text-current"
                  >
                    <img
                      src={baseUrl + "/" + player.rankId.imageUrl}
                      alt={player.rankId.tier}
                      className="w-[70px] h-[50px] inline-block ml-10 mr-3"
                    />
                    <span>{`${player.rankId.tier} ${player.currentDivision}`}</span>
                  </Link>
                </td>

                {/* LP */}
                <td className="text-center">
                  <Link
                    to={`/profile/${
                      player.userId.username || player.userId._id
                    }`}
                    className="hover:text-current"
                  >
                    {player.lp} LP
                  </Link>
                </td>

                {/* Matches */}
                <td className="text-center">
                  <Link
                    to={`/profile/${
                      player.userId.username || player.userId._id
                    }`}
                    className="hover:text-current"
                  >
                    {player.totalGames}
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default CaroLeaderboard;
