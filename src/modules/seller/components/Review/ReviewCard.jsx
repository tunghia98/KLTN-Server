import React, { useState } from "react";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const [reply, setReply] = useState("");         // Nội dung phản hồi
  const [isReplying, setIsReplying] = useState(false); // Toggle ô trả lời
  const [submittedReply, setSubmittedReply] = useState(review.reply || null); // Phản hồi đã gửi

  const handleReplySubmit = () => {
    if (reply.trim()) {
      setSubmittedReply(reply);
      setReply("");
      setIsReplying(false);
    }
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <h4>{review.user}</h4>
        <span className="review-rating">
          {Array(review.rating).fill("★").join(" ")}
        </span>
      </div>

      <p className="review-comment">{review.comment}</p>

      <div className="review-card-footer">
        <span className="review-date">{review.date}</span>
      </div>

      {/* Phản hồi nếu đã có */}
      {submittedReply ? (
        <div className="review-reply">
          <strong>Phản hồi từ người bán:</strong>
          <p>{submittedReply}</p>
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
