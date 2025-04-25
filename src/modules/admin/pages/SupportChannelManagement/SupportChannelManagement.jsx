import React, { useState } from "react";
import "./SupportChannelManagement.css";

export default function SupportChannelManagement() {
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  const [response, setResponse] = useState("");

  const handleChatbotToggle = () => {
    setIsChatbotEnabled(!isChatbotEnabled);
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  return (
    <div className="support-channel-container">
      <h2>💬 Quản lý kênh hỗ trợ</h2>
      <div className="chatbot-config">
        <h3>Cấu hình Chatbot</h3>
        <label>
          Phản hồi tự động:
          <textarea
            value={response}
            onChange={handleResponseChange}
            placeholder="Nhập câu trả lời tự động cho các câu hỏi phổ biến..."
          />
        </label>
        <button onClick={handleChatbotToggle}>
          {isChatbotEnabled ? "Tắt Chatbot" : "Bật Chatbot"}
        </button>
      </div>
      <div className="live-chat-monitoring">
        <h3>Giám sát cuộc trò chuyện</h3>
        <p>Chức năng này sẽ cho phép bạn giám sát các cuộc trò chuyện giữa nhân viên hỗ trợ và người dùng.</p>
        <button>Điều phối nhân viên hỗ trợ</button>
      </div>
    </div>
  );
}
