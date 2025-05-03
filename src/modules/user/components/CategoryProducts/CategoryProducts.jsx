import React from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Common/Button";
import ProductCard from "../../components/ProductCard/ProductCard";

const CategoryProducts = ({ category, products }) => {
  const navigate = useNavigate();

  // Lọc sản phẩm theo danh mục
  const filteredProducts = products.filter(
    (product) => product.categoryId === category.id
  );

  // Giới hạn 10 sản phẩm đầu tiên
  const limitedProducts = filteredProducts.slice(0, 10);

  const handleClick = () => {
    navigate(`/products/${category.slug}`);
  };

  return (
    <div className="category-products">
      <div className="category-label-tag">{category.name}</div>
      <div className="product-list">
        {limitedProducts.length > 0 ? (
          limitedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        )}
      </div>
      <Button text="Xem tất cả" onClick={handleClick} btnStyle="more" />
    </div>
  );
};

export default CategoryProducts;
