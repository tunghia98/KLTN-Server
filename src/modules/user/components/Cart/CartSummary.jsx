import React from "react";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ total, cartItems }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Điều hướng sang trang thanh toán và truyền cartItems qua state
    navigate("/checkout", { state: { cartItems, total } });
  };

  return (
    <div className="cart-summary">
      <h3>Tổng cộng: {total.toLocaleString()}đ</h3>
      <button className="checkout-btn" onClick={handleCheckout}>
        Đặt hàng
      </button>
    </div>
  );
};

export default CartSummary;
