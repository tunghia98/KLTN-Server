import "./ProductCard.css";
import { Link, useNavigate } from "react-router-dom";
import formatVND from "../../../../utils/format";
import toSlug from "../../../../utils/toSlug";
import { useCart } from "../../../../contexts/CartContext";

const ProductCard = ({ product, categoryName, index }) => {
  const navigate = useNavigate(); // để chuyển hướng khi mua
  const { fetchCartFromBackend } = useCart();
    console.log(product);
  if (!product) return <p>Không có sản phẩm.</p>;

  const productLink = `/products/${product.id+"-"+toSlug(product.name)}`;

    const handleAddToCart = async () => {
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
    <div className="product-card">
          <img
              src={
                  product.imageUrls?.[0]
                      ? `https://kltn.azurewebsites.net/api/product-images/file/${product.imageUrls[0]}`
                      : `https://kltn.azurewebsites.net/api/product-images/file/7a2843f5-2a5a-46e2-8eea-080b51bada6b.png`
              }
              alt={product.name}
              className="card-img"
          />


      <h3 className="card-title">
        <Link
          to={productLink}
          state={{ product, idSeller: product.idSeller }}
          className="card-link"
        >
          {product.name}
        </Link>
      </h3>

      <p className="card-price">{formatVND(product.price) || "Liên hệ"}</p>
      <button className="btn-add-product" onClick={handleAddToCart}>+</button>
      {/* Nút mua ngay */}
      {/* <button className="buy-btn" onClick={handleBuyNow}>
        Mua ngay
      </button> */}
    </div>
  );
};

export default ProductCard;