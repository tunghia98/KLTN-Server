import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RevenueByStore() {
  const { user } = useUser();
  const [revenueByStore, setRevenueByStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://kltn.azurewebsites.net/api/SystemReport/revenue-by-shop`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch revenue by store");
      }

      const data = await response.json();
      setRevenueByStore(data);
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra");
      setRevenueByStore([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    } else {
      setRevenueByStore([]);
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
      <h2>Doanh thu theo cửa hàng</h2>

      {loading && <p>Đang tải dữ liệu...</p>}

      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}

      {!loading && !error && revenueByStore.length === 0 && (
        <p>Không có dữ liệu doanh thu.</p>
      )}

      {!loading && !error && revenueByStore.length > 0 && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {revenueByStore.map((store) => (
            <li
              key={store.storeId}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{store.storeName}</span>
              <span>{formatCurrency(store.totalRevenue)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
