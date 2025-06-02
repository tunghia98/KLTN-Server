import { Star } from "lucide-react";
import "./StarRatingInput.css";

export default function StarRatingInput({ value = 0, onChange, size = 24 }) {
  const handleClick = (index) => {
    if (onChange) onChange(index + 1);
  };

  return (
    <div className="star-rating-input">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          onClick={() => handleClick(i)}
          className={`star-icon ${i < value ? "active" : ""}`}
        />
      ))}
    </div>
  );
}
