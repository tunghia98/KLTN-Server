import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RevenueByStore() {
  const { user } = useUser();
  const [revenueByStore, setRevenueByStore] = useState([]);

  const fetchData = async () => {
    if (user?.role !== "admin") {
      // Nếu không phải admin thì không fetch dữ liệu
      setRevenueByStore([]);
      return;
    }

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
      console.log("Revenue By Store Data:", data);
      setRevenueByStore(data);
    } catch (error) {
      console.error("Error fetching revenue by store:", error);
      setRevenueByStore([]);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Doanh thu theo cửa hàng</h2>
      <div className="revenue-by-store">
        {Array.isArray(revenueByStore) && revenueByStore.length > 0 ? (
          <ul>
            {revenueByStore.map((store) => (
              <li key={store.storeId}>
                <span>Cửa hàng: {store.storeName}</span>{" "}
                <span>Doanh thu: {store.totalRevenue} VND</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có dữ liệu doanh thu.</p>
        )}
      </div>
    </div>
  );
}
