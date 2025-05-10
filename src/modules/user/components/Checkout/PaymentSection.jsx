import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { RiBankCardFill } from "react-icons/ri";
import { SiZalo, SiVisa } from "react-icons/si";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { useCart } from "../../../../contexts/CartContext.jsx";
import './Checkout.css';

const paymentMethods = [
  { id: "cash", label: "Thanh toán tiền mặt", icon: <RiBankCardFill /> },
  { id: "viettel", label: "Viettel Money", icon: <img src="viettel-icon.png" alt="Viettel" className="payment-icon" /> },
  { id: "zalopay", label: "Ví ZaloPay", icon: <SiZalo className="payment-icon blue" /> },
  { id: "vnpay", label: "VNPAY", icon: <MdOutlineQrCodeScanner className="payment-icon" /> },
  { id: "credit", label: "Thẻ tín dụng/ Ghi nợ", icon: <SiVisa className="payment-icon visa" /> },
  { id: "atm", label: "Thẻ ATM", icon: <FaCreditCard className="payment-icon" /> },
];

const Payment = ({selectedAddressId }) => {
    const { fetchCartFromBackend } = useCart();
  const location = useLocation();
    const [cartItems, setCartItems] = useState(location.state.cartItems);
    const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [message, setMessage] = useState("");
    console.log(cartItems);
    const handleConfirmPayment = async () => {
        if (!selectedMethod) {
            alert("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Bạn chưa đăng nhập.");
            return;
        }

        // 1. Nhóm các item theo shopId
        const groupedOrders = {};
        cartItems.forEach(item => {
            const shopId = item.shopId;
            if (!groupedOrders[shopId]) {
                groupedOrders[shopId] = [];
            }
            groupedOrders[shopId].push(item);
        });
        try {
            // 2. Gửi từng đơn theo từng shop
            for (const shopId in groupedOrders) {
                const items = groupedOrders[shopId];
                const orderItems = items.map(item => ({
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                }));

                const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

                const response = await fetch("https://kltn.azurewebsites.net/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        shopId,
                        items: orderItems,
                        method: selectedMethod,
                        totalAmount,
                        shippingAddressId: selectedAddressId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Lỗi khi tạo đơn hàng cho shop ${shopId}`);
                }
                for (const item of items) {
                    // Kiểm tra nếu productId hợp lệ (không phải null hoặc undefined)
                    if (!item.productId) {
                        continue; // Bỏ qua việc xóa nếu không có productId
                    }

                    // Gửi yêu cầu xóa sản phẩm khỏi giỏ hàng
                    const deleteResponse = await fetch(`https://kltn.azurewebsites.net/api/cart/${item.productId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!deleteResponse.ok) {
                        throw new Error(`Lỗi khi xóa sản phẩm ${item.productId} khỏi giỏ hàng`);
                    }
                }
            }
            setCartItems([]);
            fetchCartFromBackend();
            setMessage("✅ Đã đặt hàng thành công cho tất cả cửa hàng!");
            setTimeout(() => navigate("/"), 5000);
        } catch (err) {
            console.error(err);
            setMessage("❌ Có lỗi xảy ra khi đặt hàng.");
        }
    };


    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="payment-container full-width-center">
                <div className="empty-cart-box">
                    <span className="empty-icon">🛒</span>
                    <h3>Giỏ hàng của bạn đang trống</h3>
                    <p>Hãy chọn một vài sản phẩm để bắt đầu mua sắm!</p>
                    <button className="btn-primary" onClick={() => navigate("/products")}>
                        👉 Xem sản phẩm
                    </button>
                </div>
            </div>
        );
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
                        <img
                            src={
                                item.imageUrls?.[0]
                                    ? `https://kltn.azurewebsites.net/api/product-images/file/${item.imageUrls[0]}`
                                    : item.imageUrl
                                        ? `https://kltn.azurewebsites.net/api/product-images/file/${item.imageUrl}`
                                        : "https://kltn.azurewebsites.net/api/product-images/file/7a2843f5-2a5a-46e2-8eea-080b51bada6b.png"
                            }
                            alt={item.name}
                            className="cart-item-img"
                        />
                  <div className="payment-cart-item-info">
                    <span className="payment-cart-item-name">{item.name}</span>
                    <span className="payment-cart-item-supplier">{item.supplier}</span>
                  </div>
                </div>
                <div className="payment-cart-item-quantity">
                  <span>{item.quantity}</span>
                </div>
                <div className="payment-cart-item-price">
                  <span>{item.price.toLocaleString()}₫</span>
                </div>
                <div className="payment-cart-item-total">
                  <span>{(item.price * item.quantity).toLocaleString()}₫</span>
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
