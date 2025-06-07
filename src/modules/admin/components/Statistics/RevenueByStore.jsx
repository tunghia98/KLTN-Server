import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";
import "../../../seller/components/Statistics/Statistics.css";

export default function RevenueByStore() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [fromDate, setFromDate] = useState("2025-06-01");
  const [toDate, setToDate] = useState("2025-06-30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"

  // Fetch all shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/Shops");
        if (!res.ok) throw new Error("Không thể tải cửa hàng");
        const data = await res.json();
        setShops(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchShops();
  }, []);

  // Fetch delivered orders
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

  // Revenue calculation
  const revenueByShop = (() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const shopMap = new Map();

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate >= from && orderDate <= to) {
        const key = order.shopId;
        const existing = shopMap.get(key) || {
          shopId: order.shopId,
          shopName:
            shops.find((s) => s.id === order.shopId)?.name || "Không rõ",
          totalRevenue: 0,
        };
        existing.totalRevenue += order.totalAmount || 0;
        shopMap.set(key, existing);
      }
    });

    let result = Array.from(shopMap.values());

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter((shop) =>
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort filter
    result.sort((a, b) =>
      sortOrder === "asc"
        ? a.totalRevenue - b.totalRevenue
        : b.totalRevenue - a.totalRevenue
    );

    return result;
  })();

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  return (
    <div className="statistics-container">
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

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Tìm kiếm tên cửa hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "6px", flex: 1 }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="desc">Doanh thu cao → thấp</option>
          <option value="asc">Doanh thu thấp → cao</option>
        </select>
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
