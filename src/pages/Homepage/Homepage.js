import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductBestSellers from "../../components/ProductBestSeller/ProductBestSeller.jsx";
import SellerCard from "../../components/Seller/SellerCard.jsx";
import ForumPreview from "../../components/Forum/ForumPreview.jsx";
import Slideshow from "../../components/Slideshow/Slideshow.jsx";
import { categories, sellers, bestsellers } from "./test.js";
import CategoryBar from "../../components/Bar/CategoryBar.jsx";
import CategoryProducts from "../../components/CategoryProducts/CategoryProducts"; // Import mới
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const selectedCategory = categories[selectedCategoryIndex];

  // Kiểm tra dữ liệu danh mục sản phẩm
  if (!categories || !Array.isArray(categories)) {
    return <p>Không có dữ liệu danh mục sản phẩm.</p>;
  }

  // Kiểm tra dữ liệu người bán
  if (!sellers || !Array.isArray(sellers)) {
    return <p>Không có dữ liệu người bán.</p>;
  }

  // Kiểm tra dữ liệu sản phẩm bán chạy
  if (!bestsellers || !Array.isArray(bestsellers)) {
    return <p>Không có dữ liệu sản phẩm bán chạy.</p>;
  }

  return (
    <div className="homepage">
      <Slideshow />

      {/* Navbar phân loại */}
      <CategoryBar categories={categories} />

      {/* Hiển thị sản phẩm bán chạy */}
      <div className="homepage-product">
        <h1 className="title">TOP SẢN PHẨM BÁN CHẠY</h1>
        <ProductBestSellers bestsellers={bestsellers} />
      </div>

      {/* Hiển thị sản phẩm theo từng danh mục */}
      <div className="homepage-category-products">
        {categories.map((category, index) => (
          <CategoryProducts key={index} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
