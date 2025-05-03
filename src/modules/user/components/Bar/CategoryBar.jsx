import React, { useState, useEffect } from "react";
import "./Bar.css";

const CategoryBar = ({ categories, products, onCategoryClick }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6); // Bắt đầu với 6 danh mục

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <p>Không có dữ liệu danh mục sản phẩm.</p>;
  }

  // Tính số lượng sản phẩm trong mỗi category
  const categoryWithProductCount = categories.map((category) => {
    const productCount = products.filter(
      (product) => product.category === category.name
    ).length;
    return { ...category, productCount };
  });

  // Sắp xếp danh mục theo số lượng sản phẩm giảm dần
  categoryWithProductCount.sort((a, b) => b.productCount - a.productCount);

  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index);
    if (onCategoryClick) {
      onCategoryClick(index);
    }
  };

  const handleToggle = () => {
    setVisibleCount((prev) => {
      const nextCount = prev + 10;
      if (nextCount >= categoryWithProductCount.length) {
        return categoryWithProductCount.length; // Nếu số danh mục đã đủ, dừng lại
      }
      return nextCount;
    });
  };

  const visibleCategories = categoryWithProductCount.slice(0, visibleCount);

  return (
    <div className="category-navbar">
      <h1>DANH MỤC SẢN PHẨM</h1>

      <div className="category-tags-wrapper-container">
        <div className="category-tags-wrapper">
          {visibleCategories.map((category, index) => (
            <button
              key={index}
              className={`category-tag ${
                selectedCategoryIndex === index ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(index)}
            >
              {category.name} ({category.productCount})
            </button>
          ))}
        </div>

        {categoryWithProductCount.length > visibleCount && (
          <button className="see-more-button" onClick={handleToggle}>
            {visibleCount < categoryWithProductCount.length ? "Xem thêm" : "Thu gọn"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
