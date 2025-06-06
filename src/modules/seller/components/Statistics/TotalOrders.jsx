import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Statistics.css";

export default function TotalOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState("2025-06-01");
  const [toDate, setToDate] = useState("2025-06-30");
  const [loading, setLoading] = useState(false);

  // shopId dùng khi cần, có thể bỏ nếu ko dùng
  const shopId = user?.shopId || 2;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const isAdmin = user.role === "admin";
      const endpoint = isAdmin
        ? "https://kltn.azurewebsites.net/api/orders"
        : "https://kltn.azurewebsites.net/api/orders/my-shop-orders";

      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) throw new Error("Lỗi khi tải đơn hàng");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Tính tổng đơn hàng trong khoảng thời gian
  const totalOrdersInRange = orders.filter((item) => {
    const orderDate = new Date(item.orderDate);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    return orderDate >= from && orderDate <= to;
  }).length;

  // Tổng đơn hàng toàn thời gian chính là length của mảng orders
  const totalOrdersAllTime = orders.length;

  // Dữ liệu cho biểu đồ
  const chartData = (() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const orderMap = new Map();

    orders.forEach((item) => {
      const orderDate = new Date(item.orderDate);
      if (orderDate >= from && orderDate <= to) {
        const dateKey = orderDate.toLocaleDateString("vi-VN");
        orderMap.set(dateKey, (orderMap.get(dateKey) || 0) + 1);
      }
    });

    return Array.from(orderMap, ([date, totalOrders]) => ({
      date,
      totalOrders,
    }));
  })();

  return (
    <div className="statistics-container">
      <h2>Tổng số đơn hàng</h2>

      <div className="date-filter">
        <label>
          Từ ngày
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </label>

        <label>
          Đến ngày
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </label>
      </div>

      <div className="total-orders">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            <p>Tổng đơn hàng toàn cửa hàng: {totalOrdersAllTime} đơn hàng</p>
            <p>
              Tổng đơn hàng từ {new Date(fromDate).toLocaleDateString("vi-VN")}{" "}
              đến {new Date(toDate).toLocaleDateString("vi-VN")}:{" "}
              {totalOrdersInRange} đơn hàng
            </p>
          </>
        )}
      </div>

      <div className="orders-chart">
        {loading ? (
          <p>Đang tải dữ liệu biểu đồ...</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalOrders"
                fill="#4CAF50"
                name="Tổng đơn"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có đơn hàng nào trong khoảng thời gian này.</p>
        )}
      </div>
    </div>
  );
}
