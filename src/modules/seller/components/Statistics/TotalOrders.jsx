import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function TotalOrders() {
  const { user } = useUser();
  const [totalOrders, setTotalOrders] = useState(null);

  const fetchData = async () => {
    try {
      let url = "";
      if (user?.role === "admin") {
        url = `https://kltn.azurewebsites.net/api/SystemReport/total-orders`;
      } else {
        const shopId = user?.userId ? parseInt(user.userId, 10) : null;
        if (!shopId) return;
        url = `https://kltn.azurewebsites.net/api/ShopReport/${shopId}/total-orders`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch total orders");
      }

      const data = await response.json();
      console.log("Total Orders Data:", data);
      setTotalOrders(data);
    } catch (error) {
      console.error("Error fetching total orders:", error);
      setTotalOrders(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Tổng số đơn hàng</h2>
      <div className="total-orders">
        {totalOrders && typeof totalOrders.totalOrders === "number" ? (
          <p>{totalOrders.totalOrders} đơn hàng</p>
        ) : (
          <p>Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}
