import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function CompletedOrders() {
  const { user } = useUser();
  const [completedOrders, setCompletedOrders] = useState(null);

  const fetchData = async () => {
    try {
      let url = "";
      if (user?.role === "admin") {
        url = `https://kltn.azurewebsites.net/api/SystemReport/completed-orders`;
      } else {
        const shopId = user?.userId ? parseInt(user.userId, 10) : null;
        if (!shopId) return;
        url = `https://kltn.azurewebsites.net/api/ShopReport/${shopId}/completed-orders`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch completed orders");
      }

      const data = await response.json();
      console.log("Completed Orders Data:", data);
      setCompletedOrders(data);
    } catch (error) {
      console.error("Error fetching completed orders:", error);
      setCompletedOrders(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Đơn hàng đã hoàn thành</h2>
      <div className="total-orders">
        {completedOrders &&
        typeof completedOrders.totalCompletedOrders === "number" ? (
          <p>{completedOrders.totalCompletedOrders} đơn hàng đã hoàn thành</p>
        ) : (
          <p>Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}
