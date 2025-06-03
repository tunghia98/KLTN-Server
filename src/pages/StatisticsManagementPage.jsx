import React, { useState } from "react";
import TotalOrders from "../modules/seller/components/Statistics/TotalOrders.jsx";
import CompletedOrders from "../modules/seller/components/Statistics/CompletedOrders.jsx";
import CancelledOrders from "../modules/seller/components/Statistics/CancelledOrders.jsx";
import RevenueStats from "../modules/seller/components/Statistics/RevenueStats.jsx";
import TopProducts from "../modules/seller/components/Statistics/TopProducts.jsx";
import RevenueByStore from "../modules/admin/components/Statistics/RevenueByStore.jsx";
import RevenueByCategory from "../modules/admin/components/Statistics/RevenueByCategory.jsx";
import "./StatisticsManagementPage.css";

// Component chung
export default function StatisticsManagement({ role = "seller" }) {

  const isAdmin = role === "admin";

  const TABS = [
    { key: "total", label: "Tổng đơn hàng" },
    { key: "completed", label: "Đơn hoàn thành" },
    { key: "cancelled", label: "Đơn đã hủy" },
    { key: "revenue", label: "Doanh thu" },
    { key: "top", label: "Top sản phẩm bán chạy" },
    ...(isAdmin
      ? [
          { key: "revenueByStore", label: "Doanh thu theo cửa hàng" },
          { key: "revenueByCategory", label: "Doanh thu theo danh mục" },
        ]
      : []),
  ];

  const tabComponents = {
    total: <TotalOrders />,
    completed: <CompletedOrders />,
    cancelled: <CancelledOrders />,
    revenue: <RevenueStats />,
    top: <TopProducts />,
    revenueByStore: <RevenueByStore />,
    revenueByCategory: <RevenueByCategory />,
  };

  const [activeTab, setActiveTab] = useState("total");

  return (
    <div className="statistics-management">
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-statistics-content">
        {tabComponents[activeTab] || <div>Không có dữ liệu tab</div>}
      </div>
    </div>
  );
}
