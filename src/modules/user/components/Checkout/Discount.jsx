import React, { useState, useEffect } from "react";
import Button from "../../../../components/Common/Button.jsx";
import "./Checkout.css";

const Discount = ({ shops, cartItems, onApplyDiscount }) => {
  const [availablePromotions, setAvailablePromotions] = useState({});
  const [discountCodes, setDiscountCodes] = useState({});

  const fetchProductPromotions = async (productId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/ProductPromotions`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      return data.filter((item) => item.productId === productId);
    } catch (error) {
      console.error("Failed to fetch product promotions:", error);
      return [];
    }
  };

  const fetchPromotionDetails = async (promotionIds) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/promotions`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const allPromotions = await res.json();

      const now = new Date();

      return allPromotions.filter((promo) => {
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        return (
          promotionIds.includes(promo.id) && startDate <= now && now <= endDate
        );
      });
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
      const mappings = await res.json();

      const detailedPromotions = await Promise.all(
        mappings.map(async (item) => {
          const res = await fetch(
            `https://kltn.azurewebsites.net/api/Promotions/${item.promotionId}`
          );
          if (!res.ok) return null;
          return await res.json();
        })
      );

      const now = new Date();

      return detailedPromotions.filter((promo) => {
        if (!promo) return false;
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        return promo.type === "order" && startDate <= now && now <= endDate;
      });
    } catch (error) {
      console.error("Failed to fetch shop promotions:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!shops || shops.length === 0) return;

    const fetchAllPromotions = async () => {
      const promoMap = {};

      for (const shop of shops) {
        const shopId = shop.id;

        const productsOfShop = cartItems.filter(
          (item) => item.shopId === shopId
        );

        let productPromotions = [];
        for (const p of productsOfShop) {
          const productPromoMappings = await fetchProductPromotions(
            p.productId
          );
          const promotionIds = productPromoMappings.map((pm) => pm.promotionId);
          const detailedPromos = await fetchPromotionDetails(promotionIds);

          productPromotions = productPromotions.concat(
            detailedPromos.filter((dp) => dp.type === "product")
          );
        }

        const shopPromotions = await fetchShopPromotions(shopId);

        const allPromotions = [...shopPromotions];
        productPromotions.forEach((pp) => {
          if (!allPromotions.some((sp) => sp.id === pp.id)) {
            allPromotions.push(pp);
          }
        });

        promoMap[shopId] = allPromotions;
      }

      setAvailablePromotions(promoMap);
    };

    fetchAllPromotions();
  }, [shops, cartItems]);

  const handleSelectChange = (shopId, value) => {
    setDiscountCodes((prev) => ({
      ...prev,
      [shopId]: value,
    }));
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
            <div className="shop-name-label">
              <strong>{shopName}</strong>
            </div>
            {shopPromos.length > 0 ? (
              <>
                <select
                  className="discount-code-select"
                  value={discountCodes[shopId] || ""}
                  onChange={(e) => handleSelectChange(shopId, e.target.value)}
                >
                  <option value="">-- Chọn mã giảm giá --</option>
                  {shopPromos.map((promo) => (
                    <option key={promo.id} value={promo.code}>
                      {promo.code} - Giảm{" "}
                      {promo.discountPercent ?? promo.discountAmount ?? "?"}
                      {promo.discountPercent ? "%" : "₫"}
                      {promo.type === "product" ? " (Sản phẩm)" : " (Đơn hàng)"}
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
