import React, { useState, useEffect } from "react";
import ReviewCard from "../../components/Review/ReviewCard"; // Import ReviewCard để hiển thị đánh giá
import SellerProductMiniCard from "../../components/Products/SellerProductMiniCard"; // Sử dụng card sản phẩm
import { products } from "../../../../data/data"; // Import dữ liệu sản phẩm thực tế
import "./SellerReviewPage.css"; // CSS cho SellerReviewPage

const SellerReviewPage = ({ sellerId }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [reply, setReply] = useState({}); // Lưu thông tin trả lời cho từng đánh giá
  const [openReview, setOpenReview] = useState(null); // Lưu ID của review đang được mở rộng (click vào)
  const [selectedProduct, setSelectedProduct] = useState(null); // Lưu sản phẩm được chọn

  useEffect(() => {
    if (selectedProduct) {
      // Giả sử fetch dữ liệu đánh giá từ API dựa trên productId
      const fetchedReviews = [
        { id: 1, productId: 1, user: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm tuyệt vời!", date: "2025-04-20", replies: [] },
        { id: 2, productId: 2, user: "Trần Thị B", rating: 4, comment: "Chất lượng ổn.", date: "2025-04-18", replies: [] },
        { id: 3, productId: 1, user: "Lê Minh C", rating: 3, comment: "Sản phẩm bình thường.", date: "2025-04-17", replies: [] },
        { id: 4, productId: 1, user: "Phạm Thanh D", rating: 5, comment: "Rất tốt, sẽ mua lại.", date: "2025-04-16", replies: [] },
        { id: 5, productId: 3, user: "Ngô Quốc E", rating: 4, comment: "Giao hàng nhanh, sản phẩm chất lượng.", date: "2025-04-15", replies: [] },
        { id: 6, productId: 2, user: "Hoàng Lê F", rating: 2, comment: "Sản phẩm không đúng mô tả.", date: "2025-04-14", replies: [] },
      ];

      // Lọc các đánh giá dựa trên productId đã chọn
      const filteredReviews = fetchedReviews.filter(review => review.productId === selectedProduct.id);

      const indexOfLastReview = currentPage * reviewsPerPage;
      const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
      setReviews(filteredReviews.slice(indexOfFirstReview, indexOfLastReview));
    }
  }, [currentPage, selectedProduct]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReplyChange = (reviewId, replyText) => {
    setReply((prevReply) => ({ ...prevReply, [reviewId]: replyText }));
  };

  const handleSubmitReply = (reviewId) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, replies: [...review.replies, reply[reviewId]] } : review
    );
    setReviews(updatedReviews);
    setReply((prevReply) => ({ ...prevReply, [reviewId]: "" })); // Reset reply text
  };

  // Toggle trả lời khi click vào đánh giá
  const toggleReplySection = (reviewId) => {
    if (openReview === reviewId) {
      setOpenReview(null); // Nếu đánh giá đã mở thì đóng lại
    } else {
      setOpenReview(reviewId); // Mở phần trả lời cho đánh giá mới
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Cập nhật sản phẩm đã chọn
  };

  return (
    <div className="seller-review-page">
      <h2>Đánh giá sản phẩm của bạn</h2>

      {/* Hiển thị thông tin sản phẩm */}
      <div className="product-summary">
        {products.map((product) => (
          <SellerProductMiniCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product)} // Khi click vào sản phẩm, sẽ hiển thị đánh giá của sản phẩm đó
          />
        ))}
      </div>

      {/* Nếu có sản phẩm được chọn, hiển thị danh sách đánh giá */}
      {selectedProduct && (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id}>
              <ReviewCard review={review} />
              <div className="review-card-footer">
                <button onClick={() => toggleReplySection(review.id)}>
                  {openReview === review.id ? "Ẩn phần trả lời" : "Trả lời"}
                </button>
                {/* Phần trả lời */}
                {openReview === review.id && (
                  <div className="reply-section">
                    <textarea
                      value={reply[review.id] || ""}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                      placeholder="Trả lời đánh giá..."
                    />
                    <button onClick={() => handleSubmitReply(review.id)}>Gửi trả lời</button>
                    {review.replies.length > 0 && (
                      <div className="replies">
                        <h4>Phản hồi:</h4>
                        {review.replies.map((reply, index) => (
                          <div key={index} className="reply">
                            <p>{reply}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={reviews.length < reviewsPerPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerReviewPage;
