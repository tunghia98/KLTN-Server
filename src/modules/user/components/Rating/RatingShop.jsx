import { useState, useEffect } from "react";

export default function RatingShop({ seller, data }) {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [matchedReviews, setMatchedReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSellerProducts = async (sellerId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/Products/by-shop/${sellerId}`
      );
      if (!res.ok) throw new Error("Không thể tải dữ liệu");

      const products = await res.json();
      setSellerProducts(products);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seller?.id) {
      fetchSellerProducts(seller.id);
    }
  }, [seller?.id]);
  console.log(data);
  console.log(sellerProducts);
  useEffect(() => {
    if (sellerProducts?.length && data?.length) {
      const productIds = sellerProducts.map((p) => p.id);
      const matched = data
        .filter((review) => productIds.includes(review.productId))
        .map((review) => ({
          id: review.id,
          userId: review.userId,
          rating: review.rating,
          content: review.content,
          createdAt: review.createdAt,
          idproduct: review.productId,
        }));

      setMatchedReviews(matched);
    }
  }, [data, sellerProducts]);

  // Tính trung bình rating nếu có đánh giá
  const averageRating =
    matchedReviews.length > 0
      ? (
          matchedReviews.reduce((sum, r) => sum + r.rating, 0) /
          matchedReviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="text-sm text-gray-700">
      <p className="font-semibold mb-2">
        {" "}
        <span className="text-yellow-500">{averageRating} ⭐</span>
      </p>

      {/* {matchedReviews.length > 0 ? (
        <ul className="space-y-2">
          {matchedReviews.map((review) => (
            <li key={review.id} className="border p-2 rounded"></li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic"></p>
      )} */}
    </div>
  );
}
