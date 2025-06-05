import React, { useMemo } from "react";
import "./Checkout.css";

const OrderSummary = ({
  cartItems = [],
  discounts = {},
  className = "",
  shopNames = {},
}) => {
  const shopSummaries = useMemo(() => {
    const summaries = {};

    cartItems.forEach((item) => {
      const shopId = String(item.shopId); // Ép shopId thành string
      const { price, quantity } = item;

      if (!summaries[shopId]) {
        summaries[shopId] = {
          items: [],
          totalBeforeDiscount: 0,
          discount: 0,
          totalAfterDiscount: 0,
        };
      }

      summaries[shopId].items.push(item);
      summaries[shopId].totalBeforeDiscount += price * quantity;
    });

    for (const shopId in summaries) {
      const summary = summaries[shopId];
      // Lấy promotion có thể là string hoặc number key
      const promotion = discounts[shopId] || discounts[Number(shopId)];

      const value = Number(promotion?.value || 0);

      // Xử lý các loại giảm giá
      if (promotion?.type === "percent") {
        summary.discount = (summary.totalBeforeDiscount * value) / 100;
      } else if (promotion?.type === "money" || promotion?.type === "order") {
        summary.discount = value;
      } else {
        summary.discount = 0;
      }

      summary.totalAfterDiscount =
        summary.totalBeforeDiscount - summary.discount;

      if (summary.totalAfterDiscount < 0) {
        summary.totalAfterDiscount = 0;
      }
    }

    return summaries;
  }, [cartItems, discounts]);

  const totalBeforeDiscount = useMemo(() => {
    return Object.values(shopSummaries).reduce(
      (sum, shop) => sum + shop.totalBeforeDiscount,
      0
    );
  }, [shopSummaries]);

  const totalDiscount = useMemo(() => {
    return Object.values(shopSummaries).reduce(
      (sum, shop) => sum + shop.discount,
      0
    );
  }, [shopSummaries]);

  // Tổng thành tiền = tổng các totalAfterDiscount
  const finalTotal = useMemo(() => {
    return Object.values(shopSummaries).reduce(
      (sum, shop) => sum + shop.totalAfterDiscount,
      0
    );
  }, [shopSummaries]);

  return (
    <div className={`order-summary ${className}`}>
      <h3>Tóm tắt đơn hàng</h3>

      {Object.entries(shopSummaries).map(([shopId, summary]) => {
        const promotion = discounts[shopId] || discounts[Number(shopId)];
        return (
          <div key={shopId} style={{ marginBottom: "1rem" }}>
            <strong>{shopNames[shopId] || `Cửa hàng #${shopId}`}</strong>
            <div>
              Tạm tính: {summary.totalBeforeDiscount.toLocaleString()} đ
            </div>
            {promotion && (
              <div>
                Giảm giá:{" "}
                {promotion.type === "percent"
                  ? `-${promotion.value}%`
                  : `-${promotion.value.toLocaleString()} đ`}{" "}
                {promotion.code && <span>({promotion.code})</span>}
              </div>
            )}
            <div>
              Thành tiền:{" "}
              <strong>{summary.totalAfterDiscount.toLocaleString()} đ</strong>
            </div>
          </div>
        );
      })}

      <hr />
      <div>Tổng tạm tính: {totalBeforeDiscount.toLocaleString()} đ</div>
      <div>Tổng giảm giá: -{totalDiscount.toLocaleString()} đ</div>
      <div>
        <strong>Tổng thanh toán: {finalTotal.toLocaleString()} đ</strong>
      </div>
    </div>
  );
};

export default OrderSummary;
