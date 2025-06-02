import React, { useState } from "react";
import StarRatingInput from "./StarRatingInput";
import "./RatingForm.css";

const RatingForm = ({ products = [], onSubmit, onCancel }) => {
  const [ratings, setRatings] = useState(
    products.map((product) => ({
      productId: product.id,
      productName: product.productName,
      rating: 0,
      comment: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const newRatings = [...ratings];
    newRatings[index][field] = value;
    setRatings(newRatings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
