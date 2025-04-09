import React from "react";
import CartItem from "./CartItem";

const CartList = ({ items, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="cart-list">
        <div className="car-title-bar grid-item">
          <input type="checkbox" className="cart-item-checkbox-all" />
          <label className="cart-item-label">Chọn tất cả</label>
          <span className="cart-item-label">Đơn giá</span>
          <span className="cart-item-label">Số lượng</span>
          <span className="cart-item-label">Thành tiền</span>
          <span className="cart-item-label">Thao tác</span>
        </div>
      {items.map((item) => (
        <CartItem 
          key={item.id} 
          item={item} 
          onIncrease={onIncrease} 
          onDecrease={onDecrease} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  );
};

export default CartList;
