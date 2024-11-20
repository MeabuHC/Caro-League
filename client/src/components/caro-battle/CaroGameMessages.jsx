import React from "react";
import { useUserContext } from "../../context/UserContext";
import CaroGameMessage from "./CaroGameMessage";
import CaroStartGameMessage from "./CaroStartGameMessage";
import CaroGameOverMessage from "./CaroGameOverMessage";

function CaroGameMessages({ gameObject }) {
  const { user } = useUserContext();
  const messages = gameObject.messages;

  return (
    <div className="game-messages-container">
      {messages.map((messageObj, index) => {
        const isSender = user.username === messageObj.sender;
        const hideSender = messages[index - 1]?.sender === messageObj.sender;

        if (messageObj.type === "start-game") {
          return <CaroStartGameMessage key={index} gameObject={gameObject} />;
        } else if (messageObj.type === "end-game") {
          return <CaroGameOverMessage key={index} gameObject={gameObject} />;
        }

        // For regular messages
        return (
          <CaroGameMessage
            key={index}
            messageObj={messageObj}
            isSender={isSender}
            hideSender={hideSender}
          />
        );
      })}
    </div>
  );
}

export default CaroGameMessages;
