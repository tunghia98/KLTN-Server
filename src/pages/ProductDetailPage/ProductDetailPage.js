import { useParams, useLocation } from "react-router-dom";
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import { sellers } from "../../data/data"; // Danh sách nhà cung cấp
import toSlug from "../../utils/toSlug"; // Hàm chuyển đổi thành slug

function ProductDetailPage({ products }) {
  const { productSlug } = useParams(); // Lấy productSlug từ URL

  // Tìm sản phẩm từ slug
  const product = products.find((p) => toSlug(p.name) === productSlug);

  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  // Tìm nhà cung cấp dựa trên sellerId
  const seller = sellers.find((s) => s.id === product.sellerId);

  if (!seller) return <p>Không tìm thấy nhà cung cấp.</p>;

  return (
    <div>
      <ProductDetail product={product} seller={seller} />
    </div>
  );
}

export default ProductDetailPage;
