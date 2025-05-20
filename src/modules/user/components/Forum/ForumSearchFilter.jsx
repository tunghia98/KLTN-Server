import React from "react";
import "./Forum.css";

const ForumSearchFilter = ({
  categories,
  crops,
  regions,
  category,
  crop,
  region,
  searchKeyword,
  handleCategoryChange,
  handleCropChange,
  handleRegionChange,
  handleSearchChange,
}) => {
  return (
    <>
      <div className="filter-form">
        <label>Phân loại: </label>
        <select onChange={handleCategoryChange} value={category || ""}>
          <option value="">Tất cả</option>
          {categories?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <label>Giống cây trồng: </label>
        <select onChange={handleCropChange} value={crop || ""}>
          <option value="">Tất cả</option>
          {crops?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <label>Khu vực: </label>
        <select onChange={handleRegionChange} value={region || ""}>
          <option value="">Tất cả</option>
          {regions?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Nhập từ khóa "
          value={searchKeyword}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default ForumSearchFilter;
