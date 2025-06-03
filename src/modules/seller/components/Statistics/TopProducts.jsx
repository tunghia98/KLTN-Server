import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";

export default function TopProducts() {
  const { user } = useUser();
  const [topProducts, setTopProducts] = useState([]);

  const fetchData = async () => {
    try {
      let url = "";
      if (user?.role === "admin") {
        // API cho admin (ví dụ: lấy top sản phẩm toàn hệ thống)
        url = `https://kltn.azurewebsites.net/api/SystemReport/top-products`;
      } else {
        // API cho seller lấy theo shopId
        const shopId = user?.userId ? parseInt(user.userId, 10) : null;
        if (!shopId) return;
        url = `https://kltn.azurewebsites.net/api/ShopReport/${shopId}/top-products`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch top products");
      }

      const data = await response.json();
      console.log("Top Products Data:", data);
      setTopProducts(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
      setTopProducts([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h2>Sản phẩm bán chạy</h2>
      <div className="top-products">
        {Array.isArray(topProducts) && topProducts.length > 0 ? (
          <ul>
            {topProducts.map((product) => (
              <li key={product.id}>
                <span>Tên sản phẩm: {product.name}</span>{" "}
                <span>Số lượng bán: {product.quantitySold}</span>{" "}
                <span>Doanh thu: {product.revenue} VND</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
}
