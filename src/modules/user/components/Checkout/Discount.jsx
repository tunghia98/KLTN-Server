import React, { useState } from "react";
import Button from "../../../../components/Common/Button.jsx"
import './Checkout.css'; // Nếu bạn có styles riêng cho discount, đừng quên thêm file CSS

const Discount = () => {
  const [discountCode, setDiscountCode] = useState("");

  const handleInputChange = (e) => {
    setDiscountCode(e.target.value);
  };

  const handleApplyDiscount = () => {
    // Logic áp dụng mã giảm giá (ví dụ: kiểm tra mã và áp dụng)
    console.log("Mã giảm giá được áp dụng:", discountCode);
  };

  return (
    <div className="discounts-section">
      <h3 className="discount-title">Nhập mã giảm giá</h3>
      <div className="discount-input-wrapper">
        <input 
          type="text" 
          className="discount-code-input" 
          placeholder="Nhập mã giảm giá của bạn" 
          value={discountCode}
          onChange={handleInputChange}
        />
        <Button type="submit" btnStyle="apply" text="Áp dụng"
          className="apply-discount-btn"
          onClick={handleApplyDiscount}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );
};

export default Discount;
