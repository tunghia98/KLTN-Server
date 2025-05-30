// src/services/signalrService.js
import * as signalR from "@microsoft/signalr";

let connection = null;

/**
 * Khởi tạo kết nối SignalR và thiết lập sự kiện nhận tin nhắn.
 * @param {string} accessToken - Token xác thực.
 * @param {function} onReceiveMessage - Hàm callback khi nhận tin nhắn.
 */
export const startSignalRConnection = async (accessToken, onReceiveMessage) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        return; // tránh khởi tạo lại nếu đã kết nối
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://kltn.azurewebsites.net/chathub", {
            accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

    connection.on("ReceiveMessage", (fromUserId, content) => {
        onReceiveMessage({ fromUserId, content });
    });

    try {
        await connection.start();
        console.log("✅ SignalR connected");
    } catch (err) {
        console.error("❌ SignalR connection error:", err);
    }
};

/**
 * Tham gia vào phòng chat giữa 2 user.
 */
export const joinRoom = async (userAId, userBId) => {
    if (!connection) return;
    try {
        await connection.invoke("JoinRoom", userAId, userBId);
    } catch (err) {
        console.error("❌ JoinRoom error:", err);
    }
};

/**
 * Gửi tin nhắn thông qua SignalR.
 */
export const sendMessageSignalR = async (fromUserId, toUserId, content) => {
    if (!connection) return;
    try {
        await connection.invoke("SendMessage", fromUserId, toUserId, content);
    } catch (err) {
        console.error("❌ SendMessage error:", err);
    }
};

/**
 * Ngắt kết nối khi rời component (cleanup).
 */
export const stopConnection = async () => {
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
        await connection.stop();
        console.log("🛑 SignalR disconnected");
    }
};

/**
 * Truy xuất connection hiện tại (nếu cần).
 */
export const getConnection = () => connection;
