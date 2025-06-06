import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../contexts/UserContext";
import "./Statistics.css";

export default function TopProducts() {
  const { user } = useUser();
  const [topProducts, setTopProducts] = useState([]);
  const [shopId, setShopId] = useState(null);
  const didMount = useRef(false);
  const [loading, setLoading] = useState(false);

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

      if (user?.role === "admin") {
        url = `https://kltn.azurewebsites.net/api/SystemReport/top-products`;
      } else {
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
      // data là mảng sản phẩm
      // Sắp xếp giảm dần theo quantitySold
      const sortedProducts = data.sort(
        (a, b) => b.quantitySold - a.quantitySold
      );

      const productIds = sortedProducts.map((p) => p.id);

      // Fetch images
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
        const imgs = imagesData?.[String(product.id)] || [];
        return {
          ...product,
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
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (user?.role === "admin") {
      fetchTopProducts(null);
    } else if (shopId) {
      fetchTopProducts(shopId);
    }
  }, [shopId, user]);

  return (
    <div className="statistics-container">
      <h2>Sản phẩm bán chạy</h2>
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
