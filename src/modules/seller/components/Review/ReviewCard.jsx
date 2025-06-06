import React, { use, useEffect, useState } from "react";
import "./ReviewCard.css";
import { useFetcher } from "react-router-dom";

const ReviewCard = ({ review }) => {
  const [reply, setReply] = useState(""); // Nội dung phản hồi
  const [isReplying, setIsReplying] = useState(false); // Toggle ô trả lời
  const [submittedReply, setSubmittedReply] = useState(review.reply || null); // Phản hồi đã gửi
  const [user, setUser] = useState();
  const accessToken = localStorage.getItem("accessToken");

  const handleReplySubmit = () => {
    if (reply.trim()) {
      setSubmittedReply(reply);
      fetchReply(Number(review.id), reply);
      // setReply("");
      setIsReplying(false);
    }
  };

  const fetchReply = async (reviewId, replyContent) => {
    try {
      await fetch(
        `https://kltn.azurewebsites.net/api/ProductReviews/${reviewId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            shopReply: replyContent,
          }),
        }
      );
    } catch (error) {
      console.error("Không thể trả lời đánh giá:", error);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const userRes = await fetch(
        `https://kltn.azurewebsites.net/api/users/${userId}`
      );
      const userData = await userRes.json();
      setUser(userData);
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error);
    }
  };
  useEffect(() => {
    fetchUser(Number(review.userId));
  }, [review.userId]);
  console.log(user);
  return (
    <div className="review-card">
      <div className="review-card-header">
        <span style={{ fontWeight: 700 }}>{user?.name || "Ẩn danh"}</span>
        <span className="review-rating">
          {Array(review.rating).fill("★").join(" ")}
        </span>
      </div>

      <p className="review-comment">{review.content}</p>

      <div className="review-card-footer">
        <span className="review-date">{review.date}</span>
      </div>

      {/* Phản hồi nếu đã có */}
      {review.shopReply || submittedReply ? (
        <div className="review-reply">
          <strong>Phản hồi từ người bán:</strong>
          <p>{review.shopReply || submittedReply}</p>
        </div>
      ) : isReplying ? (
        <div className="reply-box">
          <textarea
            placeholder="Nhập phản hồi..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button onClick={handleReplySubmit}>Gửi</button>
          <button onClick={() => setIsReplying(false)}>Hủy</button>
        </div>
      ) : (
        <button className="reply-btn" onClick={() => setIsReplying(true)}>
          Trả lời
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
