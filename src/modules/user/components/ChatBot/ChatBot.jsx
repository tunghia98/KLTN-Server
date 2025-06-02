import React, { useState } from "react";
import chatbotGif from '../../../../assets/chatbot.gif'; // Đường dẫn gif
import "./ChatBot.css";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([
        { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
    ]);
    const [loading, setLoading] = useState(false);

    const processBotResponse = (text) => {
        const regex = /List ID sản phẩm\s*:\s*([0-9,\s]+)/i;
        const match = text.match(regex);

        let productIds = [];
        if (match) {
            // Tách danh sách ID
            productIds = match[1]
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));

            // Xoá phần "List ID sản phẩm: ..." khỏi nội dung text
            text = text.replace(regex, "").trim();
        }

        return { text, productIds };
    };
    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = { from: "user", text: message };
        setChatLog(prev => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("https://kltn.azurewebsites.net/api/ChatBot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) throw new Error("Không thể kết nối tới API");

            const data = await response.text();

            setChatLog(prev => [
                ...prev,
                { from: "bot", text: data }
            ]);
        } catch (err) {
            setChatLog(prev => [
                ...prev,
                { from: "bot", text: "Lỗi: không thể lấy phản hồi từ trợ lý." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span>Trợ lý nông nghiệp</span>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div className="chatbot-body">
                        {chatLog.map((entry, index) => (
                            <div
                                key={index}
                                className={`chat-message ${entry.from}`}
                            >
                                {entry.text}
                            </div>
                        ))}
                        {loading && <div className="chat-message bot">Đang xử lý...</div>}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập câu hỏi..."
                        />
                        <button onClick={handleSend}>Gửi</button>
                    </div>
                </div>
            )}
            <button
                className={`chatbot-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src={chatbotGif} alt="Chatbot" />
            </button>
        </div>
    );
};

export default ChatBot;
