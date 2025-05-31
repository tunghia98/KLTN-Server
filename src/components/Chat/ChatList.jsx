import React from "react";
import "./ChatList.css";

function ChatList({ chats, onSelectChat, currentUserId }) {
    // Lấy tên người chat bên kia (không phải current user)
    const getChatName = (chat) => {
        if (!currentUserId) return "";
        return chat.userAId === currentUserId ? chat.userBName : chat.userAName;
    };

    return (
        <div className="chat-list-container">
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    className="chat-item"
                    onClick={() => onSelectChat(chat)}
                >
                    <h4 className="chat-name">{getChatName(chat)}</h4>
                    <p className="chat-last-message">{chat.LastMessage || "Không có tin nhắn"}</p>
                    <small className="chat-last-updated">
                        {chat.LastUpdated
                            ? new Date(chat.LastUpdated).toLocaleString(): ""}
                    </small>
                </div>
            ))}
        </div>
    );
}

export default ChatList;
