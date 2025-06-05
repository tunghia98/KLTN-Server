import React, { useMemo } from "react";

const OrderSummary = ({
  cartItems = [],
  discounts = {},
  className = "",
  shopNames = {},
}) => {
  const shopSummaries = useMemo(() => {
    const summaries = {};

    cartItems.forEach((item) => {
      const { shopId, price, quantity } = item;
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
      const promotion = discounts[shopId];

      if (promotion?.type === "percent") {
        summary.discount =
          (summary.totalBeforeDiscount * promotion.value) / 100;
      } else if (promotion?.type === "money") {
        summary.discount = promotion.value;
      }

      summary.totalAfterDiscount =
        summary.totalBeforeDiscount - summary.discount;
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

  const finalTotal = totalBeforeDiscount - totalDiscount;

  return (
    <div className={className}>
      <h3>Tóm tắt đơn hàng</h3>

      {Object.entries(shopSummaries).map(([shopId, summary]) => (
        <div key={shopId} style={{ marginBottom: "1rem" }}>
          <strong>{shopNames[shopId] || `Cửa hàng #${shopId}`}</strong>
          <div>Tạm tính: {summary.totalBeforeDiscount.toLocaleString()} đ</div>
          <div>Giảm giá: -{summary.discount.toLocaleString()} đ</div>
          <div>
            Thành tiền:{" "}
            <strong>{summary.totalAfterDiscount.toLocaleString()} đ</strong>
          </div>
        </div>
      ))}

      <hr />
      <div>Tổng tạm tính: {totalBeforeDiscount.toLocaleString()} đ</div>
      <div>Tổng giảm giá: -{totalDiscount.toLocaleString()} đ</div>
      <div>
        <strong>Tổng thành tiền: {finalTotal.toLocaleString()} đ</strong>
      </div>
    </div>
  );
};

export default OrderSummary;
