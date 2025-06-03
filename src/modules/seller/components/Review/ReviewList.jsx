import React from "react";
import ReviewCard from "./ReviewCard";
import "./ReviewList.css";

const ReviewList = ({
  reviews,
  reply,
  openReview,
  onReplyChange,
  onSubmitReply,
  onToggleReply,
}) => {
  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <p className="no-reviews">Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-item">
            <ReviewCard review={review} />
            <div className="review-actions">
              <button onClick={() => onToggleReply(review.id)}>
                {openReview === review.id ? "Ẩn phần trả lời" : "Trả lời"}
              </button>
              {openReview === review.id && (
                <div className="reply-box">
                  <textarea
                    value={reply[review.id] || ""}
                    onChange={(e) => onReplyChange(review.id, e.target.value)}
                    placeholder="Trả lời đánh giá..."
                  />
                  <button onClick={() => onSubmitReply(review.id)}>
                    Gửi trả lời
                  </button>
                </div>
              )}
              {review.replies?.length > 0 && (
                <div className="replies">
                  <h4>Phản hồi:</h4>
                  {review.replies.map((r, idx) => (
                    <div key={idx} className="reply">
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
