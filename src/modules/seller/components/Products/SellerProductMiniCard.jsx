// SellerProductMiniCard.jsx
import React, { useState } from "react";
import Popup from "../../../../components/Common/Popup";  // Import Popup để hiển thị đánh giá
import ReviewCard from "../../components/Review/ReviewCard";  // Import ReviewCard để hiển thị đánh giá
import "./SellerProductMiniCard.css";  // Đảm bảo đã tạo các style cho sản phẩm mini card

const SellerProductMiniCard = React.memo(({ product }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);  // State để kiểm soát popup
  const [reviews] = useState([
    { id: 1, user: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm tuyệt vời!", date: "2025-04-20" },
    { id: 2, user: "Trần Thị B", rating: 4, comment: "Chất lượng ổn.", date: "2025-04-18" },
    { id: 3, user: "Lê Minh C", rating: 3, comment: "Sản phẩm bình thường.", date: "2025-04-17" },
  ]);  // Đánh giá mẫu

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="seller-product-mini-card" onClick={handlePopupOpen}>
        <img src={product.images[0]} alt={product.name} className="mini-product-image" />
        <div className="mini-product-info">
          <h3>{product.name}</h3>
          <p>{product.price.toLocaleString()}₫</p>
          <p>{product.quantity} sản phẩm còn lại</p>
        </div>
      </div>

      {/* Tách popup ra khỏi phần tử có onClick để tránh nháy khi rê chuột */}
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={handlePopupClose} title="Danh sách đánh giá">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Popup>
      )}
    </>
  );
});

export default SellerProductMiniCard;
