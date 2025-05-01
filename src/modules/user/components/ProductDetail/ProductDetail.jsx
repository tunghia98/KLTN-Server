import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { useCart } from "../../../../contexts/CartContext.jsx";
import SimilarProduct from "../SimilarProduct/SimilarProduct.jsx";
import RatingProduct from "../Rating/RatingProduct.jsx";
import RatingShop from "../Rating/RatingShop.jsx";
import Button from "../../../../components/Common/Button.jsx";
import formatVND from "../../../../utils/format.js";
import toSlug from "../../../../utils/toSlug.js";
import "./ProductDetail.css";

function ProductDetail({ product, seller }) {
  const user = useUser();
  const { name, price, description, images = [], discount, id } = product;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const productSellCounter = 10;
  const [showDiscount, setShowDiscount] = useState(false);
  const [regularPrice, setRegularPrice] = useState(null);

  // Cập nhật giá khi có discount
  useEffect(() => {
    if (discount === 0) {
      setShowDiscount(false);
      setRegularPrice(null);
    } else {
      setShowDiscount(true);
      const calculatedRegularPrice = (price * 100) / (100 - discount);
      setRegularPrice(calculatedRegularPrice);
    }
  }, [discount, price]);

  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, 100));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleBuyNow = () => {
    const cartItem = { ...product, quantity };
    addToCart(cartItem);
    navigate(`/checkout`, { state: { cartItems: [cartItem] } });
  };

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    addToCart(cartItem);
    alert("Đã thêm vào giỏ hàng");
  };

  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [hoverImage, setHoverImage] = useState(null);
  const displayImage = hoverImage || selectedImage;

  // Tạo path SEO-friendly
  const productSlug = `${product?.id}-${toSlug(product?.name)}`;
  const sellerSlug = `${seller?.id}-${toSlug(seller?.name)}`;
  const path = `/products/${productSlug}`;
  const sellerPath=`/sellers/${sellerSlug}`

  return (
    <div className="product-detail">
      <div className="product-detail-img">
        <img className="product-detail-img-main" src={displayImage} alt={name} />
        <div className="product-detail-img-sub">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${name} ${index}`}
              onMouseEnter={() => setHoverImage(img)}
              onMouseLeave={() => setHoverImage(null)}
              onClick={() => setSelectedImage(img)}
              className={`product-detail-thumbnail ${selectedImage === img ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="product-main-info">
        <div className="product-detail-info">
          <div className="product-name-and-brand">
            <h1>{name}</h1>
          </div>

          <div className="product-rating-and-sold">
            <RatingProduct value={4.5} count={23} />
            <p>Đã bán: {productSellCounter}</p>
          </div>

          <div className="product-price-and-discount">
            <p className="product-final-price">{formatVND(price)}</p>
            {showDiscount && (
              <>
                <p className="product-discount">-{discount}%</p>
                {regularPrice !== null && (
                  <p className="product-regular-price">
                    {formatVND(Number(regularPrice.toFixed(2)))}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="product-delivery-info">
          <label className="product-detail-title">Vận chuyển</label>

          <div className="delivery-from">
            <p>Giao từ</p>
            <span>{seller?.address || "Đang tải..."}</span>
          </div>

          <div className="delivery-to">
            <p>Giao đến</p>
            <span>{user?.address || "Đang tải..."}</span>
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
          </ul>
        </div>
      </div>

      <div className="product-detail-transactions">
        <div className="product-supply">
          <img src={seller?.avatar || ""} alt={seller?.name || "Shop"} />
          <div className="supply-information">
            <Link to={sellerPath}>{seller?.name || "Shop"}</Link>
            <div className="supply-rating-and-sold">
              <RatingShop value={3.8} count={105} size={24} />
              <span>{productSellCounter} sản phẩm</span>
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
        <SimilarProduct category={product.category} />
      </div>

      <div className="product-description">
        <label className="product-detail-title">Mô tả sản phẩm</label>
        <div className="div-gradient">
          <p>{description}</p>
          <Button text="Xem thêm" type="button" btnStyle="more" />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
