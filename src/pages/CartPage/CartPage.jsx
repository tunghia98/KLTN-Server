import React, { useState } from "react";
import "./CartPage.css";
import CartList from "../../components/Cart/CartList";
import CartSummary from "../../components/Cart/CartSummary";
import ShippingInfo from "../../components/Checkout/ShippingInfo";
import OrderSummary from "../../components/Checkout/OrderSummary";

const initialCart = [
  { id: 1, name: "Sản phẩm A", price: 22000, quantity: 2, image: "/logo192.png" },
  { id: 2, name: "Sản phẩm B", price: 175000, quantity: 1, image: "/logo192.png" },
];

const userInfo = {
  name: "Nguyễn Hoàng Kiều Ngân",
  phone: "0859763025",
  address: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM",
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Giỏ hàng</h2>
      <div className="cart-page-main">
        <div className="cart-page-left">
          <CartList 
          items={cartItems} 
          onIncrease={(id) => updateQuantity(id, 1)} 
          onDecrease={(id) => updateQuantity(id, -1)} 
          onRemove={removeItem} 
        />
        </div>

      <div className="cart-page-right">
        <ShippingInfo user={userInfo} />
        <OrderSummary total={total} />
        <CartSummary total={total} />
      </div>

      </div>

    </div>
  );
};

export default CartPage;
