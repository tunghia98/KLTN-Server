import React, { useState, useEffect } from 'react';
import "./RevenueManagementPage.css";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueSummary = () => {
  const [revenueData, setRevenueData] = useState([]);

  // Giả lập dữ liệu doanh thu hàng tháng
  useEffect(() => {
    const data = [
      { month: 'Jan', revenue: 1000 },
      { month: 'Feb', revenue: 1200 },
      { month: 'Mar', revenue: 900 },
      { month: 'Apr', revenue: 1500 },
      { month: 'May', revenue: 2000 },
    ];
    setRevenueData(data);
  }, []);

  const chartData = {
    labels: revenueData.map((data) => data.month),
    datasets: [
      {
        label: 'Doanh Thu',
        data: revenueData.map((data) => data.revenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="revenue-summary">
      <h1>Tổng Kết Doanh Thu</h1>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default RevenueSummary;
