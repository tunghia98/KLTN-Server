import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import ProductList from "../../components/ProductList/ProductList.jsx";
import ProductFilter from "../../components/ProductFilter/ProductFilter.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import productsData from "../../data/productsData.js";

function ProductPage() {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    const productsInCategory = productsData.filter(
      (product) => product.category === categoryName
    );
    setFilteredProducts(productsInCategory);
    setCurrentPage(1);
  }, [categoryName]);

  // ✅ Bộ lọc nâng cao
  const handleFilter = ({ crops, brands, sellers, cities, priceRange }) => {
    let filtered = productsData;

    if (categoryName) {
      filtered = filtered.filter(
        (product) => product.category === categoryName
      );
    }

    if (crops.length > 0) {
      filtered = filtered.filter((product) => crops.includes(product.name));
    }

    if (brands.length > 0) {
      filtered = filtered.filter((product) => brands.includes(product.brand));
    }

    if (sellers.length > 0) {
      filtered = filtered.filter((product) => sellers.includes(product.seller));
    }

    if (cities.length > 0) {
      filtered = filtered.filter((product) => cities.includes(product.city));
    }

    if (priceRange && priceRange.length === 2) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="product-page">
      <h1>Danh sách sản phẩm</h1>
      <div className="product-page-content">
        <div className="product-page-filter">
          <ProductFilter onFilter={handleFilter} />
        </div>
        <div className="product-page-list-and-pagination">
          <ProductList products={currentProducts} />
          <div className="product-page-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
