import React, { useState, useEffect, useRef } from "react";
import Button from "../../../../components/Common/Button.jsx";
import "./Checkout.css";

const Discount = ({ shops, cartItems, onApplyDiscount }) => {
  const [availablePromotions, setAvailablePromotions] = useState({});
  const [discountCodes, setDiscountCodes] = useState({});

  const prevShopsRef = useRef();
  const prevCartItemsRef = useRef();

  const fetchProductPromotions = async () => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/ProductPromotions`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch product promotions:", error);
      return [];
    }
  };

  const fetchAllPromotions = async () => {
    try {
      const [productPromotionMappings, allPromotions] = await Promise.all([
        fetchProductPromotions(),
        fetch(`https://kltn.azurewebsites.net/api/promotions`).then((res) =>
          res.ok ? res.json() : []
        ),
      ]);

      const now = new Date();
      const validPromotions = allPromotions.filter((promo) => {
        const start = new Date(promo.startDate);
        const end = new Date(promo.endDate);
        return start <= now && now <= end;
      });

      const promoMap = {};

      await Promise.all(
        shops.map(async (shop) => {
          const shopId = shop.id;
          const shopItems = cartItems.filter((item) => item.shopId === shopId);
          const shopTotal = shopItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          const productPromoIds = productPromotionMappings
            .filter((pm) =>
              shopItems.some((item) => item.productId === pm.productId)
            )
            .map((pm) => pm.promotionId);

          const productPromotions = validPromotions.filter(
            (promo) =>
              promo.type === "product" && productPromoIds.includes(promo.id)
          );

          const shopPromoRes = await fetch(
            `https://kltn.azurewebsites.net/api/StorePromotions/by-shop/${shopId}`
          );
          const shopPromoMappings = shopPromoRes.ok
            ? await shopPromoRes.json()
            : [];

          const shopPromos = await Promise.all(
            shopPromoMappings.map(async (m) => {
              try {
                const res = await fetch(
                  `https://kltn.azurewebsites.net/api/Promotions/${m.promotionId}`
                );
                return res.ok ? await res.json() : null;
              } catch {
                return null;
              }
            })
          );

          const validShopPromos = shopPromos.filter((promo) => {
            if (!promo) return false;
            const start = new Date(promo.startDate);
            const end = new Date(promo.endDate);
            const isValid = start <= now && now <= end;
            return (
              isValid &&
              (promo.type !== "order" ||
                (promo.condition && shopTotal >= Number(promo.condition)))
            );
          });

          const merged = [...validShopPromos];
          productPromotions.forEach((pp) => {
            if (!merged.some((p) => p.id === pp.id)) merged.push(pp);
          });

          // Loại trùng theo promo.code
          const uniqueByCode = Array.from(
            new Map(merged.map((promo) => [promo.code, promo])).values()
          );

          promoMap[shopId] = uniqueByCode;
        })
      );

      setAvailablePromotions(promoMap);
    } catch (err) {
      console.error("Error fetching all promotions:", err);
    }
  };

  useEffect(() => {
    const sameShops =
      JSON.stringify(shops) === JSON.stringify(prevShopsRef.current);
    const sameCart =
      JSON.stringify(cartItems) === JSON.stringify(prevCartItemsRef.current);
    if (sameShops && sameCart) return;

    prevShopsRef.current = shops;
    prevCartItemsRef.current = cartItems;

    if (shops?.length && cartItems?.length) {
      fetchAllPromotions();
    }
  }, [shops, cartItems]);

  const handleSelectChange = (shopId, value) => {
    setDiscountCodes((prev) => ({
      ...prev,
      [shopId]: value,
    }));

    const promotion = availablePromotions[shopId]?.find(
      (promo) => promo.code === value
    );
    if (onApplyDiscount) onApplyDiscount(shopId, promotion);
  };

  const handleApplyDiscount = (shopId) => {
    const code = discountCodes[shopId] || "";
    if (onApplyDiscount) onApplyDiscount(shopId, code);
  };

  return (
    <div className="discounts-section">
      <h3 className="discount-title">Chọn mã giảm giá cho từng cửa hàng</h3>
      {shops.map((shop) => {
        const shopId = shop.id;
        const shopName = shop.name;
        const shopPromos = availablePromotions[shopId] || [];

        return (
          <div key={shopId} className="discount-input-wrapper">
            <div className="shop-name-label">{shopName}</div>
            {shopPromos.length > 0 ? (
              <>
                <select
                  className="discount-code-select"
                  value={discountCodes[shopId] || ""}
                  onChange={(e) => handleSelectChange(shopId, e.target.value)}
                >
                  <option value="">Chọn mã giảm giá</option>
                  {shopPromos.map((promo) => (
                    <option key={promo.id} value={promo.code}>
                      {promo.code} - Giảm{" "}
                      {promo.type === "percent"
                        ? `${promo.value}%`
                        : promo.value.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}{" "}
                      {promo.type === "product" ? "(Sản phẩm)" : "(Đơn hàng)"}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  btnStyle="apply"
                  className="apply-discount-btn"
                  onClick={() => handleApplyDiscount(shopId)}
                >
                  Áp dụng
                </Button>
              </>
            ) : (
              <div className="no-discount-message">Không có mã giảm giá</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Discount;
