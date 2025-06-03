import React from "react";
import { useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext";
export default function TopProducts() {
  const { user } = useUser();
    const [topProducts, setTopProducts] = React.useState([]);
    const fetchData = async (shopId) => {
      // Fetch total orders data from the API
      try {
        const response = await fetch(
          `https://kltn.azurewebsites.net/api/${shopId}/top-products`,
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
        setTopProducts(data);
      } catch (error) {
        console.error("Error fetching total orders:", error);
        return [];
      }
    };
    useEffect(() => {
      const shopId = user?.userId ? parseInt(user.userId, 10) : null;
      if (shopId) {
        fetchData(shopId).then((data) => setTopProducts(data));
      }
    }, [user.userId]);
    
  return (
    <div>
      <h2>Sản phẩm bán chạy</h2>
      <div className="top-products">
        {topProducts.length > 0 ? (
          <ul>
            {topProducts.map((product) => (
              <li key={product.id}>
                <span>Tên sản phẩm: {product.name}</span>
                <span>Số lượng bán: {product.quantitySold}</span>
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
