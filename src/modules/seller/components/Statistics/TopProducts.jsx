import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/UserContext";
import "./Statistics.css";

export default function TopProducts() {
  const { user } = useUser();
  const [topProducts, setTopProducts] = useState([]);
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Thêm state cho filter ngày
  const [fromDate, setFromDate] = useState("2025-06-01");
  const [toDate, setToDate] = useState("2025-06-30");

  const fetchShopId = async (ownerId) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/Shops`);
      if (!res.ok) throw new Error("Không tìm thấy cửa hàng");
      const data = await res.json();
      const foundData = data.find((s) => s.ownerId === ownerId);
      return foundData?.id || null;
    } catch (err) {
      console.error("Lỗi khi lấy Id cửa hàng:", err);
      return null;
    }
  };

  const fetchTopProducts = async (shopId) => {
    try {
      setLoading(true);
      let url = "";

      // Thêm param ngày vào URL
      const from = new Date(fromDate).toISOString();
      const to = new Date(toDate).toISOString();

      if (user?.role === "admin") {
        url = `https://kltn.azurewebsites.net/api/SystemReport/top-products?fromDate=${from}&toDate=${to}`;
      } else {
        if (!shopId) return;
        url = `https://kltn.azurewebsites.net/api/ShopReport/${shopId}/top-products?fromDate=${from}&toDate=${to}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch top products");
      }
      const responseData = await response.json();

      let data = [];
      if (user.role === "seller") {
        data = responseData; // Seller API trả về mảng luôn
      } else if (user.role === "admin") {
        data = responseData.topProducts || []; // Admin API trả về object chứa topProducts
      }

      const sortedProducts = data.sort(
        (a, b) => b.quantitySold - a.quantitySold
      );

      const getProductId = (p) => p.productId ?? p.id;
      const productIds = sortedProducts.map(getProductId);

      const imagesRes = await fetch(
        "https://kltn.azurewebsites.net/api/product-images/list-by-products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(productIds),
        }
      );

      const imagesData = await imagesRes.json();

      const withImages = sortedProducts.map((product) => {
        const id = product.productId ?? product.id;
        const name = product.productName ?? product.name;
        const imgs = imagesData?.[String(id)] || [];
        return {
          id,
          name,
          quantitySold: product.quantitySold,
          imageUrls: imgs.map((img) => img.imageUrl),
        };
      });

      setTopProducts(withImages);
    } catch (error) {
      console.error("Error fetching top products:", error);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (user?.role !== "admin") {
        const id = Number(user.userId);
        const sid = await fetchShopId(id);
        setShopId(sid);
      }
    };
    init();
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchTopProducts(null);
    }
  }, [user, fromDate, toDate]); // gọi lại khi thay đổi ngày

  useEffect(() => {
    if (user?.role !== "admin" && shopId) {
      fetchTopProducts(shopId);
    }
  }, [shopId, user, fromDate, toDate]); // gọi lại khi thay đổi ngày

  return (
    <div className="statistics-container">
      <h2>Sản phẩm bán chạy</h2>

      {/* Phần chọn thời gian */}
      <div className="date-filter">
        <label>
          Từ ngày:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </label>
        <label>
          Đến ngày:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </label>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : topProducts.length > 0 ? (
        <ul className="top-products-list">
          {topProducts.map((product, index) => (
            <li key={product.id} className="top-product-item">
              <span className="rank-number">{index + 1}</span>
              <img
                src={
                  product.imageUrls?.[0]
                    ? `https://kltn.azurewebsites.net/api/product-images/file/${product.imageUrls[0]}`
                    : "/default-product.png"
                }
                alt={product.name}
                className="product-image"
              />
              <div className="top-product-info">
                <strong>{product.name}</strong>
                <span>Số lượng bán: {product.quantitySold}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có sản phẩm nào.</p>
      )}
    </div>
  );
}
