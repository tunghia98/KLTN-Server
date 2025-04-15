import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { RiBankCardFill } from "react-icons/ri";
import { SiZalo, SiVisa } from "react-icons/si";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import './Checkout.css';

const paymentMethods = [
  { id: "cash", label: "Thanh toán tiền mặt", icon: <RiBankCardFill /> },
  { id: "viettel", label: "Viettel Money", icon: <img src="viettel-icon.png" alt="Viettel" className="payment-icon" /> },
  { id: "zalopay", label: "Ví ZaloPay", icon: <SiZalo className="payment-icon blue" /> },
  { id: "vnpay", label: "VNPAY", icon: <MdOutlineQrCodeScanner className="payment-icon" /> },
  { id: "credit", label: "Thẻ tín dụng/ Ghi nợ", icon: <SiVisa className="payment-icon visa" /> },
  { id: "atm", label: "Thẻ ATM", icon: <FaCreditCard className="payment-icon" /> },
];

const Payment = () => {
  const location = useLocation();
  const { cartItems, quantity } = location.state;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [message, setMessage] = useState("");
  
  const handleConfirmPayment = () => {
    if (selectedMethod === "cash") {
      setMessage("Đã đặt hàng thành công, chờ người bán hàng xác nhận.");
    } else {
      setMessage("Thanh toán của bạn đã được xử lý!");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <p>Giỏ hàng của bạn hiện đang trống!</p>;
  }

  return (
    <div className="payment-container">
      <div className="payment-cart-and-method">
        <div className="payment-cart-items-section">
          <h3>Giỏ hàng:</h3>
          {cartItems && cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="payment-cart-item">
                <div className="payment-cart-item-details">
                  <img src={item.images[0]} alt={item.name} className="payment-cart-item-image" />
                  <div className="payment-cart-item-info">
                    <span className="payment-cart-item-name">{item.name}</span>
                    <span className="payment-cart-item-supplier">{item.supplier}</span>
                  </div>
                </div>
                <div className="payment-cart-item-quantity">
                  <span>Số lượng: {item.quantity}</span>
                </div>
                <div className="payment-cart-item-price">
                  <span>{item.price.toLocaleString()}₫</span>
                </div>
                <div className="payment-cart-item-total">
                  <span>Tổng: {(item.price * item.quantity).toLocaleString()}₫</span>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm trong giỏ hàng</p>
          )}
        </div>

        <h3 className="payment-title">Chọn hình thức thanh toán</h3>
        <div className="payment-methods">
          {paymentMethods && paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <label key={method.id} className="payment-method-label">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="payment-input"
                />
                <div className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}>
                  {method.icon}
                  <span>{method.label}</span>
                </div>
              </label>
            ))
          ) : (
            <p>Không có hình thức thanh toán</p>
          )}
        </div>

        {selectedMethod && (
        <button 
          className="btn btn-apply" 
          style={{ marginTop: '20px' }}
          onClick={handleConfirmPayment}
        >
          Xác nhận thanh toán
        </button>
      )}

      {message && (
        <p style={{ marginTop: '15px', color: 'green', fontWeight: 'bold' }}>
          {message}
        </p>
      )}


        {selectedMethod === "credit" && (
          <button className="add-card-btn">+ Thêm thẻ mới</button>
        )}
      </div>
    </div>
  );
};

export default Payment;
