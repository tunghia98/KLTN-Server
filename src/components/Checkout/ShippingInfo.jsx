import React from "react";
import "./Checkout.css";

const ShippingInfo = ({ user }) => {
  return (
    <div className="shipping-info">
      <h3>Giao tới</h3>
      <p>{user.name} - {user.phone}</p>
      <p>{user.address}</p>
      <button className="change-btn">Thay đổi</button>
    </div>
  );
};

export default ShippingInfo;
