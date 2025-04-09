import React from "react";
import { useParams } from "react-router-dom";
import { sellers, products } from "../../data/data";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./SellerPage.css";

const SellerPage = () => {
  const { sellerId } = useParams();
  const seller = sellers.find((s) => s.id === parseInt(sellerId));

  const sellerProducts = products.filter(
    (product) => product.sellerId === parseInt(sellerId)
  );

  if (!seller) {
    return <p>Không tìm thấy thông tin người bán.</p>;
  }

  return (
    <div className="seller-page">
      <div className="seller-info">
        <h1>{seller.name}</h1>
        <p>Thành phố: {seller.city}</p>
        <p>Mô tả: Đây là trang của người bán chuyên cung cấp sản phẩm nông nghiệp chất lượng cao.</p>
      </div>

      <div className="seller-products">
        <h2>Sản phẩm đang bán</h2>
        <div className="product-grid">
          {sellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
