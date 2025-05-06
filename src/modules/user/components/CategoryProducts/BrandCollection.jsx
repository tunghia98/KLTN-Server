import React from "react";
import "./Collections.css";

const BrandCollection = ({ selectedBrands = [], setSelectedBrands }) => {
  const brands = ["VinEco", "TH", "Dalat Farm", "Organic Việt", "Satra"];

  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev = []) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAll = () => setSelectedBrands([]);

  const removeFilter = (brand) =>
    setSelectedBrands((prev = []) => prev.filter((b) => b !== brand));

  return (
    <div className="filter-group filter-group-brand">

      {Array.isArray(selectedBrands) && selectedBrands.length > 0 && (
        <div className="selected-filters">
          <div className="selected-title">
            <strong>Thương hiệu đã chọn</strong>
            <button className="clear-all" onClick={clearAll}>
              Bỏ hết ✕
            </button>
          </div>
          <div className="selected-tags">
            {selectedBrands.map((brand) => (
              <span key={brand} className="filter-tag">
                {brand}
                <button onClick={() => removeFilter(brand)}>✕</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <ul className="filter-list">
        {brands.map((brand) => (
          <li key={brand}>
            <label>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleToggleBrand(brand)}
              />
              {brand}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandCollection;
