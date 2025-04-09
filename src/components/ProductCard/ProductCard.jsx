import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product, categoryName }) => {
    if (!product) return <p>Không có sản phẩm.</p>;

    // Tạo đường dẫn động cho từng sản phẩm
    const productLink = `/best-seller/${categoryName}/${product.name}`;

    return (
        <div className="product-card">
            <img src={product.image || "logo-final.png"} alt={product.name} className="card-img"/>
            <h3 className="card-title">
                <Link to={productLink} className="card-link">{product.name}</Link> {/* Sử dụng đường dẫn động */}
            </h3>
            <p className="card-price">${product.price || "Liên hệ"}</p>  {/* ✅ Nếu không có giá, hiển thị "Liên hệ" */}
        </div>
    );
};

export default ProductCard;
