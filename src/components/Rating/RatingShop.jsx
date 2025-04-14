export default function RatingShop({ value = 0 }) {
  return (
    <div className="text-sm text-gray-700">
      Đánh giá: <span className="font-semibold text-yellow-500">{value.toFixed(1)} ⭐</span>
    </div>
  );
}
