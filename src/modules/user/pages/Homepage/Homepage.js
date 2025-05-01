import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductBestSellers from "../../components/ProductBestSeller/ProductBestSeller.jsx";
import Slideshow from "../../components/Slideshow/Slideshow.jsx";
import {
  categories,
  sellers,
  bestsellers,
  products,
} from "../../../../data/data.js";
import CategoryBar from "../../components/Bar/CategoryBar.jsx";
import CategoryProducts from "../../components/CategoryProducts/CategoryProducts"; // Import mới
import Brand from "../../components/Bar/SellerBar.jsx";
import "./Homepage.css";
import toSlug from "../../../../utils/toSlug.js";
import SellerBar from "../../components/Bar/SellerBar.jsx";

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0); // Trạng thái để lưu chỉ số category được chọn
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch(
          "https://kltn.azurewebsites.net/api/categories"
        );
        if (!res.ok) throw new Error("Lỗi tải danh mục");
        let data = await res.json();
        data = data.map((item) => ({
          ...item,
          slug: item.slug ? item.slug : toSlug(item.name), // Tự động tạo slug từ name nếu chưa có
        }));
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Khi thay đổi đường dẫn, scroll lên đầu trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  // Cập nhật chỉ số category khi người dùng click vào category từ CategoryBar
  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index);
  };

  return (
    <div className="homepage">
      <Slideshow />
      <div className="homepage-product">
        <h1 className="title">TOP SẢN PHẨM BÁN CHẠY</h1>
        <ProductBestSellers bestsellers={bestsellers} products={products} />
      </div>

      {/* Navbar phân loại */}
      <CategoryBar
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* Hiển thị sản phẩm bán chạy */}

      {selectedCategory && (
        <div className="homepage-category-products">
          <CategoryProducts
            category={selectedCategory}
            products={products.filter(
              (product) => product.category === selectedCategory.name
            )}
          />
        </div>
      )}
      <SellerBar />

      {/* Hiển thị sản phẩm theo danh mục được chọn */}
    </div>
  );
};

export default Homepage;
