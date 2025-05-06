import React from "react";
import "./Collections.css";

const cropTypes = [
  "Hạt giống",
  "Phân Bón & Hóa Chất Nông Nghiệp",
  "Thiết Bị Nông Nghiệp",
  "Vật Tư Nông Nghiệp",
  "Nông sản hữu cơ",
  "Cây Cảnh",
  "Chế phẩm sinh học",
  "Khác"
];

const cropMap = {
    "Hạt giống":"hat-giong",
    "Phân Bón & Hóa Chất Nông Nghiệp":"phan-bon-hoa-chat-nong-nghiep",
    "Thiết Bị Nông Nghiệp":"thiet-bi-nong-nghiep",
    "Vật Tư Nông Nghiệp":"vat-tu-nong-nghiep",
    "Nông sản hữu cơ":"nong-san-huu-co",
    "Cây Cảnh":"cay-canh",
    "Chế phẩm sinh học":"che-pham-sinh-hoc",
    "Khác":"khac"
};

const CategoryCollection = ({ selectedCrops, setSelectedCrops }) => {
  const handleToggleCrop = (crop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const clearAll = () => setSelectedCrops([]);

  const removeFilter = (crop) =>
    setSelectedCrops((prev) => prev.filter((c) => c !== crop));

  return (
    <div className="filter-group filter-group-category-product">
      {selectedCrops.length > 0 && (
        <div className="selected-filters">
          <div className="selected-title">
            <strong>Đã chọn</strong>
            <button className="clear-all" onClick={clearAll}>
              Bỏ hết ✕
            </button>
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

      <ul className="filter-list">
        {cropTypes.map((crop) => (
          <li key={crop}>
            <label>
              <input
                type="checkbox"
                checked={selectedCrops.includes(crop)}
                onChange={() => handleToggleCrop(crop)}
              />
              {crop}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryCollection;
