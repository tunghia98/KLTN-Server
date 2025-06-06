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

export default function RevenueStats() {
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

  // Tính tổng doanh thu trong khoảng thời gian filter
  const totalRevenueInRange = orders.reduce((acc, order) => {
    const orderDate = new Date(order.orderDate);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    if (orderDate >= from && orderDate <= to) {
      return acc + (order.totalAmount || 0);
    }
    return acc;
  }, 0);

  // Tổng doanh thu toàn bộ đơn hàng
  const totalRevenueAllTime = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  // Dữ liệu cho biểu đồ doanh thu theo ngày
  const chartData = (() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const revenueMap = new Map();

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate >= from && orderDate <= to) {
        // key là ngày theo format dd/mm/yyyy
        const dateKey = orderDate.toLocaleDateString("vi-VN");
        revenueMap.set(
          dateKey,
          (revenueMap.get(dateKey) || 0) + (order.totalAmount || 0)
        );
      }
    });

    // Chuyển Map thành mảng object cho chart
    return Array.from(revenueMap, ([date, totalRevenue]) => ({
      date,
      totalRevenue: Math.round(totalRevenue),
    }));
  })();

  return (
    <div className="statistics-container">
      <h2>Doanh thu</h2>

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

      <div className="total-revenue">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            <p>
              Tổng doanh thu toàn cửa hàng:{" "}
              {totalRevenueAllTime.toLocaleString()} VND
            </p>
            <p>
              Tổng doanh thu từ {new Date(fromDate).toLocaleDateString("vi-VN")}{" "}
              đến {new Date(toDate).toLocaleDateString("vi-VN")}:{" "}
              {totalRevenueInRange.toLocaleString()} VND
            </p>
          </>
        )}
      </div>

      <div className="revenue-chart" style={{ width: "100%", height: 300 }}>
        {loading ? (
          <p>Đang tải dữ liệu biểu đồ...</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                allowDecimals={false}
                tickFormatter={(value) =>
                  value >= 1000
                    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : value
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(value)
                }
              />
              <Legend />
              <Bar
                dataKey="totalRevenue"
                fill="#2196F3"
                name="Doanh thu (VND)"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Không có dữ liệu doanh thu trong khoảng thời gian này.</p>
        )}
      </div>
    </div>
  );
}
