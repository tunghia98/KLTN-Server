import React, { useState } from "react";
import "./StatisticsDashboard.css";

const mockData = {
  topProducts: [
    { name: "Phân hữu cơ A", sold: 120 },
    { name: "Thuốc trừ sâu B", sold: 98 },
    { name: "Hạt giống C", sold: 76 },
  ],
  orders: {
    total: 500,
    completed: 450,
    cancelled: 50,
  },
  totalRevenue: 120000000,
  reportStats: {
    total: 120,
    types: {
      fraud: 45,
      policy: 30,
      other: 45,
    },
  },
  supportStats: {
    unresolved: 12,
    resolving: 5,
    resolved: 40,
  },
  revenueByStore: [
    { name: "Cửa hàng A", revenue: 45000000 },
    { name: "Cửa hàng B", revenue: 30000000 },
  ],
  revenueByCategory: [
    { category: "Vật tư", revenue: 50000000 },
    { category: "Dụng cụ", revenue: 25000000 },
    { category: "Thiết bị", revenue: 15000000 },
  ],
};

export default function StatisticsDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="stats-dashboard">
      <h2>📊 Thống kê & Báo cáo</h2>

      <div className="section">
        <h3>Sản phẩm bán chạy ({timeRange === "day" ? "Hôm nay" : timeRange === "month" ? "Tháng này" : "Năm nay"})</h3>
        <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
        <ul>
          {mockData.topProducts.map((p, i) => (
            <li key={i}>{p.name} - {p.sold} lượt bán</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>🧾 Lịch sử đơn hàng</h3>
        <p>Tổng đơn hàng: {mockData.orders.total}</p>
        <p>Hoàn thành: {mockData.orders.completed}</p>
        <p>Hủy: {mockData.orders.cancelled}</p>
      </div>

      <div className="section">
        <h3>💰 Doanh thu hệ thống</h3>
        <p>{mockData.totalRevenue.toLocaleString()} VNĐ</p>
      </div>

      <div className="section">
        <h3>📋 Thống kê báo cáo</h3>
        <p>Tổng báo cáo: {mockData.reportStats.total}</p>
        <ul>
          <li>Gian lận: {mockData.reportStats.types.fraud}</li>
          <li>Vi phạm chính sách: {mockData.reportStats.types.policy}</li>
          <li>Khác: {mockData.reportStats.types.other}</li>
        </ul>
      </div>

      <div className="section">
        <h3>🛠️ Hỗ trợ người dùng</h3>
        <p>Chưa xử lý: {mockData.supportStats.unresolved}</p>
        <p>Đang xử lý: {mockData.supportStats.resolving}</p>
        <p>Đã giải quyết: {mockData.supportStats.resolved}</p>
      </div>

      <div className="section">
        <h3>📦 Doanh thu theo cửa hàng</h3>
        <ul>
          {mockData.revenueByStore.map((store, i) => (
            <li key={i}>{store.name}: {store.revenue.toLocaleString()} VNĐ</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>📚 Doanh thu theo danh mục</h3>
        <ul>
          {mockData.revenueByCategory.map((cat, i) => (
            <li key={i}>{cat.category}: {cat.revenue.toLocaleString()} VNĐ</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
