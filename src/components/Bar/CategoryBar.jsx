import React, { useState } from "react";
import toSlug from "../../utils/toSlug.js";
import { useNavigate } from "react-router-dom";
import "./Bar.css";

function CategoryBar({ categories, setSelectedCategoryIndex }) {
  const [selectedCategoryIndex, setSelectedCategoryIndexState] = useState(0);
  const navigate = useNavigate();

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <p>Không có dữ liệu danh mục sản phẩm.</p>;
  }
  const handleClick = () => {
    // Điều hướng đến trang tất cả sản phẩm theo danh mục
    navigate(`/products/${categories.slug}`);
  }
  return (
    <div className="category-navbar">
      <h1>DANH MỤC SẢN PHẨM</h1>
      <div className="categories-navbar-detail">
        {categories.map((category, index) => {
          const path = `/products/${category.slug}`; // tạo path riêng từng danh mục

          return (
            <div className="category-detail" key={index}>
              <img className="category-thumb" src={`/${category.img}`} alt={category.name} />
              <h4 className="category-title">
                <a
                  href={path}
                  className={`category-name ${selectedCategoryIndex === index ? "active" : ""}`}
                  onClick={() => handleClick()}
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
}

export default CategoryBar;
