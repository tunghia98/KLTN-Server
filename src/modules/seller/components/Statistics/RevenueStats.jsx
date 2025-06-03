import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RevenueStats() {
  const { user } = useUser();
  const [revenue, setRevenue] = useState([]);

  const fetchData = async () => {
    try {
      let url = "";
      if (user?.role === "admin") {
        url = `https://kltn.azurewebsites.net/api/SystemReport/revenue`;
      } else {
        const shopId = user?.userId ? parseInt(user.userId, 10) : null;
        if (!shopId) return;
        url = `https://kltn.azurewebsites.net/api/ShopReport/${shopId}/revenue`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch revenue data");
      }

      const data = await response.json();
      console.log("Revenue Data:", data);
      setRevenue(data);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      setRevenue([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Doanh thu</h2>
      <div className="total-orders">
        {Array.isArray(revenue) && revenue.length > 0 ? (
          <ul>
            {revenue.map((order) => (
              <li key={order.id}>
                <span>Đơn hàng ID: {order.id}</span>{" "}
                <span>Ngày: {new Date(order.date).toLocaleDateString()}</span>{" "}
                <span>Tổng tiền: {order.totalAmount} VND</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có doanh thu.</p>
        )}
      </div>
    </div>
  );
}
