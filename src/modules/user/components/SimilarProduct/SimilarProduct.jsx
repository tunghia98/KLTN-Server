import "./SimilarProduct.css";

function SimilarProduct({ products }) {
    return (
        <div className="similar-product">
            <label className="product-detail-title">Sản phẩm tương tự</label>
            <div className="similar-product-list">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="similar-product-item">
                            <img
                                src={
                                    product.imageUrls?.[0]
                                        ? `https://kltn.azurewebsites.net/api/product-images/file/${product.imageUrls[0]}`
                                        : `https://kltn.azurewebsites.net/api/product-images/file/default.png`
                                }
                                alt={product.name}
                                className="card-img"
                            />
                            <p>{product.name}</p>
                            <div className="similar-product-price-trans">
                                <span>{product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                                <button className="">+</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm tương tự</p>
                )}
            </div>
        </div>
    );
}

export default SimilarProduct;