import React, { useState, useEffect } from "react";
import "./ChatList.css";

function ChatList({ chats, onSelectChat, currentUserId }) {
  const [sellerMap, setSellerMap] = useState({});
  const getOtherUserId = (chat) => {
    if (!currentUserId) return "";
    return chat.userAId === currentUserId ? chat.userBId : chat.userAId;
  };

  const getChatName = (chat) => {
    if (!currentUserId) return "";
    return chat.userAId === currentUserId ? chat.userBName : chat.userAName;
  };

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/Shops");
        if (!res.ok) throw new Error("Không thể tải danh sách nhà cung cấp");
        const shops = await res.json();

        const sellerIds = chats.map(getOtherUserId);
        const sellerMapTemp = {};
        sellerIds.forEach((id) => {
          const foundSeller = shops.find((s) => s.ownerId === id);
          if (foundSeller) {
            sellerMapTemp[id] = foundSeller;
          }
        });

        setSellerMap(sellerMapTemp);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà cung cấp:", error);
      }
    };

    if (chats.length > 0 && currentUserId) {
      fetchSellers();
    }
  }, [chats, currentUserId]);

return (
  <div className="chat-list-container">
    {chats.map((chat) => {
      const otherUserId = getOtherUserId(chat);
      const seller = sellerMap[otherUserId];

      return (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => onSelectChat(chat)}
        >
          <h4 className="chat-name">
            {getChatName(chat)}
            {seller && (
              <span style={{ color: "#888", marginLeft: "6px" }}>
                ({seller.name})
              </span>
            )}
          </h4>
          <p className="chat-last-message">
            {chat.LastMessage || "Không có tin nhắn"}
          </p>
          <small className="chat-last-updated">
            {chat.LastUpdated
              ? new Date(chat.LastUpdated).toLocaleString()
              : ""}
          </small>
        </div>
      );
    })}
  </div>
);
}

export default ChatList;
