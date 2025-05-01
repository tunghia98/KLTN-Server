import React, { useEffect } from "react";
import { useParams} from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./SellerInfoPage.css";

const SellerPage = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = React.useState(null);
  const [sellerProducts, setSellerProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [sellerId, ...sellerNameArray] = sellerSlug.split("-");
  const sellerNameSlug = sellerNameArray.join("-");

  const fetchSeller = async (sellerId) => {
    console.log("sellerSlug:", sellerSlug);
    console.log("sellerId:", sellerId);

    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/Shops/${sellerId}`);
      if (!res.ok) throw new Error("Không thể tải nhà cung cấp");
      const data = await res.json();
      if (!data) throw new Error("Không tìm thấy nhà cung cấp");
      setSeller(data);

    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchSeller(sellerId);
  }
  , [sellerId]);
  return (
    <div className="seller-page">
      
      <div className="seller-info">
        <h1>{seller?.name}</h1>
        <p>Thành phố: {seller?.city}</p>
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
