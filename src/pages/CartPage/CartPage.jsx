import React, { useState } from "react";
import "./CartPage.css";
import CartList from "../../components/Cart/CartList.jsx";
import CartSummary from "../../components/Cart/CartSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import { useCart } from "../../components/Cart/CartContext.jsx";

const userInfo = {
  name: "Nguyễn Hoàng Kiều Ngân",
  phone: "0859763025",
  address: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM",
};

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, toggleChecked, toggleCheckAll } = useCart(); // Dùng từ context
  const checkedItems = cartItems.filter((item) => item.checked);
  const total = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="cart-page">
      <h2>Giỏ hàng</h2>
      <div className="cart-page-main">
        <div className="cart-page-left">
          <CartList
            products={cartItems}
            onIncrease={(id) => updateQuantity(id, cartItems.find(item => item.id === id).quantity + 1)}
            onDecrease={(id) => updateQuantity(id, Math.max(1, cartItems.find(item => item.id === id).quantity - 1))}
            onRemove={removeFromCart}
            onToggleCheck={toggleChecked}
            onToggleCheckAll={toggleCheckAll}
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