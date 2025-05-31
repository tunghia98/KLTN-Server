import React, { useState, useEffect } from "react";
import ChatList from "../../../../components/Chat/ChatList.jsx";
import ChatContent from "../../../../components/Chat/ChatContent.jsx";
import "./ChatPage.css"; // Bạn có thể đổi tên file này thành ChatPage.css nếu cần
function ChatPage() {
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const accessToken = localStorage.getItem("accessToken");
    useEffect(() => {
        const fetchUserAndChats = async () => {
            try {
                // Lấy user info
                const resUser = await fetch("https://kltn.azurewebsites.net/api/Users/me", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!resUser.ok) throw new Error("Không lấy được thông tin người dùng");
                const userData = await resUser.json();
                const userId = userData.id ?? userData.userId;
                setCurrentUserId(userId);

                // Lấy conversations khi có userId
                const resChats = await fetch("https://kltn.azurewebsites.net/api/conversations/me", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!resChats.ok) throw new Error("Không lấy được danh sách cuộc trò chuyện");
                const conversations = await resChats.json();
                setChatList(conversations);
                // Chọn chat đầu tiên nếu chưa có chat nào được chọn
                if (conversations.length > 0 && !selectedChat) {
                    setSelectedChat(conversations[0].id);
                }
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        };

        fetchUserAndChats();
    }, [accessToken, selectedChat]);


  return (
    <div className="chat-app">
      <div className="chat-list">
              <ChatList
                  chats={chatList}
                  onSelectChat={setSelectedChat}
                  currentUserId={currentUserId}
              />
      </div>
      <div className="chat-content">
        {selectedChat ? (
                  <ChatContent
                      chatId={selectedChat.id}
                      currentUserId={currentUserId}
                      conversation={selectedChat}
                  />
        ) : (
          <p>Chọn một cuộc trò chuyện để bắt đầu.</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
