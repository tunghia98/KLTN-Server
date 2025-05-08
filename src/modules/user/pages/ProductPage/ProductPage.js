import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../../../components/Pagination/Pagination";
import "./ProductPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";

// Hàm chuyển tên thành slug
const toSlug = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

function ProductPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

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
        const [productRes, categoryRes] = await Promise.all([
          fetch("https://kltn.azurewebsites.net/api/Products"),
          fetch("https://kltn.azurewebsites.net/api/Categories/used"),
        ]);

        const productData = await productRes.json();
        let categoryData = await categoryRes.json();

        // Thêm slug nếu cần
        categoryData = categoryData.map((cat) => ({
          ...cat,
          slug: toSlug(cat.name),
        }));

        setProducts(productData);
        setFilteredProducts(productData);
        setCategories(categoryData);

        const uniqueBrands = [...new Set(productData.map((p) => p.brand))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };

    fetchData();
  }, []);

  // Đồng bộ slug từ URL với selectedCategory
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const matchedCategory = categories.find((c) => c.slug === categorySlug);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.name);
      } else {
        setSelectedCategory("all");
      }
    } else {
      setSelectedCategory("all");
    }
  }, [categorySlug, categories]);

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
        {categorySlug ? `Danh mục: ${selectedCategory}` : "Tất cả sản phẩm"}
      </h1>

      <div className="filters">
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
              const value = newValue ? newValue.value : "all";
              if (value === "all") {
                navigate("/products");
              } else {
                const slug = toSlug(value);
                navigate(`/products/${slug}`);
              }
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

        <div className="search-bar">
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
