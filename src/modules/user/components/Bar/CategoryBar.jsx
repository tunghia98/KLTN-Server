import React, { useState } from "react";
import "./Bar.css";

const CategoryBar = ({ categories, onCategoryClick }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <p>Không có dữ liệu danh mục sản phẩm.</p>;
  }

  const handleCategoryClick = (index) => {
    // Cập nhật selectedCategoryIndex khi người dùng click vào danh mục
    setSelectedCategoryIndex(index);
    // Gọi onCategoryClick từ bên ngoài để hiển thị sản phẩm tương ứng
    if (onCategoryClick) {
      onCategoryClick(index);
    }
  };

  return (
    <div className="category-navbar">
      <h1>DANH MỤC SẢN PHẨM</h1>
      <div className="categories-navbar-detail">
        {categories.map((category, index) => {
          return (
            <div className="category-detail" key={index}>
              <img
                className="category-thumb"
                src={`/${category.img}`}
                alt={category.name}
              />
              <h4 className="category-title">
                <a
                  href="#"
                  className={`category-name ${
                    selectedCategoryIndex === index ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
                    handleCategoryClick(index); // Gọi handleCategoryClick
                  }}
                >
                  {category.name}
                </a>
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
