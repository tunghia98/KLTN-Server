// components/Rating.jsx
import { Star } from "lucide-react";
import "./Rating.css"

export default function Rating({ value = 0, count = 0, size = 20 }) {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={"full-" + i} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalf && (
        <Star size={size} className="fill-yellow-400 text-yellow-400 clip-half" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={"empty-" + i} size={size} className="text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-gray-600">({count})</span>
    </div>
  );
}
