import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

import { HomeFilled } from "@ant-design/icons";
import { useUserContext } from "../context/UserContext";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { Spin, message } from "antd";

function SuccessPayment() {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const homeUrl = user ? "/home" : "/";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    console.log("Token:", token);
    console.log("PayerID:", payerId);

    if (token && payerId) {
      const capturePayment = async () => {
        try {
          setLoading(true);
          const response = await axiosWithRefreshToken(
            "/api/v1/payments/complete-order",
            "post",
            {
              orderId: token,
            }
          );
          console.log(response.data);
        } catch (error) {
          console.log(error);
          message.error("Network error!");
          navigate("/home");
        } finally {
          setLoading(false);
        }
      };

      capturePayment();
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="h-screen bg-[#312E2B] flex items-center justify-center relative">
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          style={{ color: "#9ECC5E" }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen bg-[#312E2B] flex items-center justify-center relative">
        <Link to={homeUrl}>
          <HomeFilled className="absolute top-[20px] left-[25px] text-[#989795] text-xl" />
        </Link>
        <div className="w-[600px] bg-[#272522] flex flex-col items-center justify-center p-6 gap-4 mt-5">
          <div className="header w-full flex flex-col items-center justify-center">
            <h1 className="text-white font-bold text-3xl pb-5 mb-3 border-b-2 border-solid border-[#3D3B39] w-[80%] text-center">
              Payment Successful
            </h1>
            <Link
              className="h-[40px] bg-[#3D3B39] hover:bg-[#3D3B39] text-[#C3C0C2] hover:text-[#E3E3E3] px-5 py-2 font-semibold rounded-lg"
              to={homeUrl}
            >
              Return Home
            </Link>
          </div>
          <div className="body">
            <div
              style={{ width: "420px", height: "420px", overflow: "hidden" }}
            >
              <iframe
                src="https://giphy.com/embed/1DTBGm5Rfgymk"
                width="420"
                height="420"
                style={{ border: "none" }}
                allowFullScreen
                title="Giphy Embed"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuccessPayment;
