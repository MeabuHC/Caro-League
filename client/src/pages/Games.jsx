import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Modal, Spin } from "antd";

export default function Games() {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Click on "Quick Play"
  const startQuickPlay = () => {
    setIsModalOpen(true);
    console.log("Start quick play");
  };

  //Cancel Quick Play
  const cancelQuickPlay = () => {
    console.log("Cancel quick play!");
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Rank Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-80">
        <div className="flex items-center mb-4">
          <img
            src="https://imgsvc.trackercdn.com/url/size(64),fit(contain)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Ftft%2Franks%2F2022%2Femerald.png/image.png"
            alt="Rank Image"
            className="w-16 h-16 mr-4"
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">EMERALD IV</h3>
            <span className="text-sm text-gray-500">Tier progress: 75 LP</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="bg-gray-300 h-2 rounded">
          <div
            className="bg-yellow-500 h-2 rounded"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
          onClick={startQuickPlay}
        >
          Quick Play
        </button>
        <button className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          Find Room
        </button>
      </div>
      <Modal
        title="Waiting for Opponent"
        open={isModalOpen}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        closable={false}
      >
        <div className="flex flex-col items-center justify-center">
          <Spin size="large" className="mb-4" />
          <p className="text-lg">Waiting for Opponent...</p>
          <button
            className="mt-4 px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={cancelQuickPlay}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
