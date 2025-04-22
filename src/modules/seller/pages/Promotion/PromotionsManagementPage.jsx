import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../../contexts/UserContext";
import { promotions as allPromotions } from '../../../../data/data.js'; // Đổi tên import để tránh đụng
import ProductPromoted from './ProductPromoted';  // Import popup chọn sản phẩm
import './PromotionsManagementPage.css';

const PromotionsManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [storePromotions, setStorePromotions] = useState([]);
    const [newPromo, setNewPromo] = useState({
        code: '',
        discount_type: 'percentage',
        amount: '',
        start_date: '',
        end_date: '',
        condition: ''
    });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);  // Quản lý trạng thái popup

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }
        const filteredPromotions = allPromotions.filter(
            promo => promo.seller_id === user.id
        );
        setStorePromotions(filteredPromotions);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPromo(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPromotion = () => {
        const newPromotion = {
            id: Date.now(),
            seller_id: user.id,
            ...newPromo,
        };
        setStorePromotions(prev => [...prev, newPromotion]);

        setNewPromo({
            code: '',
            discount_type: 'percentage',
            amount: '',
            end_date: '',
            condition: ''
        });
    };

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const applySelectedProducts = (selected) => {
        setSelectedProducts(selected);
    };

    const removeProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    if (!user) return <div>Vui lòng đăng nhập để xem mã khuyến mãi.</div>;

    return (
        <div className="promotions-management-page">
            <h2>Mã khuyến mãi của cửa hàng {user.id}</h2>

            {/* Form thêm mã giảm giá mới */}
            <div className="add-promotion-form">
                <h3>Thêm mã giảm giá mới</h3>
                <input
                    type="text"
                    name="code"
                    value={newPromo.code}
                    onChange={handleChange}
                    placeholder="Mã giảm giá"
                />

                <select name="discount_type" value={newPromo.discount_type} onChange={handleChange}>
                    <option value="percentage">Phần trăm</option>
                    <option value="fixed">Cố định</option>
                </select>

                {/* Hiển thị nhập tỷ lệ phần trăm hoặc số tiền giảm tùy theo loại giảm giá */}
                {newPromo.discount_type === 'percentage' ? (
                    <div>
                        <input
                            type="number"
                            name="amount"
                            value={newPromo.amount}
                            onChange={handleChange}
                            placeholder="Số phần trăm giảm"
                        />
                        <button onClick={openPopup}>Chọn sản phẩm áp dụng khuyến mãi</button>
                    </div>
                ) : (
                    <div>
                        <input
                            type="number"
                            name="amount"
                            value={newPromo.amount}
                            onChange={handleChange}
                            placeholder="Số tiền giảm"
                        />
                        <input
                            type="text"
                            name="condition"
                            value={newPromo.condition}
                            onChange={handleChange}
                            placeholder="Giá trị đơn hàng hợp lệ"
                        />
                    </div>
                )}

                <input
                    type="date"
                    name="start_date"
                    value={newPromo.start_date}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="end_date"
                    value={newPromo.end_date}
                    onChange={handleChange}
                />
                <button onClick={handleAddPromotion}>Thêm mã giảm giá</button>
            </div>

            {/* Danh sách các mã giảm giá hiện có */}
            <div className="promotions-list">
                <h3>Danh sách mã giảm giá</h3>
                {storePromotions.length === 0 ? (
                    <p>Hiện tại chưa có mã giảm giá nào.</p>
                ) : (
                    <ul>
                        {storePromotions.map(promo => (
                            <li key={promo.id}>
                                <div>
                                    <strong>Mã: {promo.code}</strong> -
                                    Loại: <strong>{promo.discount_type}</strong> -
                                    Giảm: {promo.amount} {promo.discount_type === "percentage" ? "%" : ""}
                                </div>
                                <div>Bắt đầu: {promo.start_date}</div>
                                <div>Hết hạn: {promo.end_date}</div>
                                {promo.discount_type === "fixed" && promo.condition && (
                                    <div>Điều kiện áp dụng: {promo.condition}</div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Hiển thị sản phẩm đã chọn */}
            <div className="selected-products-container">
                <h3>Sản phẩm đã chọn:</h3>
                {selectedProducts.length > 0 ? (
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
                ) : (
                    <p>Chưa có sản phẩm nào được chọn.</p>
                )}
            </div>

            {/* Hiển thị popup nếu cần */}
            {isPopupOpen && (
                <ProductPromoted
                    onClose={closePopup}
                    onApply={applySelectedProducts}
                />
            )}
        </div>
    );
};

export default PromotionsManagementPage;
