import React from "react";
import { useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext";

function CancelledOrders() {
const { user } = useUser();
  const [cancelledOrders, setCancelledOrders] = React.useState([]);
  const fetchData = async (shopId) => {
    // Fetch total orders data from the API
    try {
      const response = await fetch(
        `https://kltn.azurewebsites.net/api/${shopId}/cancelled-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch total orders");
      }
      const data = await response.json();
      console.log("Total Orders Data:", data);
      setCancelledOrders(data);
    } catch (error) {
      console.error("Error fetching total orders:", error);
      return [];
    }
  };
  useEffect(() => {
    const shopId = user?.userId ? parseInt(user.userId, 10) : null;
    if (shopId) {
      fetchData(shopId).then((data) => setCancelledOrders(data));
    }
  }, [user.userId]);
  
  return (
    <div>
      <h2>Đơn hàng đã hủy</h2>
      <div className="total-orders">
        {cancelledOrders.length > 0 ? (
          <ul>
            {cancelledOrders.map((order) => (
              <li key={order.id}>
                <span>Đơn hàng ID: {order.id}</span>
                <span>Ngày: {new Date(order.date).toLocaleDateString()}</span>
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
