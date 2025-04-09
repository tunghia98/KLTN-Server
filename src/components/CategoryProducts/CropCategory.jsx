import React from "react";

const CropCategory = ({
  cropCategories,
  openCategory,
  toggleCategory,
  selectedCrops,
  handleCheckboxChange,
  clearAll,
  removeFilter
}) => {
  return (
    <div>
      {selectedCrops.length > 0 && (
        <div className="selected-filters">
          <div className="selected-title">
            <strong>Bạn chọn</strong>
            <button onClick={clearAll} className="clear-all">Bỏ hết ✕</button>
          </div>
          <div className="selected-tags">
            {selectedCrops.map((crop) => (
              <span key={crop} className="filter-tag">
                {crop}
                <button onClick={() => removeFilter(crop)}>✕</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <h3 className="filter-title">Lọc theo loại cây trồng</h3>
      <div className="filter-section">
        {cropCategories.map((category) => (
          <div key={category.key} className="filter-group">
            <div
              className={`filter-header ${openCategory === category.key ? "open" : ""}`}
              onClick={() => toggleCategory(category.key)}
            >
              <span>{category.name}</span>
              <span className="toggle-icon">
                {openCategory === category.key ? "−" : "+"}
              </span>
            </div>
            {openCategory === category.key && (
              <ul className="filter-list">
                {category.crops.map((crop) => (
                  <li key={crop}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedCrops.includes(crop)}
                        onChange={() => handleCheckboxChange(crop)}
                      />
                      {crop}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropCategory;
