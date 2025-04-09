import React from "react";
import "./Categories.css"
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button.jsx"
import ProductCard from "../../components/ProductCard/ProductCard"; // Giả sử bạn có một component ProductCard để hiển thị thông tin sản phẩm

const CategoryProducts = ({ category }) => {
  // Lấy tối đa 10 sản phẩm đầu tiên
  const limitedProducts = category.products.slice(0, 10);
  const navigate = useNavigate();
  const handleClick = () => {
    // Điều hướng đến trang tất cả sản phẩm theo danh mục
    navigate(`/products/${category.name}`);
  };

  return (
    <div className="category-products">
      <h2>{category.name}</h2>
      <div className="product-list">
        {limitedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Button text="Xem tất cả" onClick={handleClick} btnStyle="more"><a href={`\${category.name}`}></a></Button>
    </div>
  );
};

export default CategoryProducts;
