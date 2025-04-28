import React, { useState } from "react";
import { useUser } from "../../../../contexts/UserContext"; // lấy thông tin user
import { useNavigate } from "react-router-dom";
import Login from "../AuthForm/Login"; // Import Popup Login
import "./Forum.css";
import CommentSection from "../Comment/CommentSection";

function ThreadDetail({ thread }) {
  const [likes, setLikes] = useState(thread.likes || 0);
  const { user } = useUser(); // lấy thông tin người dùng
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Điều khiển việc mở popup login
  const navigate = useNavigate();

  if (!thread) return <p className="thread-empty">Chủ đề không tồn tại.</p>;

  const handleLikePost = () => {
    if (!user) {
      setIsLoginOpen(true); // Nếu chưa đăng nhập, mở popup login
      return;
    }
    setLikes(likes + 1); // Nếu đã đăng nhập, tăng lượt thích
  };

  const handleCloseLoginPopup = () => {
    setIsLoginOpen(false); // Đóng popup khi người dùng đăng nhập hoặc đóng
  };

  return (
    <div className="thread-detail-container">
      <div className="thread-detail-card">
        <h1 className="thread-detail-title">{thread.title}</h1>
        
        <div className="thread-detail-info">
          <p>Phân loại: {thread.category}</p>
          <p>Giống cây: {thread.crop}</p>
          <p>Khu vực: {thread.region}</p>
        </div>

        <div className="thread-detail-meta">
          <span>👍 {likes} lượt thích</span>
          <span>💬 {thread.replies} câu trả lời</span>
        </div>

        <div className="thread-detail-content">
          <p>{thread.content}</p>
          <button onClick={handleLikePost} className="like-button">
            {user ? "👍 Thích bài viết" : "Đăng nhập để thích bài viết"}
          </button>
        </div>

        <div className="thread-author-info">
          <p>Viết bởi <strong>{thread.author || "Người dùng ẩn danh"}</strong> - {thread.date || "Không rõ ngày"}</p>
        </div>
      </div>
      
      <CommentSection comments={thread.comments} />

      {/* Hiển thị popup login nếu chưa đăng nhập */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={handleCloseLoginPopup} 
        onSwitchToRegister={() => navigate("/register")}
        isReady={true} // Thêm trạng thái 'isReady' nếu cần
      />
    </div>
  );
}

export default ThreadDetail;
