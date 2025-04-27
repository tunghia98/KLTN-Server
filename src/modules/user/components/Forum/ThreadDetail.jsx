import React, { useState } from "react";
import "./Forum.css";
import CommentSection from "../Comment/CommentSection";

function ThreadDetail({ thread }) {
  const [likes, setLikes] = useState(thread.likes || 0);
  if (!thread) return <p className="thread-empty">Chủ đề không tồn tại.</p>;
  const handleLikePost = () => {
    setLikes(likes + 1);
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
          <span>👍 {thread.likes} lượt thích</span>
          <span>💬 {thread.replies} câu trả lời</span>
        </div>

        <div className="thread-detail-content">
          <p>{thread.content}</p>
          <button onClick={handleLikePost} className="like-button">👍 Thích bài viết</button>
        </div>
        

        <div className="thread-author-info">
          <p>Viết bởi <strong>{thread.author || "Người dùng ẩn danh"}</strong> - {thread.date || "Không rõ ngày"}</p>
        </div>
      </div>
      <CommentSection comments={thread.comments} />
    </div>
  );
}

export default ThreadDetail;
