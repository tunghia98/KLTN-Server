import React from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ quantity, maxQuantity = 99, onIncrease, onDecrease }) => {
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
            <button
                className="quantity-btn"
                onClick={onIncrease}
                disabled={quantity >= maxQuantity}  // disable khi đạt maxQuantity
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
