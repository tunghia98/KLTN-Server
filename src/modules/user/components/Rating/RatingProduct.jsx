// components/Rating.jsx
import { Star } from "lucide-react";
import "./Rating.css"

export default function Rating({ value = 0, count = 0, size = 20, onRate }) {
    const fullStars = Math.floor(value);
    const hasHalf = value - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    const handleClick = (index) => {
        if (onRate) {
            onRate(index + 1);
        }
    };

    return (
        <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    onClick={() => handleClick(i)}
                    className={
                        i < value ? "fill-yellow-400 text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"
                    }
                />
            ))}
            <span className="ml-2 text-sm text-gray-600">({count})</span>
        </div>
    );
}
