import React, { useState } from "react";
import {useUser} from "../../../../contexts/UserContext.jsx"
import { useNavigate } from 'react-router-dom';
import "./UserProfile.css"

const UserProfile = () => {
    const { user } = useUser();  // ⛔️ Sai
    const navigate = useNavigate();


  const [addresses, setAddresses] = useState([
    { id: 1, text: "Số 10, Ấp Bình Minh, Xã Hòa Phú, Củ Chi, TP. HCM", default: true },
    { id: 2, text: "123 Đường Lý Thường Kiệt, Quận 10, TP. HCM", default: false },
    { id: 3, text: "Thôn 4, Xã Ea Bar, Buôn Đôn, Đắk Lắk", default: false },
  ]);

  const [orders] = useState([
    { id: "AGRI1023", date: "12/04/2025", status: "Đã giao", total: 1200000 },
    { id: "AGRI0987", date: "05/04/2025", status: "Đang giao", total: 650000 },
    { id: "AGRI0932", date: "22/03/2025", status: "Đã hủy", total: 450000 },
  ]);

  const handleLogout = () => {
    // 1. Xoá token hoặc user info khỏi localStorage
    localStorage.removeItem('token');     // hoặc: removeItem('user')
    localStorage.removeItem('user');

    // 2. Optional: reset context hoặc state app nếu bạn dùng
    // dispatch({ type: 'LOGOUT' }); // nếu dùng Context API hoặc Redux

    // 3. Điều hướng về trang login (hoặc homepage)
    navigate('/');
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">👤 Thông Tin Cá Nhân</h1>
      <div className="profile-card">
        <div className="profile-content">
          <div><strong>Họ tên:</strong> abc</div>
          <div><strong>Số điện thoại:</strong> abc</div>
          <div><strong>Email:</strong> abc</div>
          <div><strong>Ngày sinh:</strong> abc</div>
          <button className="btn">Sửa thông tin</button>
        </div>
      </div>

      <div className="tabs">
        <input type="radio" name="tab" id="tab-addresses" defaultChecked />
        <label htmlFor="tab-addresses">Địa chỉ giao hàng</label>

        <input type="radio" name="tab" id="tab-orders" />
        <label htmlFor="tab-orders">Đơn hàng</label>

        <div className="tab-content" id="addresses">
          <h2 className="tab-title">🚚 Địa chỉ giao hàng</h2>
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div>
                {address.text} {address.default && (
                  <span className="default-label">(Mặc định)</span>
                )}
              </div>
              <button className="btn-outline">Chỉnh sửa</button>
            </div>
          ))}
          <button className="btn mt-4">➕ Thêm địa chỉ mới</button>
        </div>

        <div className="tab-content" id="orders">
          <h2 className="tab-title">🛒 Đơn hàng gần đây</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                  <td>{order.total.toLocaleString()}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-outline mt-4">Xem tất cả đơn hàng</button>
        </div>
      </div>

      <div className="membership-section">
        <h2 className="tab-title">🏅 Thành viên & Ưu đãi</h2>
        <div className="profile-card">
          <div className="profile-content">
            <div>Cấp độ: <strong>Khách hàng thân thiết</strong></div>
            <ul>
              <li>🎁 Giảm 10% cho đơn hàng trên 2 triệu.</li>
              <li>🎁 Freeship toàn quốc cho đơn từ 1.500.000₫.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-right mt-8">
        <button className="btn-danger" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  );
};

export default UserProfile;

/* CSS */
/* Thêm file userProfile.css */

