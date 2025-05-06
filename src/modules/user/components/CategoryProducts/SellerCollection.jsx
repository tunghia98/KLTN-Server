import React from "react";
import "./Collections.css";
const SellerCollection = ({ selectedSellers, setSelectedSellers }) => {
  const sellers = ["Nguyễn Văn A", "Trần Thị B", "HTX Nông sản C", "Nông dân D"];

  const handleToggleSeller = (seller) => {
    setSelectedSellers((prev) =>
      prev.includes(seller) ? prev.filter((s) => s !== seller) : [...prev, seller]
    );
  };

  const clearAll = () => setSelectedSellers([]);

  const removeFilter = (seller) =>
    setSelectedSellers((prev) => prev.filter((s) => s !== seller));

  return (
    <div className="filter-group filter-group-brand">
      {selectedSellers.length > 0 && (
        <div className="selected-filters">
          <div className="selected-title">
            <strong>Người bán đã chọn</strong>
            <button className="clear-all" onClick={clearAll}>
              Bỏ hết ✕
            </button>
          </div>
          <div className="selected-tags">
            {selectedSellers.map((seller) => (
              <span key={seller} className="filter-tag">
                {seller}
                <button onClick={() => removeFilter(seller)}>✕</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <ul className="filter-list">
        {sellers.map((seller) => (
          <li key={seller}>
            <label>
              <input
                type="checkbox"
                checked={selectedSellers.includes(seller)}
                onChange={() => handleToggleSeller(seller)}
              />
              {seller}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerCollection;
