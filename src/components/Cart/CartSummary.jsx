import React from "react";

const CartSummary = ({ total }) => {
  return (
    <div className="cart-summary">
      <h3>Tổng cộng: {total.toLocaleString()}đ</h3>
      <button className="checkout-btn">Tiến hành thanh toán</button>
    </div>
  );
};

export default CartSummary;
