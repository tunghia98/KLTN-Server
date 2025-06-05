import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../../../contexts/CartContext.jsx";
import "./Checkout.css";

const Payment = ({ selectedAddressId }) => {
  const { fetchCartFromBackend } = useCart();
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [shopNames, setShopNames] = useState({});
  const navigate = useNavigate();

  // Hàm gọi API lấy tên shop theo danh sách shopIds
  const fetchShopNames = async (shopIds) => {
    const shopMap = {};

    await Promise.all(
      shopIds.map(async (id) => {
        try {
          const res = await fetch(
            `https://kltn.azurewebsites.net/api/shops/${id}`
          );
          if (res.ok) {
            const shop = await res.json();
            shopMap[id] = shop.name || `Cửa hàng #${id}`;
          } else {
            shopMap[id] = `Cửa hàng #${id}`;
          }
        } catch {
          shopMap[id] = `Cửa hàng #${id}`;
        }
      })
    );

    return shopMap;
  };

  // Khi cartItems thay đổi, lấy danh sách shopIds duy nhất và gọi API lấy tên shop
  useEffect(() => {
    if (cartItems.length === 0) return;

    const uniqueShopIds = [...new Set(cartItems.map((item) => item.shopId))];
    if (uniqueShopIds.length > 0) {
      fetchShopNames(uniqueShopIds).then(setShopNames);
    }
  }, [cartItems]);

  // Nhóm cartItems theo shopId, gán shopName và tính tổng tiền mỗi shop
  const groupedItems = useMemo(() => {
    const groups = {};
    cartItems.forEach((item) => {
      if (!groups[item.shopId]) {
        groups[item.shopId] = {
          shopName: shopNames[item.shopId] || `Shop ID: ${item.shopId}`,
          items: [],
          totalPrice: 0,
        };
      }
      groups[item.shopId].items.push(item);
      groups[item.shopId].totalPrice +=
        (item.price || 0) * (item.quantity || 0);
    });
    return groups;
  }, [cartItems, shopNames]);

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
      <div className="payment-cart-items-section">
        <h3>Giỏ hàng:</h3>
        {Object.entries(groupedItems).map(([shopId, group]) => (
          <div key={shopId} className="shop-cart-group">
            <h4 className="shop-name">{group.shopName}</h4>

            {group.items.map((item) => (
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
                    <span className="payment-cart-item-supplier">
                      {item.supplier}
                    </span>
                  </div>
                </div>
                <div className="payment-cart-item-quantity">
                  <span>{item.quantity}</span>
                </div>
                <div className="payment-cart-item-price">
                  <span>{item.price?.toLocaleString()}₫</span>
                </div>
                <div className="payment-cart-item-total">
                  <span>
                    {(item.price * item.quantity)?.toLocaleString() || "0"}₫
                  </span>
                </div>
              </div>
            ))}

            {/* Tổng tiền hiển thị phía dưới danh sách sản phẩm */}
            <div
              style={{
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "16px",
                textAlign: "right",
              }}
            >
              Tổng tiền: {group.totalPrice?.toLocaleString() || "0"}₫
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;
