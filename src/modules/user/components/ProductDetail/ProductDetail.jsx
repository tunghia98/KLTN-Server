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
    const [recommendations, setRecommendations] = useState([]);
    const [regularPrice, setRegularPrice] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
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
  const token = localStorage.getItem("accessToken");
  if (!token) return; // Không đăng nhập thì thoát luôn, không fetch gì cả

  const fetchUserAndAddresses = async () => {
    try {
      const resUser = await fetch("https://kltn.azurewebsites.net/api/Users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resUser.ok) throw new Error("Không lấy được thông tin người dùng");

        const userData = await resUser.json();
        setUserInfo(userData);
      const resAddress = await fetch("https://kltn.azurewebsites.net/api/addresses/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resAddress.ok) throw new Error("Không lấy được địa chỉ");

      const addressData = await resAddress.json();
      setAddresses(addressData);
    } catch (err) {
      console.error("Lỗi khi fetch user hoặc địa chỉ:", err);
    }
  };

  fetchUserAndAddresses();
}, []);
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                let recommends = [];

                if (token) {
                    // Nếu có token, lấy user info rồi fetch gợi ý cá nhân hóa
                    const resUser = await fetch("https://kltn.azurewebsites.net/api/Users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!resUser.ok) throw new Error("Không lấy được thông tin người dùng");

                    const userData = await resUser.json();

                    const resRecommends = await fetch(
                        `https://kltn.azurewebsites.net/api/Recommendation/user/${userData.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    if (!resRecommends.ok) throw new Error("Lấy gợi ý thất bại");

                    recommends = await resRecommends.json();
                    console.log(recommends);
                } else {
                    // Nếu không có token (không đăng nhập), fetch gợi ý chung
                    const resGeneral = await fetch(`https://kltn.azurewebsites.net/api/Recommendation/user/0`);
                    if (!resGeneral.ok) throw new Error("Lấy gợi ý chung thất bại");

                    recommends = await resGeneral.json();
                }

                const productIds = recommends.map((p) => p.id);

                const imagesRes = await fetch("https://kltn.azurewebsites.net/api/product-images/list-by-products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productIds),
                });

                if (!imagesRes.ok) throw new Error("Lỗi tải ảnh sản phẩm gợi ý");

                const imagesData = await imagesRes.json();

                const recommendsWithImages = recommends.map((product) => {
                    const matchedImages = imagesData.filter((img) => img.productId === product.id);
                    return {
                        ...product,
                        images: matchedImages.map(
                            (img) => `https://kltn.azurewebsites.net/api/product-images/file/${img.fileName}`
                        ),
                    };
                });

                setRecommendations(recommendsWithImages);
            } catch (err) {
                console.error("Lỗi fetch recommendations:", err);
            }
        };

        fetchRecommendations();
    }, []);
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
            <span>{sellerAddress?.district +", "+ sellerAddress?.province || "Đang tải..."}</span>
          </div>

          <div className="delivery-to">
            <p>Giao đến</p>
            {localStorage.getItem("accessToken") ? (
              addresses.length === 0 ? (
                <span>Đang tải...</span>
              ) : (
                <span>{addresses[0]?.district}, {addresses[0]?.province}</span>
              )
            ) : (
              <span>Chưa xác định</span>
            )}
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
        <div className="button-transactions">
          <button className="buy-now" onClick={handleBuyNow}>Mua ngay</button>
        <button className="add-to-cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</button></div>              
        
              <SimilarProduct products={recommendations} />
      </div>

      <div className="product-description">
        <label className="product-detail-title">Mô tả sản phẩm</label>
        <div className="description-content">
          <p>{description}</p>
          <Button text="Xem thêm" type="button" btnStyle="more" />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
