import React from "react";
import "./Forum.css";

function ThreadDetail({ thread }) {
  if (!thread) return <p>Chủ đề không tồn tại.</p>;

  return (
    <div className="thread-detail">
      <h2 className="thread-detail-title">{thread.title}</h2>
      <p className="thread-detail-info">
        Phân loại: {thread.category} | Giống cây: {thread.crop} | Khu vực: {thread.region}
      </p>
      <p className="thread-detail-meta">
        {thread.likes} lượt thích | {thread.replies} câu trả lời
      </p>
      <div className="thread-detail-content">
        <p>{thread.content}</p> {/* Hiển thị nội dung chi tiết của thread */}
      </div>
    </div>
  );
}

export default ThreadDetail;
