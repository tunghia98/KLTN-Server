import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import ProductList from "../../components/ProductList/ProductList.jsx";
import ProductFilter from "../../components/ProductFilter/ProductFilter.jsx";
import Pagination from "../../../../components/Pagination/Pagination.jsx";
import { products, bestsellers, categories, sellers } from "../../../../data/data.js";

function ProductPage() {
  const { categorySlug } = useParams(); // 💡 Đổi tên từ categoryName thành categorySlug
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const category = categories.find((cat) => cat.slug === categorySlug); // 💡 Tìm category theo slug

  useEffect(() => {
    if (category) {
      const productsInCategory = products.filter(
        (product) => product.categoryId === category.id
      );
      setFilteredProducts(productsInCategory);
    } else {
      setFilteredProducts([]);
    }
    setCurrentPage(1);
  }, [category]);

  const handleFilter = ({
    crops,
    brands,
    sellers: sellerNames,
    cities,
    priceRange,
  }) => {
    let filtered = category
      ? products.filter((product) => product.categoryId === category.id)
      : products;

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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="product-page">
      <h1>
        {category ? `Danh mục: ${category.name}` : "Danh mục không tồn tại"}
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
