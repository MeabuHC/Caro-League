import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosWithRefreshToken from "../utils/axiosWithRefreshToken";
import { message } from "antd";

function UserHome() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) return null;

  return (
    <div className="bg-[#302E2B] w-full h-full max-h-full overflow-auto container">
      <iframe
        width="320"
        height="255"
        src="https://www.youtube.com/embed/mzZWPcgcRD0?si=sQt_QMao3V61dsjA"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  );
}

export default UserHome;
