import React, { useEffect, useState } from 'react';
import { useUser } from "../../../../contexts/UserContext";
import { promotions as allPromotions } from '../../../../data/data.js'; // Đổi tên import để tránh đụng
import './PromotionsManagementPage.css';

const PromotionsManagementPage = () => {
  const { user } = useUser();
  const [storePromotions, setStorePromotions] = useState([]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discount_type: 'percentage',
    amount: '',
    end_date: '',
    condition: '' // Điều kiện áp dụng cho mã giảm giá
  });

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
              placeholder="Điều kiện áp dụng (nếu có)"
            />
          </div>
        )}

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
                <div>Hết hạn: {promo.end_date}</div>
                {promo.discount_type === "fixed" && promo.condition && (
                  <div>Điều kiện áp dụng: {promo.condition}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PromotionsManagementPage;
