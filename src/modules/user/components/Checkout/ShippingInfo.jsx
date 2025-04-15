import React from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../../../../contexts/AddressContext.jsx"; // đảm bảo đúng path

const ShippingInfo = () => {
  const navigate = useNavigate();
  const { defaultAddress } = useAddress(); // Lấy từ context

  const handleClick = () => {
    navigate("/address");
  };

  if (!defaultAddress) return <p>Chưa có địa chỉ mặc định.</p>;

  return (
    <div className="shipping-info">
      <h3>Giao tới</h3>
      <p>{defaultAddress.name} - {defaultAddress.phone}</p>
      <p>{defaultAddress.detail}</p>
      <button className="change-btn" onClick={handleClick}>Thay đổi</button>
    </div>
  );
};

export default ShippingInfo;
