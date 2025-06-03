import React, { useState } from "react";
import Popup from "../../../../components/Common/Popup";
import ReviewCard from "../../components/Review/ReviewCard";
import Rating from "../../../user/components/Rating/RatingProduct";
import "./SellerProductMiniCard.css";


const SellerProductMiniCard = React.memo(
  ({ product, fromPromotion, onClick, value, count, productReviews}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [filterStar, setFilterStar] = useState(0); // 0 = không lọc, 1-5 lọc theo sao

    const handlePopupOpen = () => {
      if (!fromPromotion) {
        setReviews(productReviews);
        setFilterStar(0);
        setIsPopupOpen(true);
      }
    };

    const handlePopupClose = () => {
      setIsPopupOpen(false);
    };

    // Lọc đánh giá theo sao nếu filterStar khác 0
    const filteredReviews =
      filterStar === 0
        ? reviews
        : reviews.filter((review) => review.rating === filterStar);

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
            src={`https://kltn.azurewebsites.net/api/product-images/file/${
              product.imageUrls || "7a2843f5-2a5a-46e2-8eea-080b51bada6b.png"
            }`}
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
            title="Danh sách đánh giá"
          >
            {/* Bộ lọc sao */}
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

            {filteredReviews.length === 0 ? (
              <p>Chưa có đánh giá cho sản phẩm này.</p>
            ) : (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </Popup>
        )}
      </>
    );
  }
);

export default SellerProductMiniCard;
