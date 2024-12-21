import React, { useEffect, useState } from "react";

import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";

function FriendList() {
  const [loading, setLoading] = useState(false);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosWithRefreshToken(
          `/api/v1/users/me/friends`,
          "get",
          null,
          {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          }
        );

        setFriendList(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="friend-list bg-[#262522] h-[500px] max-h-[500px] col-start-1 row-start-2 rounded-lg px-5 pt-5">
      {/* Search */}
      <div className="search-input rounded-md overflow-hidden h-[48px] relative">
        <SearchOutlined className="absolute text-[#9E9D9C] text-2xl mt-0 translate-y-1/2 left-3" />

        <input
          className="w-full h-full bg-[#3C3B39] outline-none text-[#E2E2E1] pl-14 placeholder:text-[#9E9D9C] placeholder:font-semibold"
          placeholder="Search by username"
          maxLength={10}
          minLength={3}
        />
      </div>
      {/* Number of friends */}
      <div className="friend-numbers w-full mt-5">
        <span className="text-[#DFDEDE] font-semibold text-lg">Friends</span>
        <span className="inline-block bg-[#3C3B39] text-[#C9C8C8] rounded-md text-center select-none py-[0.1rem] px-[0.4rem] ml-2">
          {friendList.length}
        </span>
      </div>

      {/* List */}
      <div className="list mt-5 h-[340px] max-h-[340px] overflow-y-auto">
        {friendList.map((friend) => {
          return (
            <div
              className="friend-item h-[88px] w-full flex items-center mb-5"
              key={friend._id}
            >
              <img src={friend.avatarUrl} className="h-full w-[88px] mr-5" />
              <Link
                to={`/profile/${friend.username}`}
                className="text-[#B9C2C1] hover:text-[#C3C2C1] font-semibold"
              >
                {friend.username}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FriendList;
