import React from "react";
import CartItem from "./CartItem";
import "./Cart.css"

const CartList = ({
  products,
  onIncrease,
  onDecrease,
  onRemove,
  onToggleCheck,
  onToggleCheckAll,
}) => {
  const allChecked = products.length > 0 && products.every((item) => item.checked);

  return (
    <div className="cart-list">
      <div className="car-title-bar grid-item">
        <input
          type="checkbox"
          className="cart-item-checkbox-all"
          checked={allChecked}
          onChange={(e) => onToggleCheckAll(e.target.checked)}
        />
        <label className="cart-item-label">Chọn tất cả</label>
        <span className="cart-item-label">Đơn giá</span>
        <span className="cart-item-label">Số lượng</span>
        <span className="cart-item-label">Thành tiền</span>
        <span className="cart-item-label">Thao tác</span>
      </div>
      {(products || []).map((product) => (
        <CartItem
          className="grid-item"
          key={product.id}
          item={product}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
          onToggleCheck={onToggleCheck}
        />
      ))}
    </div>
  );
};

export default CartList;
