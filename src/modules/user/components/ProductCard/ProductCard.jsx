import "./ProductCard.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../../contexts/CartContext";
import { useUser } from "../../../../contexts/UserContext";
import formatVND from "../../../../utils/format";
import toSlug from "../../../../utils/toSlug";


const ProductCard = ({ product, categoryName, index }) => {
  const user = useUser(); // dùng context
  const { addToCart } = useCart(); // dùng context
  const navigate = useNavigate(); // để chuyển hướng khi mua

  if (!product) return <p>Không có sản phẩm.</p>;

  const productLink = `/products/${product.id+"-"+toSlug(product.name)}`;

  const handleAddToCart = () => {
    console.log(user);  // Kiểm tra user trong console
    
    if (!user.isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
    } else {
      const cartItem = { ...product, quantity: 1 };
      addToCart(cartItem);
      alert("Đã thêm vào giỏ hàng");
    }
  };
  


  return (
    <div className="product-card">
          <img
              src={product.images?.[0]?.imageUrl || "/abc.jpg"}
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
      <button className="btn-add-product" onClick={handleAddToCart}>+</button>
      {/* Nút mua ngay */}
      {/* <button className="buy-btn" onClick={handleBuyNow}>
        Mua ngay
      </button> */}
    </div>
  );
};

export default ProductCard;