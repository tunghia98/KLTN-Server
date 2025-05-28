import { Star } from "lucide-react";
import "./Rating.css";

export default function Rating({ value = 0, count = 0, size = 20, onRate }) {
  const fullStars = Math.floor(value);
  const decimalPart = value - fullStars;
  const hasHalf = decimalPart >= 0.25 && decimalPart < 0.75;
  const totalStars = 5;

  const handleClick = (index) => {
    if (onRate) {
      onRate(index + 1);
    }
  };

  return (
    <div className="rating-container">
      {Array.from({ length: totalStars }).map((_, i) => {
        const isFull = i < fullStars;
        const isHalf = i === fullStars && hasHalf;

        return (
          <div
            key={i}
            className="star-wrapper"
            onClick={() => handleClick(i)}
            style={{ width: size, height: size, cursor: onRate ? "pointer" : "default" }}
          >
            {/* Background empty star */}
            <Star size={size} className="star-icon empty" />

            {/* Filled or half star */}
            {(isFull || isHalf) && (
              <div
                className={`star-overlay ${isHalf ? "half" : "full"}`}
                style={{ width: isHalf ? size / 2 : size, height: size }}
              >
                <Star size={size} className="star-icon filled" />
              </div>
            )}
          </div>
        );
      })}
      <span className="rating-text">
        ({value.toFixed(1)}/5 - {count} đánh giá)
      </span>
    </div>
  );
}
