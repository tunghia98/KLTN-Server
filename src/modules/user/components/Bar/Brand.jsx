import React from "react";
import { products } from "../../../../data/data";
import "./Bar.css"; // nếu bạn muốn style riêng

const Brand = () => {
  // Lấy danh sách brand duy nhất từ dữ liệu sản phẩm
  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  return (
    <div className="brand-bar">
      <h1 className="brand-title">Các Thương Hiệu Cung Cấp Sản Phẩm</h1>
      <div className="brand-list">
        {uniqueBrands.map((brand, index) => (
          <div key={index} className="brand-card">
            <h3>{brand}</h3>
            <p>
              {
                products.filter((product) => product.brand === brand).length
              }{" "}
              sản phẩm
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
