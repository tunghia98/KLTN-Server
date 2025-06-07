import React, { useState, useEffect, use } from "react";
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
  const { fetchCartFromBackend } = useCart();
  const [showDiscount, setShowDiscount] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [regularPrice, setRegularPrice] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [rating, setRating] = useState([]);
  const [average, setAverage] = useState(0); // ✅ Mặc định là số
  const [count, setCount] = useState([]);
  const [promotionId, setPromotionId] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [sellerProductsCount, setSellerProductsCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [dataRating, setDataRating] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;

        // Chỉ cho phép số
        if (/^\d*$/.test(value)) {
            const num = parseInt(value, 10);

            // Nếu input rỗng hoặc là số trong khoảng hợp lệ
            if (value === '') {
                setQuantity('');
            } else if (num >= 1 && num <= product.quantity) {
                setQuantity(num);
            } else if (num > product.quantity) {
                setQuantity(product.quantity);
            }
        }
    };

    const handleBlur = () => {
        // Khi người dùng rời khỏi input, đảm bảo quantity hợp lệ
        if (quantity === '' || quantity < 1) {
            setQuantity(1);
        }
    };
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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: product.id,
            quantity: quantity,
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
        const resUser = await fetch(
          "https://kltn.azurewebsites.net/api/Users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resUser.ok) throw new Error("Không lấy được thông tin người dùng");

        const userData = await resUser.json();
        setUserInfo(userData);
        const resAddress = await fetch(
          "https://kltn.azurewebsites.net/api/addresses/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
        let recommends = [];

        if (userInfo.id) {
          // Nếu có token, lấy user info rồi fetch gợi ý cá nhân hóa
          console.log(userInfo);
          const resRecommends = await fetch(
            `https://kltn.azurewebsites.net/api/Recommendation/user/${userInfo.id}`
          );

          if (!resRecommends.ok) throw new Error("Lấy gợi ý thất bại");

          recommends = await resRecommends.json();
          console.log(recommends);
        } else {
          // Nếu không có token (không đăng nhập), fetch gợi ý chung
          const resGeneral = await fetch(
            `https://kltn.azurewebsites.net/api/Recommendation/user/0`
          );
          if (!resGeneral.ok) throw new Error("Lấy gợi ý chung thất bại");

          recommends = await resGeneral.json();
        }

        const productIds = recommends.map((p) => p.id);

        const imagesRes = await fetch(
          "https://kltn.azurewebsites.net/api/product-images/list-by-products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productIds),
          }
        );

        if (!imagesRes.ok) throw new Error("Lỗi tải ảnh sản phẩm gợi ý");

        const imagesData = await imagesRes.json();
        const recommendsWithImages = recommends.map((product) => ({
          ...product,
          imageUrls: imagesData[product.id]?.map((img) => img.imageUrl) || [],
        }));
        console.log(recommendsWithImages);
        setRecommendations(recommendsWithImages);
      } catch (err) {
        console.error("Lỗi fetch recommendations:", err);
      }
    };

    fetchRecommendations();
  }, []);
  const fetchRating = async (idProduct) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/ProductReviews/product/${idProduct}`
      );
      if (!res.ok) throw new Error("Lấy đánh giá thất bại");

      const data = await res.json();
      setDataRating(data);
      const totalRating = data.reduce((sum, item) => sum + item.rating, 0); // ✅ tính tổng rating
      const count = data.length;
      const averageRating = totalRating / count;
      return {
        data,
        count,
        averageRating,
      };
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      return {
        data: [],
        count: 0,
        averageRating: 0,
      };
    }
  };

  useEffect(() => {
    fetchRating(product.id).then((result) => {
      if (result) {
        setRating(result.data); // danh sách đánh giá
        setAverage(result.averageRating); // nếu bạn có state lưu điểm trung bình
        setCount(result.count); // nếu cần số lượng đánh giá
      }
    });
  }, [product.id]);
  // Lấy tất cả ProductPromotions cho productId (trả về mảng)
  const fetchProductPromotions = async (productId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/ProductPromotions`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      // Lọc lấy tất cả promotion của sản phẩm
      const foundData = data.filter((t) => t.productId === productId);

      console.log("Found promotions:", foundData);
      return foundData; // trả về mảng các object
    } catch (error) {
      console.error("Failed to fetch product promotions:", error);
      return [];
    }
  };

  // Lấy chi tiết các Promotion theo mảng promotionIds
  const fetchPromotion = async (promotionIds) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/promotions`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      const now = new Date();

      // Lọc promotion có id nằm trong promotionIds và hợp lệ về ngày (startDate <= now <= endDate)
      const matchedPromotions = data.filter((promotion) => {
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);

        return (
          promotionIds.includes(promotion.id) &&
          startDate <= now &&
          now <= endDate
        );
      });

      console.log("Matched promotions:", matchedPromotions);
      return matchedPromotions;
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      return [];
    }
  };
  const fetchShopPromotions = async (shopId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/StorePromotions/by-shop/${shopId}`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      console.log("Mapping list:", data);

      const now = new Date();

      // Lấy chi tiết từng promotion theo promotionId
      const detailedPromotions = await Promise.all(
        data.map(async (item) => {
          const res = await fetch(
            `https://kltn.azurewebsites.net/api/Promotions/${item.promotionId}`
          );
          if (!res.ok) return null;
          return await res.json();
        })
      );

      // Lọc các promotion hợp lệ (type === 'order' và còn hiệu lực)
      const validPromotions = detailedPromotions.filter((promo) => {
        if (!promo) return false;
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        return promo.type === "order" && startDate <= now && now <= endDate;
      });

      return validPromotions;
    } catch (error) {
      console.error("Failed to fetch shop promotions:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!product?.id || !product?.shopId) return;

    // 1. Lấy promotion sản phẩm
    fetchProductPromotions(product.id).then((productPromotions) => {
      const promotionIds = productPromotions.map((item) => item.promotionId);

      // 2. Lấy chi tiết promotion sản phẩm
      fetchPromotion(promotionIds).then((matchedPromotions) => {
        // 3. Lấy promotion của shop (type order)
        fetchShopPromotions(product.shopId).then((shopPromotions) => {
          // 4. Kết hợp cả 2 loại promotion
          const allPromotions = [...matchedPromotions, ...shopPromotions];
          setPromotions(allPromotions);
          console.log("All promotions:", allPromotions);
        });
      });
    });
  }, [product?.id, product?.shopId]);

  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [hoverImage, setHoverImage] = useState(null);
  const displayImage = hoverImage || selectedImage;

  // Tạo path SEO-friendly
  const productSlug = `${product?.id}-${toSlug(product?.name)}`;
  const sellerSlug = `${seller?.id}-${toSlug(seller?.name)}`;
  const path = `/products/${productSlug}`;
  const sellerPath = `/sellers/${sellerSlug}`;
  const fetchSellerProductsCount = async (sellerId) => {
    try {
      setLoading(true);

      // 1. Fetch products song song (hiện tại chỉ có 1 API)
      const [productRes] = await Promise.all([
        fetch(
          `https://kltn.azurewebsites.net/api/Products/by-shop/${sellerId}`
        ),
      ]);

      if (!productRes.ok) {
        throw new Error("Không thể tải dữ liệu");
      }

      const products = await productRes.json();

      // 5. Set state
      setSellerProductsCount(products?.length || 0);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSellerProductsCount(seller.id);
  }, [seller.id]);
  console.log(sellerProductsCount);
  return (
    <div className="product-detail">
      <div className="product-detail-img">
        {/* Ảnh chính */}
        <img
          src={
            hoverImage ||
            selectedImage ||
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
                className={`product-detail-thumbnail ${
                  selectedImage === imgUrl ? "active" : ""
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
                      
                      <RatingProduct value={average} count={count} />
                      <p>Số lượng: {product.quantity}</p>
            <p>Đã bán: {product.bestSeller}</p>
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
            <span>
              {sellerAddress?.district + ", " + sellerAddress?.province ||
                "Đang tải..."}
            </span>
          </div>

          <div className="delivery-to">
            <p>Giao đến</p>
            {localStorage.getItem("accessToken") ? (
              addresses.length === 0 ? (
                <span>Đang tải...</span>
              ) : (
                <span>
                  {addresses[0]?.district}, {addresses[0]?.province}
                </span>
              )
            ) : (
              <span>Chưa xác định</span>
            )}
          </div>

          <div className="delivery-fee">
            <p>Phí vận chuyển</p>
            <span>Liên hệ</span>
          </div>
        </div>

        <div className="product-promotion">
          <label className="product-detail-title">Khuyến mãi</label>
          <ul>
            {promotions.length === 0 ? (
              <li>Không có khuyến mãi</li>
            ) : (
              promotions.map((promo) => {
                let description = "";

                if (promo.type === "percent") {
                  description = `Giảm giá ${promo.value}% với mã ${promo.code}`;
                } else if (promo.type === "amount" || promo.type === "order") {
                  // giả sử loại amount là giảm tiền cố định
                  description = `Giảm giá ${promo.value.toLocaleString(
                    "vi-VN"
                  )}₫ với mã ${
                    promo.code
                  } khi hóa đơn đặt hàng trên ${promo.condition.toLocaleString(
                    "vi-VN"
                  )}đ`;
                } else {
                  description = `Mã giảm giá ${promo.code} - ${promo.type}`;
                }

                return <li key={promo.id}>{description}</li>;
              })
            )}
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
              <RatingShop seller={seller} data={dataRating} />
              <span>{sellerProductsCount} sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="product-quantity">
          <label>Số lượng:</label>
          <div className="quantity-controls">
                      <button onClick={decreaseQuantity}>-</button>
                      <input
                          type="text"
                          value={quantity}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                      />
                      <button onClick={increaseQuantity}>+</button>
          </div>
        </div>
        <div className="button-transactions">
          <button className="buy-now" onClick={handleBuyNow}>
            Mua ngay
          </button>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>

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
