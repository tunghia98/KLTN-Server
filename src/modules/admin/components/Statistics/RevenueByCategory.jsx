import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RevenueByCategory() {
  const { user } = useUser();
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (user?.role !== "admin") {
      setRevenueByCategory([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://kltn.azurewebsites.net/api/SystemReport/revenue-by-category`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch revenue by category");
      }

      const data = await response.json();
      setRevenueByCategory(data);
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra");
      setRevenueByCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  // Format tiền VND cho hiển thị
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div>
      <h2>Doanh thu theo danh mục sản phẩm</h2>

      {loading && <p>Đang tải dữ liệu...</p>}

      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}

      {!loading && !error && revenueByCategory.length === 0 && (
        <p>Không có dữ liệu doanh thu.</p>
      )}

      {!loading && !error && revenueByCategory.length > 0 && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {revenueByCategory.map((category) => (
            <li
              key={category.categoryId}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {category.categoryName}
              </span>
              <span>{formatCurrency(category.totalRevenue)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
