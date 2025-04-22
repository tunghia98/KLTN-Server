import React, { useState, useEffect } from "react";
import ReviewCard from "../../components/Review/ReviewCard.jsx"; // Import ReviewCard
import "./ProductReviewPage.css"; // Import CSS cho trang ProductReviewPage

function ProductReviewPage({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    // Giả sử lấy dữ liệu đánh giá từ API (thay bằng dữ liệu giả)
    const fetchedReviews = [
      { id: 1, user: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm tuyệt vời!", date: "2025-04-20" },
      { id: 2, user: "Trần Thị B", rating: 4, comment: "Chất lượng ổn.", date: "2025-04-18" },
      { id: 3, user: "Lê Minh C", rating: 3, comment: "Sản phẩm bình thường.", date: "2025-04-17" },
      { id: 4, user: "Phạm Thanh D", rating: 5, comment: "Rất tốt, sẽ mua lại.", date: "2025-04-16" },
      { id: 5, user: "Ngô Quốc E", rating: 4, comment: "Giao hàng nhanh, sản phẩm chất lượng.", date: "2025-04-15" },
      { id: 6, user: "Hoàng Lê F", rating: 2, comment: "Sản phẩm không đúng mô tả.", date: "2025-04-14" },
      // Thêm dữ liệu đánh giá khác
    ];

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    setReviews(fetchedReviews.slice(indexOfFirstReview, indexOfLastReview));
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-review-page">
      <h2>Đánh giá sản phẩm</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}

export default ProductReviewPage;
