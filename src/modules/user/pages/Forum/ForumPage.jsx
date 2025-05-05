import React from "react";
import { useNavigate } from "react-router-dom";
import LastestThreads from "../../components/Forum/LastestThread.jsx";
import PopularThreads from "../../components/Forum/PopularThread.jsx";
import AllThread from "../../components/Forum/AllThread.jsx"; 
import "../../components/Forum/Forum.css";

function ForumPage() {
  const navigate = useNavigate(); // Hook để điều hướng
  const handleOnClick = () => {
    navigate("/forum/create") // Chuyển hướng đến trang tạo bài viết
  };
  return (
    <div className="forum-page">
      <div>
        <h1 className="forum-main-title">🌾 Diễn Đàn Nông Nghiệp 🌾</h1>
        
      </div>

      <div className="forum-layout">
        {/* Sidebar */}
        <div className="forum-sidebar">
          <LastestThreads />
          <PopularThreads />
        </div>

        {/* Main Content */}
        <div className="forum-content">
        <button className="forum-create-thread" onClick={handleOnClick}>Tạo bài viết</button>
          <AllThread />
        </div>
      </div>
    </div>
  );
}

export default ForumPage;
