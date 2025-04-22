import React from "react";
import "./ReviewCard.css"; // Import CSS cho ReviewCard

function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-card-header">
        <h4>{review.user}</h4>
        <span className="review-rating">
          {Array(review.rating)
            .fill("★")
            .join(" ")} {/* Hiển thị sao đánh giá */}
        </span>
      </div>
      <p className="review-comment">{review.comment}</p>
      <div className="review-card-footer">
        <span className="review-date">{review.date}</span>
      </div>
    </div>
  );
}

export default ReviewCard;
