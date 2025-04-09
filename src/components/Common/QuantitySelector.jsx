import React from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="quantity-selector">
      <button
        className="quantity-btn"
        onClick={onDecrease}
        disabled={quantity <= 1}
      >
        –
      </button>
      <input
        type="text"
        className="quantity-input"
        value={quantity}
        readOnly
      />
      <button className="quantity-btn" onClick={onIncrease}>
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
