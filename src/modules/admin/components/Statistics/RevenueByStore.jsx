import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RevenueByStore() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState("2025-06-01");
  const [toDate, setToDate] = useState("2025-06-30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://kltn.azurewebsites.net/api/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) throw new Error("Lỗi khi tải đơn hàng");

        const data = await res.json();
        console.log(data);
        const deliveredOrders = data.filter((o) => o.status === "Đã giao");
        setOrders(deliveredOrders);
      } catch (err) {
        setError(err.message || "Lỗi xảy ra khi tải dữ liệu");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const revenueByShop = (() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const shopMap = new Map();
    console.log(orders);
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate >= from && orderDate <= to) {
        const key = order.shopId;
        const existing = shopMap.get(key) || {
          shopId: order.shopId,
          shopName: order.shopName,
          totalRevenue: 0,
        };
        existing.totalRevenue += order.totalAmount || 0;
        shopMap.set(key, existing);
      }
    });

    return Array.from(shopMap.values());
  })();

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  return (
    <div>
      <h2>Doanh thu theo cửa hàng</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <label>
          Từ ngày:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </label>
        <label>
          Đến ngày:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </label>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
      {!loading && !error && revenueByShop.length === 0 && (
        <p>Không có dữ liệu doanh thu trong khoảng thời gian đã chọn.</p>
      )}
      {!loading && !error && revenueByShop.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {revenueByShop.map((shop) => (
            <li
              key={shop.shopId}
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{shop.shopName}</span>
              <span>{formatCurrency(shop.totalRevenue)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
