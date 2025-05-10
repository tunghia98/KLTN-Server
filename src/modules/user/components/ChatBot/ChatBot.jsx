// ChatBot.jsx
import React, { useState } from "react";
import chatbotGif from '../../../../assets/chatbot.gif'; // Replace with your actual gif path
import "./ChatBot.css";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div className="chatbot-body">
                        <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                    </div>
                </div>
            )}
        <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        >
        <img src={chatbotGif} alt="Chatbot" />
        </button>
        </div>
    );
};

export default ChatBot;
