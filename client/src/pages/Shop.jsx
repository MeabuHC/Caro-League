import React, { useState } from "react";
import diamond from "../assets/svg/diamond.svg";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Shop() {
  const [loading, setLoading] = useState(false); // Track loading state

  const handleBuyClick = async (itemName) => {
    try {
      setLoading(true); // Show the loading mask
      const response = await axiosWithRefreshToken("/api/v1/payments", "post", {
        itemName: itemName,
      });
      const url = response.data.data; // Assuming this is a URL or a route
      console.log(url);
      window.location.href = url;
    } catch (error) {
      console.log(error);
      message.error("Network error!");
      setLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Mask */}
      {loading && (
        <div style={overlayStyle}>
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            style={{ color: "#9ECC5E" }}
          />
        </div>
      )}

      <div className="h-full w-full bg-[#312E2B] p-3 overflow-x-auto">
        <div className="py-5 header flex flex-row text-white text-3xl font-bold w-[1028px] mx-auto">
          <img src={diamond} className="w-[40px] h-[40px] mr-3" />
          <h1 className="">Shop</h1>
        </div>
        <div className="grid grid-cols-[257px,257px,257px,257px] w-[1028px] grid-rows-[auto,auto] mx-auto gap-4 max-w-full">
          {[
            "Bronze",
            "Silver",
            "Gold",
            "Platinum",
            "Emerald",
            "Diamond",
            "Master",
          ].map((rank, index) => (
            <div
              key={index}
              className="border-solid border-2 border-[#C1C0C0] h-[250px] flex flex-col items-center bg-[#262522] rounded-lg"
            >
              <img
                className="w-[120px] h-[120px]"
                src={`http://localhost:8000/img/ranks/${rank.toLowerCase()}.png`}
              />
              <span className="rank-title text-white font-semibold text-xl">
                {rank}
              </span>
              <button
                onClick={() => handleBuyClick(rank)}
                className="mt-auto mb-4 w-[90%] h-[50px] bg-[#81B64C] text-white font-medium rounded-lg shadow-md hover:bg-[#9DCB5E] hover:shadow-lg active:translate-y-1 active:shadow-sm transition-all duration-200 ease-in-out"
              >
                {(index + 1) * 100}$
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

export default Shop;
