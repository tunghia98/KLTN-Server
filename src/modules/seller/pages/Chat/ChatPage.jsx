import React, { useState } from "react";
import ChatList from "../../../../components/Chat/ChatList.jsx";
import ChatContent from "../../../../components/Chat/ChatContent.jsx";
import "./ChatPage.css"; // Bạn có thể đổi tên file này thành ChatPage.css nếu cần

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, name: "Nguyễn Văn A", lastMessage: "Chào bạn, tôi cần giúp đỡ." },
    { id: 2, name: "Trần Thị B", lastMessage: "Sản phẩm này có sẵn chưa?" },
    { id: 3, name: "Lê Minh C", lastMessage: "Tôi muốn hỏi về đơn hàng." },
    // Các cuộc trò chuyện khác
  ];

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
  };

  return (
    <div className="chat-app">
      <div className="chat-list">
        <ChatList chats={chats} onSelectChat={handleSelectChat} />
      </div>
      <div className="chat-content">
        {selectedChat ? (
          <ChatContent chatId={selectedChat} />
        ) : (
          <p>Chọn một cuộc trò chuyện để bắt đầu.</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
