import React from "react";
import "./Cart.css";
import QuantitySelector from "../../../../components/Common/QuantitySelector.jsx";

const CartItem = ({ item, onIncrease, onDecrease, onRemove, onToggleCheck, onToggleCheckAll }) => {
    if (!item) return null;

  return (
    <div className="cart-item grid-item">
      <input type="checkbox" className="cart-item-checkbox"   checked={item.checked}
              onChange={() => onToggleCheck(item.productId)} />

          <div className="cart-item-img-container">
              <img
                  src={
                      item.imageUrl
                          ? `https://kltn.azurewebsites.net/api/product-images/file/${item.imageUrl}`
                          : "https://kltn.azurewebsites.net/api/product-images/file/7a2843f5-2a5a-46e2-8eea-080b51bada6b.png"
                  }
                  alt={item.name}
                  className="cart-item-img"
              />
              <span className="cart-item-name">{item.name}</span>
          </div>

      <div className="cart-item-price">
        {item.price.toLocaleString()}đ
      </div>

      <div className="cart-item-quantity">
        <QuantitySelector
          quantity={item.quantity}
                  onIncrease={() => onIncrease(item.productId)}
                  onDecrease={() => onDecrease(item.productId)}
        />
      </div>

      <div className="cart-item-total">
        {(item.price * item.quantity).toLocaleString()}đ
      </div>

      <div>
              <button className="cart-item-remove" onClick={() => onRemove(item.productId)}>
          Xóa
        </button>
      </div>
    </div>
  );
};


export default CartItem;
