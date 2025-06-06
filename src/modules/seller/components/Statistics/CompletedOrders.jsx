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

export default function CompletedOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState("2025-06-01");
  const [toDate, setToDate] = useState("2025-06-30");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
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
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Lọc đơn đã giao trong khoảng thời gian
  const completedOrdersInRange = orders.filter((order) => {
    if (order.status !== "Đã giao") return false;

    const orderDate = new Date(order.orderDate);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    return orderDate >= from && orderDate <= to;
  });

  // Tổng đơn đã giao toàn thời gian
  const totalCompletedAllTime = orders.filter(
    (o) => o.status === "Đã giao"
  ).length;

  // Dữ liệu cho chart (tổng đơn đã giao theo ngày)
  const chartData = (() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const map = new Map();

    orders.forEach((order) => {
      if (order.status !== "Đã giao") return;

      const orderDate = new Date(order.orderDate);
      if (orderDate >= from && orderDate <= to) {
        const dateKey = orderDate.toLocaleDateString("vi-VN");
        map.set(dateKey, (map.get(dateKey) || 0) + 1);
      }
    });

    return Array.from(map, ([date, count]) => ({
      date,
      totalCompleted: count,
    }));
  })();

  return (
    <div className="statistics-container">
      <h2>Đơn hàng đã hoàn thành (Đã giao)</h2>

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
            <p>
              Tổng đơn đã giao toàn cửa hàng: {totalCompletedAllTime} đơn hàng
            </p>
            <p>
              Tổng đơn đã giao từ{" "}
              {new Date(fromDate).toLocaleDateString("vi-VN")} đến{" "}
              {new Date(toDate).toLocaleDateString("vi-VN")}:{" "}
              {completedOrdersInRange.length} đơn hàng
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
                dataKey="totalCompleted"
                fill="#4caf50"
                name="Đơn đã giao"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có đơn hàng đã giao trong khoảng thời gian này.</p>
        )}
      </div>
    </div>
  );
}
