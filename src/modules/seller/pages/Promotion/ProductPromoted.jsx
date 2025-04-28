import React, { useState } from 'react';
import './ProductPromoted.css';
import { products } from '../../../../data/data';
import SellerProductMiniCard from '../../components/Products/SellerProductMiniCard.jsx'; // Đường dẫn đến component ProductMiniCard

function ProductPromoted({ onClose, onApply }) {
    const sampleProducts = products.filter(product => product.sellerId === 1);
    const [search, setSearch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleProduct = (product) => {
        setSelectedProducts(prev => {
            const isSelected = prev.some(p => p.id === product.id);
            if (isSelected) {
                return prev.filter(p => p.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const removeProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const filteredProducts = sampleProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleApply = () => {
        onApply(selectedProducts);  // Truyền danh sách sản phẩm đã chọn về trang quản lý
        onClose();  // Đóng popup sau khi áp dụng
    };

    const handleSelectProduct = (product) => {
        toggleProduct(product); // Khi chọn sản phẩm, thêm vào danh sách selectedProducts
    };

    return (
        <div className='promoted-popup-overlay'>
            <div className='promoted-popup-content'>
                <button className='close-btn' onClick={onClose}>X</button>
                <h1 className="title">Tất cả sản phẩm</h1>

                <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />

                <div className="product-promoted-list">
                    {filteredProducts.map(product => {
                        const isSelected = selectedProducts.some(p => p.id === product.id);
                        return (
                            <SellerProductMiniCard
                                key={product.id}
                                product={product}
                                fromPromotion={true} // Đánh dấu là sản phẩm từ trang promotion
                                onClick={handleSelectProduct}  // Gọi hàm chọn sản phẩm
                            />
                        );
                    })}
                </div>

                <div className='selected-products-container'>
                    <h3>Sản phẩm đã chọn:</h3>
                    {selectedProducts.length > 0 && (
                        <div className="applied-message">
                            <ul>
                                {selectedProducts.map(product => (
                                    <li key={product.id}>
                                        {product.name}
                                        <button onClick={() => removeProduct(product.id)} className="remove-btn">Xóa</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button className='btn-apply' onClick={handleApply}>Áp dụng</button>
            </div>
        </div>
    );
}

export default ProductPromoted;
