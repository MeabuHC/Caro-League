import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function CaroTV() {
  return (
    <div className="caroTV rounded-md overflow-hidden ">
      <Link className="friends-board-header h-[48px] bg-[#262522] flex flex-row items-center px-3 hover:text-white text-[#DFDEDE]">
        <span className=" font-semibold">Live on CaroTV</span>
        <RightOutlined className="ml-auto" />
      </Link>
      <iframe
        width="320"
        height="255"
        src="https://www.youtube.com/embed/mzZWPcgcRD0?si=sQt_QMao3V61dsjA"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default CaroTV;
