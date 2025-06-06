import React, { useState } from "react";
import StarRatingInput from "./StarRatingInput";
import "./RatingForm.css";

const RatingForm = ({ products = [], userId, onSubmit, onCancel }) => {
  const accessToken = localStorage.getItem("accessToken");

    const [ratings, setRatings] = useState(
    products.map((product) => ({
        productId: product.productId,
      productName: product.productName,
      rating: 0,
      comment: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...ratings];
    updated[index][field] = value;
    setRatings(updated);
  };

  const fetchReview = async (productId, content, rating) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/ProductReviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            productId: productId,
            userId: userId,
            content: content,
            rating: rating,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text(); // dùng .text() để đọc raw lỗi
        console.error("Lỗi khi gửi đánh giá:", errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Lỗi fetchReview:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const item of ratings) {
        if (item.rating > 0 && item.comment.trim()) {
            console.log(products);
        const success = await fetchReview(
          item.productId,
          item.comment,
          item.rating
        );
        if (!success) {
          alert(`Gửi đánh giá cho sản phẩm ${item.productName} thất bại!`);
          return;
        }
      }
    }

    if (onSubmit) onSubmit(ratings);
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      {ratings.map((item, index) => (
        <div key={item.productId} className="rating-item">
          <h4>{item.productName}</h4>
          <StarRatingInput
            value={item.rating}
            onChange={(value) => handleChange(index, "rating", value)}
          />
          <textarea
            placeholder="Nhận xét sản phẩm"
            value={item.comment}
            onChange={(e) => handleChange(index, "comment", e.target.value)}
            rows={3}
          />
        </div>
      ))}
      <div className="rating-form-actions">
        <button type="submit" className="btn btn-submit">
          Gửi đánh giá
        </button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          Hủy
        </button>
      </div>
    </form>
  );
};

export default RatingForm;
