import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./SellerInfoPage.css";

const SellerPage = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("default");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSort, setSelectedSort] = useState("default");

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

  // Fetch Brands from Products
  const fetchBrands = () => {
    const uniqueBrands = [...new Set(sellerProducts.map((product) => product.brand))];
    setBrands(uniqueBrands);
  };

  useEffect(() => {
    fetchSeller(sellerId);
    fetchSellerProducts();
  }, [sellerId]);

  useEffect(() => {
    fetchBrands();
  }, [sellerProducts]);

  // Handle Filter Changes
  const handlePriceFilterChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const handleBrandFilterChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  // Apply Filters and Sorting
  useEffect(() => {
    let filtered = [...sellerProducts];

    // Filter by Price
    if (selectedPrice !== "default") {
      filtered = filtered.filter((product) => {
        if (selectedPrice === "high-low") {
          return product.price >= 0; // for descending price
        } else if (selectedPrice === "low-high") {
          return product.price <= 1000000; // for ascending price
        }
        return true;
      });
    }

    // Filter by Brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // Sort by Selection
    if (selectedSort !== "default") {
      if (selectedSort === "bestseller") {
        filtered = filtered.sort((a, b) => b.sold - a.sold); // Bán chạy
      }
      if (selectedSort === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price); // Giá cao đến thấp
      }
      if (selectedSort === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price); // Giá thấp đến cao
      }
    }

    setFilteredProducts(filtered);
  }, [selectedPrice, selectedBrand, selectedSort, sellerProducts]);

  return (
    <div className="seller-page">
      <div className="seller-info">
        <h1>{seller?.name}</h1>
        <p>Thành phố: {seller?.city}</p>
        <p>Mô tả: Đây là trang của người bán chuyên cung cấp sản phẩm nông nghiệp chất lượng cao.</p>
        <button className="contact-button">Tư Vấn</button>
      </div>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="price">Lọc theo giá: </label>
          <select id="price" value={selectedPrice} onChange={handlePriceFilterChange}>
            <option value="default">Chọn giá</option>
            <option value="low-high">Giá thấp đến cao</option>
            <option value="high-low">Giá cao đến thấp</option>
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
      </div>

      <div className="seller-products">
        <h2>Sản phẩm đang bán</h2>
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p>Không có sản phẩm nào phù hợp với bộ lọc của bạn</p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
