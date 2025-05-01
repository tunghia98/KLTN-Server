import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductBestSellers from "../../components/ProductBestSeller/ProductBestSeller.jsx";
import Slideshow from "../../components/Slideshow/Slideshow.jsx";
import { categories, sellers, bestsellers, products } from "../../../../data/data.js";
import CategoryBar from "../../components/Bar/CategoryBar.jsx";
import CategoryProducts from "../../components/CategoryProducts/CategoryProducts"; // Import mới
import Brand from "../../components/Bar/Brand.jsx";
import "./Homepage.css";
import toSlug from "../../../../utils/toSlug.js";
const Homepage = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetch('https://kltn.azurewebsites.net/api/categories');
                if (!res.ok) throw new Error('Lỗi tải danh mục');
                let data = await res.json();
                data = data.map(item => ({
                    ...item,
                    slug: item.slug ? item.slug : toSlug(item.name) // Tự động tạo slug từ name nếu chưa có
                }));
                setCategories(data);
            } catch (error) {
                console.error('Lỗi tải danh mục:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);
    const selectedCategory = categories[selectedCategoryIndex];
  useEffect(() => {
    // Khi path thay đổi về "/", có thể thực hiện hành động như reset state, fetch data lại...
    window.scrollTo(0, 0);
  }, [location.pathname]);




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
        <ProductBestSellers bestsellers={bestsellers} products={products} />
      </div>

      <Brand></Brand>
      {/* Hiển thị sản phẩm theo từng danh mục */}
      <div className="homepage-category-products">
        {categories.map((category, index) => (
          <CategoryProducts
            key={index}
            category={category}
            products={products}
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
