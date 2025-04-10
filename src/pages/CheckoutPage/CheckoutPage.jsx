import React from "react";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import Payment from "../../components/Payment/Payment.jsx";

const userInfo = {
  name: "Nguyễn Hoàng Kiều Ngân",
  phone: "0859763025",
  address: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM",
};

const CheckoutPage = () => {
  return (
    <div className="checkout-page">
      <h2>Thanh toán</h2>
      <Payment />
      <ShippingInfo user={userInfo} />
      <OrderSummary total={22000} />
    </div>
  );
};

export default CheckoutPage;
