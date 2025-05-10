// layouts/UserLayout.jsx
import React from "react";
import Header from "../modules/user/components/Header/Header.jsx";
import Footer from "../modules/user/components/Footer/Footer.jsx";
import ChatBot from "../modules/user/components/ChatBot/ChatBot.jsx";
import "./MainLayout.css"; // Import CSS cho layout chính

const MainLayout = ({ children }) => (
  <>
    <Header/>
    <div className="main-content">
          {children}
          <ChatBot />
    </div>

    <Footer />
  </>
);

export default MainLayout;
