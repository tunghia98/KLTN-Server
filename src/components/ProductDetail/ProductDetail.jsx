import { useState } from "react";
import "./ProductDetail.css";
import RatingProduct from "../Rating/RatingProduct.jsx";
import RatingSupply from "../Rating/RatingSupply.jsx";
import SimilarProduct from "../SimilarProduct/SimilarProduct.jsx";
import Button from "../Common/Button.jsx";
import { useNavigate } from "react-router-dom";
import {useCart} from "../../components/Cart/CartContext.jsx"

function ProductDetail({ product, seller }) {
  const { name, price, description } = product; // Lấy các thuộc tính từ product
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const productSellCounter = 10;

  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, 100));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleBuyNow = () => {
    navigate(`/checkout`); // Điều hướng đến trang giỏ hàng
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
    };
    addToCart(cartItem); // <-- Thêm vào context
    alert("Đã thêm vào giỏ hàng");
  };
  return (
    <div className="product-detail">
      {/* Hình ảnh sản phẩm */}
      <div className="product-detail-img">
        <img className="product-detail-img-main" src={product.image || "logo192.png"} alt={name} />
        <div className="product-detail-img-sub">
          <img src={product.image || "logo192.png"} alt={name} />
          <img src={product.image || "logo192.png"} alt={name} />
          <img src={product.image || "logo192.png"} alt={name} />
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-main-info">
        <div className="product-detail-info">
          <div className="product-name-and-brand">
            <h1>{name}</h1> {/* Hiển thị tên sản phẩm */}
          </div>
          <div className="product-rating-and-sold">
            <RatingProduct />
            <p>Đã bán: {productSellCounter}</p>
          </div>
          <div className="product-price-and-discount">
            <p className="product-final-price">{price}</p>
            <p className="product-discount">-10%</p>
            <p className="product-regular-price">Giá ban đầu</p>
          </div>
        </div>

        <div className="product-delivery-info">
          <label className="product-detail-title">Vận chuyển</label>
          <div className="delivery-from">
            <p>Giao từ</p>
            <span>{seller.location}</span> {/* Hiển thị địa chỉ nhà cung cấp */}
          </div>
          <div className="delivery-to">
            <p>Giao đến: Địa chỉ người mua</p>
            <span>Đổi</span>
          </div>
          <div className="delivery-fee">
            <p>Phí vận chuyển</p>
            <span>Miễn phí</span>
          </div>
        </div>

        <div className="product-promotion">
          <label className="product-detail-title">Khuyến mãi</label>
          <ul>
            <li>Giảm giá 10% cho đơn hàng đầu tiên</li>
            <li>Giảm giá 5% cho đơn hàng từ 2 triệu</li>
            <li>Giảm giá 5% cho đơn hàng từ 2 triệu</li>
            <li>Giảm giá 10% cho đơn hàng đầu tiên</li>
            <li>Giảm giá 5% cho đơn hàng từ 2 triệu</li>
            <li>Giảm giá 5% cho đơn hàng từ 2 triệu</li>
          </ul>
        </div>
      </div>

      {/* Khu vực giao dịch */}
      <div className="product-detail-transactions">
        <div className="product-supply">
          <img src={seller.avatar || "logo192.png"} alt={seller.name} />
          <div className="supply-information">
            <label>{seller.name}</label> {/* Hiển thị tên nhà cung cấp */}
            <div className="supply-rating-and-sold">
              <RatingSupply />
              <p>Đã bán: {productSellCounter}</p>
            </div>
          </div>
        </div>
        <div className="product-quantity">
          <label>Số lượng:</label>
          <div className="quantity-controls">
            <button onClick={decreaseQuantity}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={increaseQuantity}>+</button>
          </div>
        </div>
        <button className="buy-now" onClick={handleBuyNow}>Mua ngay</button>
        <button className="add-to-cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
        <SimilarProduct />
      </div>

      <div className="product-description">
        <label className="product-detail-title">Mô tả sản phẩm</label>
        <div className="div-gradient">
          <p>{description}</p> {/* Hiển thị mô tả sản phẩm */}
          <Button text="Xem thêm" type="button" styleType="more" />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
