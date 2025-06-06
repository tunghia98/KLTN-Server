import React, { useState, useEffect } from "react";
import Popup from "../../../../components/Common/Popup";
import ReviewCard from "../../components/Review/ReviewCard";
import Rating from "../../../user/components/Rating/RatingProduct";
import "./SellerProductMiniCard.css";

const SellerProductMiniCard = React.memo(
  ({ product, fromPromotion, onClick, value, count }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [filterStar, setFilterStar] = useState(0);
    const [reply, setReply] = useState({});
    const [openReview, setOpenReview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch reviews khi popup mở
    useEffect(() => {
      const fetchReviews = async () => {
        if (!isPopupOpen) return;
        setLoading(true);
        try {
          const res = await fetch(
            `https://kltn.azurewebsites.net/api/ProductReviews/product/${product.id}`
          );
          if (!res.ok) throw new Error("Lỗi tải đánh giá");
          const allReviews = await res.json();

          const formattedReviews = allReviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            content: r.content,
            date: r.createdAt,
            userId: r.userId,
            replyAt: r.replyAt,
            shopReply: r.shopReply,
          }));
          setReviews(formattedReviews);
        } catch (err) {
          console.error(err);
          setReviews([]);
        } finally {
          setLoading(false);
        }
      };
      fetchReviews();
    }, [isPopupOpen, product.id]);

    const filteredReviews =
      filterStar === 0
        ? reviews
        : reviews.filter((review) => review.rating === filterStar);

    const imageUrl =
      product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls[0]
        : "7a2843f5-2a5a-46e2-8eea-080b51bada6b.png";

    // Xử lý reply
    const handleReplyChange = (reviewId, replyText) => {
      setReply((prev) => ({ ...prev, [reviewId]: replyText }));
    };

    const handleSubmitReply = (reviewId) => {
      if (!reply[reviewId]) return;
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId
          ? { ...review, replies: [...review.replies, reply[reviewId]] }
          : review
      );
      setReviews(updatedReviews);
      setReply((prev) => ({ ...prev, [reviewId]: "" }));

      // TODO: Gửi reply lên server nếu cần
    };

    const toggleReplySection = (reviewId) => {
      setOpenReview((prev) => (prev === reviewId ? null : reviewId));
    };

    const handlePopupOpen = () => {
      if (!fromPromotion) {
        setFilterStar(0);
        setIsPopupOpen(true);
      }
    };

    const handlePopupClose = () => {
      setIsPopupOpen(false);
      setReviews([]);
      setReply({});
      setOpenReview(null);
    };
    console.log(filteredReviews);
    return (
      <>
        <div
          className="seller-product-mini-card"
          onClick={() => {
            if (fromPromotion) {
              onClick(product);
            } else {
              handlePopupOpen();
            }
          }}
        >
          <img
            src={`https://kltn.azurewebsites.net/api/product-images/file/${imageUrl}`}
            alt={product.name}
            className="mini-product-image"
          />
          <div className="mini-product-info">
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()}₫</p>
            <Rating value={value} count={count} size={16} />
          </div>
        </div>

        {isPopupOpen && !fromPromotion && (
          <Popup
            isOpen={isPopupOpen}
            onClose={handlePopupClose}
            title={`Đánh giá sản phẩm: ${product.name}`}
          >
            <div style={{ marginBottom: "10px" }}>
              <span>Lọc theo sao: </span>
              {[0, 5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterStar(star)}
                  style={{
                    marginRight: 6,
                    padding: "4px 8px",
                    backgroundColor: filterStar === star ? "#1976d2" : "#eee",
                    color: filterStar === star ? "#fff" : "#000",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {star === 0 ? "Tất cả" : `${star} sao`}
                </button>
              ))}
            </div>

            {loading ? (
              <p>Đang tải đánh giá...</p>
            ) : filteredReviews.length === 0 ? (
              <p>Chưa có đánh giá cho sản phẩm này.</p>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} style={{ marginBottom: "16px" }}>
                  <ReviewCard review={review} />
                  {openReview === review.id && (
                    <div style={{ marginTop: "8px" }}></div>
                  )}
                </div>
              ))
            )}
          </Popup>
        )}
      </>
    );
  }
);

export default SellerProductMiniCard;
