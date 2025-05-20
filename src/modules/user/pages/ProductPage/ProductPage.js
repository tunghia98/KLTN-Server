import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../../../components/Pagination/Pagination";
import "./ProductPage.css"; // Dùng lại CSS đẹp
import { useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
function ProductPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSort, setSelectedSort] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          fetch("https://kltn.azurewebsites.net/api/Products"),
          fetch("https://kltn.azurewebsites.net/api/Categories/used"),
          fetch("https://kltn.azurewebsites.net/api/Categories/brands"),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        const brandData = await brandRes.json();

        setProducts(productData);
        setFilteredProducts(productData);
        setCategories(categoryData);
        setBrands(brandData); // Dùng brand từ API

        // Lấy danh sách brand duy nhất
        const uniqueBrands = [...new Set(productData.map((p) => p.brand))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryName === selectedCategory
      );
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    if (searchKeyword.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedSort === "bestseller") {
      filtered.sort((a, b) => b.sold - a.sold);
    } else if (selectedSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, selectedSort, searchKeyword, products]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const current = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="seller-page">
      <h1 className="page-title">
        {categorySlug ? `Danh mục: ${categorySlug}` : "Tất cả sản phẩm"}
      </h1>

      <div className="products-filters">
        <div className="filter-item">
          <label htmlFor="category">Lọc theo danh mục:</label>
          <Autocomplete
            options={[
              { label: "Tất cả danh mục", value: "all" },
              ...categories.map((c) => ({ label: c.name, value: c.name })),
            ]}
            getOptionLabel={(option) => option.label}
            value={{
              label:
                selectedCategory === "all"
                  ? "Tất cả danh mục"
                  : selectedCategory,
              value: selectedCategory,
            }}
            onChange={(event, newValue) => {
              setSelectedCategory(newValue ? newValue.value : "all");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn danh mục"
                variant="outlined"
                size="small"
              />
            )}
            style={{ width: 250 }}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="brand">Lọc theo nhãn hiệu:</label>
          <Autocomplete
            options={[
              { label: "Tất cả nhãn hiệu", value: "all" },
              ...brands.map((b) => ({ label: b, value: b })),
            ]}
            getOptionLabel={(option) => option.label}
            value={{
              label:
                selectedBrand === "all" ? "Tất cả nhãn hiệu" : selectedBrand,
              value: selectedBrand,
            }}
            onChange={(event, newValue) => {
              setSelectedBrand(newValue ? newValue.value : "all");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn nhãn hiệu"
                variant="outlined"
                size="small"
              />
            )}
            style={{ width: 250 }}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="sort">Sắp xếp:</label>
          <select
            id="sort"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="default">Chọn sắp xếp</option>
            <option value="bestseller">Bán chạy nhất</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="price-low">Giá thấp đến cao</option>
          </select>
        </div>

        <div className="products-search-bar">
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="seller-products">
        <h2>Sản phẩm đang bán</h2>
        <div className="product-grid">
          {current.length === 0 ? (
            <p>Không có sản phẩm nào phù hợp</p>
          ) : (
            current.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredProducts.length}
        itemsPerPage={productsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default ProductPage;
