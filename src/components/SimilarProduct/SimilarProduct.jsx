import "./SimilarProduct.css";
function SimilarProduct(){
    return(
        <div className="similar-product">
                    <label className="product-detail-title">Sản phẩm thường được mua kèm</label>
                    <div className="similar-product-list">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="similar-product-list">
                                <div className="similar-product-item">
                                    <img src="logo192.png" alt="abc" />
                                    <p>Tên sản phẩm tương tự</p>
                                    <div className="similar-product-price-trans">
                                        <span>Giá tiền</span>
                                        <button>+</button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
        </div>
    )
}
export default SimilarProduct;