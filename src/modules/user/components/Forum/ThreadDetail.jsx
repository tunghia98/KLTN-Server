import React, { useState } from "react";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Login from "../AuthForm/Login";
import "./Forum.css";
import CommentSection from "../Comment/CommentSection";

function ThreadDetail({ thread, category, crop, region, userwriter, comments }) {
  const [likes, setLikes] = useState(thread.likes || 0);
  const [isLocked, setIsLocked] = useState(thread.isLocked || false); // Thêm state khóa bài viết
  const { user } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
    const [hasLiked, setHasLiked] = useState(false);
  const isAuthor = user && user.userId === thread.authorId;
  const isAdmin = user && user.role === "admin";


    const handleLikePost = async () => {
        if (!user) {
            setIsLoginOpen(true);
            return;
        }

        if (hasLiked) return;

        try {
            const res = await fetch(
                `https://kltn.azurewebsites.net/api/forumposts/${thread.id}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (res.ok) {
                setLikes((prev) => prev + 1);
                setHasLiked(true);
            } else {
                const data = await res.json();
                alert(data.message || "Không thể thích bài viết.");
            }
        } catch (error) {
            console.error("Lỗi khi like bài viết:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
  const handleCloseLoginPopup = () => setIsLoginOpen(false);

  const handleToggleLock = async () => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/forumposts/${thread.id}/lock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ isLocked: !isLocked }),
        }
      );
      if (!res.ok)
        throw new Error("Không thể cập nhật trạng thái khóa bài viết.");
      setIsLocked(!isLocked);
    } catch (err) {
      console.error("Lỗi khi khóa/mở bài viết:", err);
      alert("Có lỗi xảy ra khi cập nhật trạng thái khóa bài viết.");
    }
  };

  if (!thread) return <p className="thread-empty">Chủ đề không tồn tại.</p>;

  return (
    <div className="thread-detail-container">
      <div className="thread-detail-card">
        <h1 className="thread-detail-title">{thread.title}</h1>

        <div className="thread-detail-info">
          <p>Phân loại: {category?.name || "Không rõ"}</p>
          <p>Giống cây: {crop?.name || "Không rõ"}</p>
          <p>Khu vực: {region?.name || "Không rõ"}</p>
        </div>

        <div className="thread-detail-meta">
          <span>👍 {likes} lượt thích</span>
          <span>💬 {thread.replies} câu trả lời</span>
          <span>📌 Trạng thái: {isLocked ? "Đã khóa" : "Đang mở"}</span>
        </div>

        <div className="thread-detail-content">
          <p>{thread.content}</p>
          <button onClick={handleLikePost} className="like-button">
            {user ? "👍 Thích bài viết" : "Đăng nhập để thích bài viết"}
          </button>
        </div>

        <div className="thread-author-info">
          <p>
            Viết bởi:{" "}
            <strong>
              {userwriter?.name || userwriter?.username || "Người dùng ẩn danh"}
            </strong>{" "}
            – {new Date(thread.createdAt).toLocaleDateString()}
          </p>
              </div>
              <div className="comment-section">
                  <h3>Bình luận</h3>
                  {comments?.length > 0 ? (
                      comments.map((comment) => (
                          <div key={comment.id} className="comment">
                              <p><strong>{comment.userName}</strong>: {comment.content}</p>
                              <p>👍 {comment.likeCount}</p>
                          </div>
                      ))
                  ) : (
                      <p>Chưa có bình luận nào.</p>
                  )}
              </div>

        {(isAdmin || isAuthor) && (
          <button onClick={handleToggleLock} className="lock-thread-btn">
            {isLocked ? "Mở khóa bài viết" : "Khóa bài viết"}
          </button>
        )}
      </div>

      {/* Chỉ hiển thị bình luận nếu bài viết chưa bị khóa */}
      {!isLocked ? (
              <CommentSection comments={comments} thread={thread} />
      ) : (
        <div className="comment-disabled-message">
          Bài viết đã bị khóa, không thể bình luận.
        </div>
      )}

      <Login
        isOpen={isLoginOpen}
        onClose={handleCloseLoginPopup}
        onSwitchToRegister={() => navigate("/register")}
        isReady={true}
      />
    </div>
  );
}

export default ThreadDetail;
