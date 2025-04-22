import React from "react";
import "./ChatList.css";

function ChatList({ chats, onSelectChat }) {
  return (
    <div className="chat-list-container">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => onSelectChat(chat.id)}
        >
          <h4>{chat.name}</h4>
          <p>{chat.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
