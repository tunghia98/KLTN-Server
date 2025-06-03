import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

function CancelledOrders() {
  const { user } = useUser();
  const [cancelledOrders, setCancelledOrders] = useState([]);

  const fetchData = async () => {
    try {
      let url = "";
      if (user?.role === "admin") {
        url = `https://kltn.azurewebsites.net/api/SystemReport/cancelled-orders`;
      } else {
        const shopId = user?.userId ? parseInt(user.userId, 10) : null;
        if (!shopId) return;
        url = `https://kltn.azurewebsites.net/api/ShopReport/${shopId}/cancelled-orders`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cancelled orders");
      }

      const data = await response.json();
      console.log("Cancelled Orders Data:", data);
      setCancelledOrders(data);
    } catch (error) {
      console.error("Error fetching cancelled orders:", error);
      setCancelledOrders([]); // reset khi lỗi
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Đơn hàng đã hủy</h2>
      <div className="total-orders">
        {Array.isArray(cancelledOrders) && cancelledOrders.length > 0 ? (
          <ul>
            {cancelledOrders.map((order) => (
              <li key={order.id}>
                <span>Đơn hàng ID: {order.id}</span>{" "}
                <span>Ngày: {new Date(order.date).toLocaleDateString()}</span>{" "}
                <span>Tổng tiền: {order.totalAmount} VND</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}

export default CancelledOrders;
