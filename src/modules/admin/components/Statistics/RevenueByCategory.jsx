import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function RevenueByCategory() {
  const { user } = useUser();
  const [revenueByCategory, setRevenueByCategory] = useState([]);

  const fetchData = async () => {
    if (user?.role !== "admin") {
      setRevenueByCategory([]);
      return;
    }

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
      console.log("Revenue By Category Data:", data);
      setRevenueByCategory(data);
    } catch (error) {
      console.error("Error fetching revenue by category:", error);
      setRevenueByCategory([]);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Doanh thu theo danh mục sản phẩm</h2>
      <div className="revenue-by-category">
        {Array.isArray(revenueByCategory) && revenueByCategory.length > 0 ? (
          <ul>
            {revenueByCategory.map((category) => (
              <li key={category.categoryId}>
                <span>Danh mục: {category.categoryName}</span>{" "}
                <span>Doanh thu: {category.totalRevenue} VND</span>
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
