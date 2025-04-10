import React from "react";
import "./Cart.css";
import QuantitySelector from "../Common/QuantitySelector.jsx";

const CartItem = ({ item, onIncrease, onDecrease, onRemove, onToggleCheck, onToggleCheckAll  }) => {
  if (!item) return null;

  return (
    <div className="cart-item grid-item">
      <input type="checkbox" className="cart-item-checkbox"   checked={item.checked}
  onChange={() => onToggleCheck(item.id)} />

      <div className="cart-item-img-container">
        <img src={item.image} alt={item.name} className="cart-item-img" />
        <a>{item.name}</a>
      </div>

      <div className="cart-item-price">
        {item.price.toLocaleString()}đ
      </div>

      <div className="cart-item-quantity">
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
        />
      </div>

      <div className="cart-item-total">
        {(item.price * item.quantity).toLocaleString()}đ
      </div>

      <div>
        <button className="cart-item-remove" onClick={() => onRemove(item.id)}>
          Xóa
        </button>
      </div>
    </div>
  );
};


export default CartItem;
