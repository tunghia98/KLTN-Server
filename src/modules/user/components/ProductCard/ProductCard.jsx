import "./ProductCard.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../../contexts/CartContext";
import formatVND from "../../../../utils/format";

const ProductCard = ({ product, categoryName, index }) => {
  const { addToCart } = useCart(); // dùng context
  const navigate = useNavigate(); // để chuyển hướng khi mua

  if (!product) return <p>Không có sản phẩm.</p>;

  const productLink = `/product/${product.slug}`;

  // const handleBuyNow = () => {
  //   addToCart(product);       // thêm vào giỏ hàng
  //   navigate("/cart");        // chuyển tới trang giỏ hàng
  // };

  return (
    <div className="product-card">
      <img
        src={product.images[0]}
        alt={product.name}
        className="card-img"
      />

      <h3 className="card-title">
        <Link
          to={productLink}
          state={{ product, idSeller: product.idSeller }}
          className="card-link"
        >
          {product.name}
        </Link>
      </h3>

      <p className="card-price">{formatVND(product.price) || "Liên hệ"}</p>

      {/* Nút mua ngay */}
      {/* <button className="buy-btn" onClick={handleBuyNow}>
        Mua ngay
      </button> */}
    </div>
  );
};

export default ProductCard;