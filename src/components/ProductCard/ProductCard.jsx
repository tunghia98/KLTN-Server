import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product, categoryName, index }) => {
  if (!product) return <p>Không có sản phẩm.</p>;

  // Sử dụng product.slug cho đường dẫn động
  const productLink = `/product/${product.slug}`;

  return (
    <div className="product-card">
      <img
        src={product.image || "logo-2.png"}
        alt={product.name}
        className="card-img"
      />
      <h3 className="card-title">
        <Link
          to={productLink} // Đường dẫn sử dụng slug sản phẩm
          state={{ product, idSeller:product.idSeller }} // Truyền state sản phẩm cho trang chi tiết
          className="card-link"
        >
          {product.name}
        </Link>
      </h3>
      <p className="card-price">${product.price || "Liên hệ"}</p>
    </div>
  );
};

export default ProductCard;
