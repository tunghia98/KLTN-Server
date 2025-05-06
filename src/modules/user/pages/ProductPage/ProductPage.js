import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import ProductList from "../../components/ProductList/ProductList.jsx";
import ProductFilter from "../../components/ProductFilter/ProductFilter.jsx";
import Pagination from "../../../../components/Pagination/Pagination.jsx";
import { products, categories, sellers } from "../../../../data/data.js";

function ProductPage() {
  const { categorySlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const category = categories.find((cat) => cat.slug === categorySlug);

  useEffect(() => {
    let initialProducts;

    if (categorySlug && category) {
      // Nếu có categorySlug và tìm được danh mục
      initialProducts = products.filter(
        (product) => product.categoryId === category.id
      );
    } else if (!categorySlug) {
      // Nếu không có categorySlug → hiển thị toàn bộ
      initialProducts = products;
    } else {
      // Nếu có categorySlug nhưng không khớp → không có sản phẩm
      initialProducts = [];
    }

    setFilteredProducts(initialProducts);
    setCurrentPage(1);
  }, [categorySlug, category]);

  const handleFilter = ({
    crops,
    brands,
    sellers: sellerNames,
    cities,
    priceRange,
  }) => {
    let filtered;

    if (category) {
      filtered = products.filter(
        (product) => product.categoryId === category.id
      );
    } else {
      filtered = products;
    }

    if (crops.length > 0) {
      filtered = filtered.filter((product) => crops.includes(product.name));
    }

    if (brands.length > 0) {
      filtered = filtered.filter((product) => brands.includes(product.brand));
    }

    if (sellerNames.length > 0) {
      const selectedSellerIds = sellers
        .filter((s) => sellerNames.includes(s.name))
        .map((s) => s.id);
      filtered = filtered.filter((product) =>
        selectedSellerIds.includes(product.sellerId)
      );
    }

    if (cities.length > 0) {
      const selectedSellerIdsByCity = sellers
        .filter((s) => cities.includes(s.city))
        .map((s) => s.id);
      filtered = filtered.filter((product) =>
        selectedSellerIdsByCity.includes(product.sellerId)
      );
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="product-page">
      <h1 className="page-title">
        {categorySlug
          ? category
            ? `Danh mục: ${category.name}`
            : "Danh mục không tồn tại"
          : "Tất cả sản phẩm"}
      </h1>
      <div className="product-page-content">
        <div className="product-page-filter">
          <ProductFilter onFilter={handleFilter} />
        </div>
        <div className="product-page-list-and-pagination">
          <ProductList products={currentProducts} />
          <div className="product-page-pagination">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              itemsPerPage={productsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
