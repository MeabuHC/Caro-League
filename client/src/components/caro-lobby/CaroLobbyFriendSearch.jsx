import { useUserContext } from "../../context/UserContext";
import { Spin, message } from "antd";
import axiosWithRefreshToken from "../../utils/axiosWithRefreshToken";
import challengelink from "../../assets/svg/challengelink.svg";
import facebook from "../../assets/svg/facebook.svg";
import invite from "../../assets/svg/invite.svg";
import {
  SearchOutlined,
  CopyOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function CaroLobbyFriendSearch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosWithRefreshToken(
          "/api/v1/users/me/online-friends",
          "get",
          null,
          {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (data) {
    var searchData = data.filter((element) =>
      element.friend.username
        .toLowerCase()
        .startsWith(searchValue.toLowerCase())
    );
  }

  return (
    <div className="body mt-6 flex flex-col flex-1">
      {/* Search */}
      <div className="search-input rounded-md overflow-hidden h-[48px] relative mx-8">
        <SearchOutlined className="absolute text-[#9E9D9C] text-2xl mt-0 translate-y-1/2 left-3" />

        <input
          className="w-full h-full bg-[#3C3B39] outline-none text-[#E2E2E1] pl-14 placeholder:text-[#9E9D9C] placeholder:font-semibold"
          placeholder="Search by username"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          maxLength={10}
          minLength={3}
        />
      </div>
      {/* Search Result */}
      <div className="search-result flex-1 w-full px-8 overflow-y-auto pt-4">
        {loading ? (
          <div className="h-full overflow-y-auto flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              size="large"
              style={{ color: "#9ECC5E" }}
            />
          </div>
        ) : (
          <>
            <div className="list-title select-none">
              <span className="text-[#DFDEDE] font-semibold mr-2">
                Online Friends
              </span>
              <span className="inline-block bg-[#3C3B39] text-[#C9C8C8] rounded-md text-center select-none py-[0.1rem] px-[0.4rem]">
                {(searchData && searchData.length) || 0}
              </span>
            </div>

            <div className="list-content max-h-[168px] overflow-y-auto">
              {searchData &&
                searchData.map((friend) => {
                  return (
                    <Link
                      to={`/play/online/friend?opponent=${friend.friend.username}`}
                      className="friend-row flex flex-row my-2 w-full items-center"
                      key={friend.friend._id}
                    >
                      <img
                        src={friend.friend.avatarUrl}
                        className="w-8 h-8 mr-3"
                      />
                      <span className="text-[#DFDEDE] hover:text-[#FFFFFF]">
                        {friend.friend.username}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </>
        )}
      </div>
      {/* Footer */}
      <div className="footer bg-[#21201D] w-full py-6 px-8 flex flex-col gap-4">
        <button className="h-[56px] w-full bg-[#383734] hover:bg-[#454441] text-[#E1E1E1] hover:text-[#FFFFFF] rounded-lg pl-6 pr-6 font-semibold text-base flex flex-row items-center">
          <img
            src={challengelink}
            className="inline-block w-[30px] h-[30px] mr-3"
          />
          Create Challenge Link
        </button>

        <button className="h-[56px] w-full bg-[#383734] hover:bg-[#454441] text-[#E1E1E1] hover:text-[#FFFFFF] rounded-lg pl-6 pr-6 font-semibold text-base flex flex-row items-center">
          <img src={invite} className="inline-block w-[30px] h-[30px] mr-3" />
          Send Email Invite
        </button>

        <button className="h-[56px] w-full bg-[#383734] hover:bg-[#454441] text-[#E1E1E1] hover:text-[#FFFFFF] rounded-lg pl-6 pr-6 font-semibold text-base flex flex-row items-center">
          <img src={facebook} className="inline-block w-[30px] h-[30px] mr-3" />
          Find Facebook Friends
        </button>

        <div className="play_link text-center text-[#C1C1C0]">
          <p>Friends can directly challenge you anytime at:</p>
          <span className="font-semibold mr-2">{`https://caro-league-frontend.onrender.com/play/online/friend?opponent=${user.username}`}</span>
          <CopyOutlined
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `https://caro-league-frontend.onrender.com/play/online/friend?opponent=${user.username}`
                );
                message.success("Copy success!");
              } catch {
                message.error("Please try again!");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CaroLobbyFriendSearch;
