import React, { useState } from "react";
import TotalOrders from "../../components/Statistics/TotalOrders.jsx";
import CompletedOrders from "../../components/Statistics/CompletedOrders.jsx";
import CancelledOrders from "../../components/Statistics/CancelledOrders.jsx";
import RevenueStats from "../../components/Statistics/RevenueStats.jsx";
import TopProducts from "../../components/Statistics/TopProducts.jsx";
import "./StatisticsManagementPage.css";

const TABS = [
  { key: "total", label: "Tổng đơn hàng" },
  { key: "completed", label: "Đơn hoàn thành" },
  { key: "cancelled", label: "Đơn đã hủy" },
  { key: "revenue", label: "Doanh thu" },
  { key: "top", label: "Top sản phẩm bán chạy" },
];

export default function StatisticsManagement() {
  const [activeTab, setActiveTab] = useState("total");

  const renderTab = () => {
    switch (activeTab) {
      case "total":
        return <TotalOrders />;
      case "completed":
        return <CompletedOrders />;
      case "cancelled":
        return <CancelledOrders />;
      case "revenue":
        return <RevenueStats />;
      case "top":
        return <TopProducts />;
      default:
        return null;
    }
  };
  console.log("Active Tab:", activeTab);
  console.log("Rendering Tab:", renderTab());
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
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}
