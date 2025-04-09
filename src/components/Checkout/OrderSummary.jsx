import React from "react";

const OrderSummary = ({ total }) => {
  return (
    <div className="order-summary">
      <h3>Tóm tắt đơn hàng</h3>
      <p>Tổng tiền hàng: {total.toLocaleString()}đ</p>
      <p>Phí vận chuyển: Miễn phí</p>
      <h3>Tổng thanh toán: {total.toLocaleString()}đ</h3>
    </div>
  );
};

export default OrderSummary;
