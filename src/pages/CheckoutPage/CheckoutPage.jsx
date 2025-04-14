import React from "react";
import { useLocation } from "react-router-dom";
import "./CheckoutPage.css";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import Payment from "../../components/Checkout/PaymentSection.jsx";
import Discount from "../../components/Checkout/Discount.jsx";

const userInfo = {
  name: "Nguyễn Hoàng Kiều Ngân",
  phone: "0859763025",
  address: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM",
};

const CheckoutPage = () => {
  const location = useLocation();
  const { cartItems } = location.state;  // Nhận thông tin cartItems từ state
  
  // Tính toán tổng số tiền dựa trên cartItems
  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="checkout-page">
      <Payment className="checkout-page-payment" />
      <div className="checkout-page-right">
        <ShippingInfo user={userInfo} className="checkout-page-shippinginfo" />
        <Discount className="checkout-page-discount" />
        <OrderSummary total={totalAmount} cartItems={cartItems} className="checkout-page-summary" />
      </div>
    </div>
  );
};

export default CheckoutPage;
