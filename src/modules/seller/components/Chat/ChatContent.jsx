import React, { useState, useEffect } from "react";
import "./ChatContent.css";

function ChatContent({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Dữ liệu giả cho các tin nhắn
    const fetchedMessages = [
      { sender: "Nguyễn Văn A", content: "Chào bạn, tôi cần giúp đỡ.", time: "10:00 AM" },
      { sender: "Bạn", content: "Chào bạn, bạn cần giúp gì?", time: "10:05 AM" },
    ];

    setMessages(fetchedMessages); // Giả sử lấy dữ liệu tin nhắn từ API
  }, [chatId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "Bạn", content: newMessage, time: "Now" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-content-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "Bạn" ? "sent" : "received"}`}>
            <div className="message-info">
              <span className="sender">{msg.sender}</span>
              <span className="time">{msg.time}</span>
            </div>
            <p className="message-text">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="send-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Gửi tin nhắn..."
        />
        <button onClick={handleSendMessage}>Gửi</button>
      </div>
    </div>
  );
}

export default ChatContent;
