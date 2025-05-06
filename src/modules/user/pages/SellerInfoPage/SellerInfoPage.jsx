import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../../../components/Pagination/Pagination";
import "./SellerInfoPage.css";

const SellerPage = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);  // New state for categories
  const [selectedCategory, setSelectedCategory] = useState("all");  // New state for selected category
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSort, setSelectedSort] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const [sellerId, ...sellerNameArray] = sellerSlug.split("-");
  const sellerNameSlug = sellerNameArray.join("-");

  // Fetch Seller Information
  const fetchSeller = async (sellerId) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/Shops/${sellerId}`);
      if (!res.ok) throw new Error("Không thể tải nhà cung cấp");
      const data = await res.json();
      if (!data) throw new Error("Không tìm thấy nhà cung cấp");
      setSeller(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Products of Seller
  const fetchSellerProducts = async () => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/Products?shopId=${sellerId}`);
      if (!res.ok) throw new Error("Không thể tải sản phẩm");
      const data = await res.json();
      if (!data) throw new Error("Không có sản phẩm");
      setSellerProducts(data);
      setFilteredProducts(data);  // Initialize filtered products
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Brands and Categories from Products
  const fetchBrandsAndCategories = () => {
    const uniqueBrands = [...new Set(sellerProducts.map((product) => product.brand))];
    const uniqueCategories = [...new Set(sellerProducts.map((product) => product.category))];  // Extract categories
    setBrands(uniqueBrands);
    setCategories(uniqueCategories);  // Set categories
  };

  useEffect(() => {
    fetchSeller(sellerId);
    fetchSellerProducts();
  }, [sellerId]);

  useEffect(() => {
    fetchBrandsAndCategories();
  }, [sellerProducts]);

  // Handle Filter Changes
  const handleCategoryFilterChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleBrandFilterChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Apply Filters and Sorting
  useEffect(() => {
    let filtered = [...sellerProducts];

    // Lọc theo danh mục (category)
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Lọc theo nhãn hiệu
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // Sắp xếp
    if (selectedSort !== "default") {
      if (selectedSort === "bestseller") {
        filtered = filtered.sort((a, b) => b.sold - a.sold);
      }
      if (selectedSort === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      }
      if (selectedSort === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      }
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedBrand, selectedSort, searchKeyword, sellerProducts]);

  return (
    <div className="seller-page">
      <div className="seller-info">
        <img
          src={
            seller?.avatarUrl
              ? `https://kltn.azurewebsites.net/api/Shops/shop-avatar/${seller.avatarUrl}`
              : "https://kltn.azurewebsites.net/api/Shops/shop-avatar/default.png"
          }
          alt={seller?.name || "Shop"}
        />
        <div className="seller-info-details">
          <h3>{seller?.name}</h3>
          <button className="contact-button">Tư Vấn</button>
          <p>Đây là trang của người bán chuyên cung cấp sản phẩm nông nghiệp chất lượng cao.</p>
        </div>
      </div>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="category">Lọc theo danh mục: </label>
          <select id="category" value={selectedCategory} onChange={handleCategoryFilterChange}>
            <option value="all">Tất cả danh mục</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="brand">Lọc theo nhãn hiệu: </label>
          <select id="brand" value={selectedBrand} onChange={handleBrandFilterChange}>
            <option value="all">Tất cả nhãn hiệu</option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="sort">Sắp xếp: </label>
          <select id="sort" value={selectedSort} onChange={handleSortChange}>
            <option value="default">Chọn sắp xếp</option>
            <option value="bestseller">Bán chạy nhất</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="price-low">Giá thấp đến cao</option>
          </select>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="seller-products">
        <h2>Sản phẩm đang bán</h2>
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p>Không có sản phẩm nào phù hợp với bộ lọc của bạn</p>
          ) : (
            currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredProducts.length}
        itemsPerPage={productsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SellerPage;
