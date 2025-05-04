import React, { useEffect, useState } from "react";
import { products } from "../../../../data/data";
import toSlug from "../../../../utils/toSlug"; // Import hàm toSlug nếu có
import "./Bar.css";

const SellerBar = () => {
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);

  const fetchSellers = async () => {
    try {
      setLoadingSellers(true);
      const res = await fetch("https://kltn.azurewebsites.net/api/shops");
      if (!res.ok) throw new Error("Lỗi tải nhà bán hàng");

      let data = await res.json();
      data = data.map((item) => ({
        ...item,
        slug: item.slug ? item.slug : toSlug(item.name), // tạo slug nếu chưa có
      }));

      setSellers(data);
    } catch (error) {
      console.error("Lỗi tải nhà bán hàng:", error);
    } finally {
      setLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="seller-bar">
      <h1 className="seller-title">Các Nhà Cung Cấp Sản Phẩm</h1>
      <div className="seller-list">
        {loadingSellers ? (
          <p>Đang tải nhà bán hàng...</p>
        ) : (
          sellers.map((seller, index) => (
            <div key={index} className="seller-card">
              <h3>{seller.name}</h3>
              {/* <p>
                {
                  products.filter((product) => product.seller === seller.name)
                    .length
                }{" "}
                sản phẩm
              </p> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerBar;
