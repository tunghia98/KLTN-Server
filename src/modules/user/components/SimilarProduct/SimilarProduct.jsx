import "./SimilarProduct.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../contexts/CartContext";
import toSlug from "../../../../utils/toSlug";

function SimilarProduct({ products }) {
  const navigate = useNavigate();
  const { fetchCartFromBackend } = useCart();

  const handleAddToCart = async (product) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/Cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      await fetchCartFromBackend();
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err.message);
      alert("❌ Thêm giỏ hàng thất bại.");
    }
  };

  return (
    <div className="similar-product">
      <label className="product-detail-title">Sản phẩm gợi ý</label>
      <div className="similar-product-list">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="similar-product-item"
              onClick={() =>
                navigate(`/products/${product?.id}-${toSlug(product?.name)}`)
              }
            >
              <img
                src={
                  product.imageUrls?.[0]
                    ? `https://kltn.azurewebsites.net/api/product-images/file/${product.imageUrls[0]}`
                    : `https://kltn.azurewebsites.net/api/product-images/file/default.png`
                }
                alt={product.name}
                className="card-img"
              />
              <p title={product.name}>{product.name}</p>
              <div className="similar-product-price-trans">
                <span>
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <button onClick={() => handleAddToCart(product)}>+</button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm gợi ý</p>
        )}
      </div>
    </div>
  );
}

export default SimilarProduct;
