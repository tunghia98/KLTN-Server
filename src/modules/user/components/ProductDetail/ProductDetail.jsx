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

function ProductDetail({ product, seller, sellerAddress }) {
  const user = useUser();
  const { name, price, description, images = [], discount, id } = product;
  const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const { fetchCartFromBackend } = useCart();
  const productSellCounter = 10;
  const [showDiscount, setShowDiscount] = useState(false);
  const [userAddress, setUserAddress] = useState("");
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

    const handleBuyNow = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            alert("Vui lòng đăng nhập để mua sản phẩm.");
            navigate("/login");
            return;
        }
        navigate(`/checkout`, { state: { cartItems: [{ ...product, quantity }] } });
    };


    const handleAddToCart = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("https://kltn.azurewebsites.net/api/Cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ accessToken }`,
              },
        body: JSON.stringify({
            productId: product.id,
            quantity: 1,
        }),
          });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }
    await fetchCartFromBackend();
    alert("✅ Đã thêm vào giỏ hàng!");
} catch (err) {
    console.error("Lỗi thêm giỏ hàng:", err.message);
    alert("❌ Thêm giỏ hàng thất bại.");
}
  }; 
  useEffect(() => {
    console.log("User object:", user);
    console.log("UserId:", user?.user?.userId);
    const userId=user?.user?.userId;
    console.log(userId);
    if (user?.user?.userId) {
      fetchUserAddress();
    }
  }, [user?.userId]);

  const fetchUserAddress = async () => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/addresses/1`);
      if (!res.ok) throw new Error("Không lấy được địa chỉ");
      const data = await res.json();
      console.log("Fetched address data:", data);
      setUserAddress(data[0]);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Lỗi khi tải địa chỉ");
    }
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
              {/* Ảnh chính */}
              <img
                  src={
                      hoverImage || selectedImage ||
                      (product.imageUrls?.[0]
                          ? `https://kltn.azurewebsites.net/api/product-images/file/${product.imageUrls[0]}`
                          : "https://kltn.azurewebsites.net/api/product-images/file/7a2843f5-2a5a-46e2-8eea-080b51bada6b.png")
                  }
                  alt={product.name}
                  className="product-detail-img"
              />

              {/* Danh sách ảnh phụ */}
              
              <div className="product-detail-img-sub">
                  {product.imageUrls?.map((imgId, index) => {
                      const imgUrl = `https://kltn.azurewebsites.net/api/product-images/file/${imgId}`;
                      return (
                          <img
                              key={index}
                              src={imgUrl}
                              alt={`${product.name} ${index}`}
                              onMouseEnter={() => setHoverImage(imgUrl)}
                              onMouseLeave={() => setHoverImage(null)}
                              onClick={() => setSelectedImage(imgUrl)}
                              className={`product-detail-thumbnail ${selectedImage === imgUrl ? "active" : ""
                                  }`}
                          />
                      );
                  })}
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

          {discount > 0 && regularPrice !== null && (
            <>
              <p className="product-discount">-{discount}%</p>
              <p className="product-regular-price">
                {formatVND(Number(regularPrice.toFixed(2)))}
              </p>
            </>
          )}
        </div>

        </div>

        <div className="product-delivery-info">
          <label className="product-detail-title">Vận chuyển</label>

          <div className="delivery-from">
            <p>Giao từ</p>
            <span>{"Quận " + sellerAddress?.district +", "+ sellerAddress?.province || "Đang tải..."}</span>
          </div>

          <div className="delivery-to">
            <p>Giao đến</p>
            <span>{userAddress?.province || "Đang tải..."}</span>
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
                  <img
                      src={
                          seller?.avatarUrl
                              ? `https://kltn.azurewebsites.net/api/Shops/shop-avatar/${seller.avatarUrl}`
                              : "https://kltn.azurewebsites.net/api/Shops/shop-avatar/default.png"
                      }
                      alt={seller?.name || "Shop"}
                  />
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
