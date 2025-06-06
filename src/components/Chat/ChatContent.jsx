import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChatContent.css";

function ChatContent({ chatId, currentUserId, conversation }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const connection = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    fetch(
      `https://kltn.azurewebsites.net/api/conversations/conversation/${chatId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Lấy tin nhắn thất bại");
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải tin nhắn");
      })
      .finally(() => setLoading(false));
  }, [chatId, accessToken]);

  useEffect(() => {
    if (!chatId) return;

    connection.current = new signalR.HubConnectionBuilder()
      .withUrl("https://kltn.azurewebsites.net/chatHub", {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    connection.current
      .start()
      .then(() => connection.current.invoke("JoinConversation", chatId))
      .catch((err) => {
        console.error("SignalR connection error: ", err);
        toast.error("Không thể kết nối với máy chủ chat");
      });

    connection.current.on(
      "ReceiveMessage",
      (conversationId, senderId, message) => {
        if (conversationId === chatId) {
          setMessages((prev) => [...prev, message]);
        }
      }
    );

    return () => {
      if (connection.current) {
        connection.current.invoke("LeaveConversation", chatId).catch(() => {});
        connection.current.stop();
      }
    };
  }, [chatId, accessToken]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const receiverId =
      conversation.userAId === currentUserId
        ? conversation.userBId
        : conversation.userAId;

    fetch("https://kltn.azurewebsites.net/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        Content: newMessage,
        ConversationId: chatId,
        ReceiverId: receiverId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gửi tin nhắn thất bại");
        return res.json();
      })
      .then(() => {
        setNewMessage("");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi gửi tin nhắn");
      });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="chat-content-container">
      <div className="messages">
        {loading && <p>Đang tải tin nhắn...</p>}
        {!loading && messages.length === 0 && <p>Không có tin nhắn nào.</p>}
        {messages.map((msg) => {
          const isSent = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`message ${isSent ? "sent" : "received"}`}
            >
              <div className="message-info">
                <span className="sender">
                  {isSent ? "Bạn" : msg.senderName || "Người gửi"}
                </span>
                <span className="time">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="message-text">{msg.content}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="send-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Gửi tin nhắn..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button onClick={handleSendMessage}>Gửi</button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default ChatContent;
