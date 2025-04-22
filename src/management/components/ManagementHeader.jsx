import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext'; // Đảm bảo đường dẫn đúng
import { useNavigate } from 'react-router-dom'; // Để điều hướng
import './ManagementHeader.css'; // Import file CSS cho header

function ManagementHeader() {
  const { user, setUser } = useContext(UserContext); // Lấy thông tin user từ context
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setUser(null); // Đặt user là null khi đăng xuất
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  // Hàm xử lý sửa thông tin người dùng
  const handleEditProfile = () => {
    navigate('/profile'); // Điều hướng đến trang sửa thông tin
  };

  return (
    <header className="management-header">
      <div className="header-left">
        <h1>Quản lý Cửa hàng</h1>
      </div>
      <div className="header-right">
        {user && (
          <>
            <span className="user-name">{user.name}</span> {/* Hiển thị tên người dùng */}
            <button className="edit-profile-btn" onClick={handleEditProfile}>Sửa thông tin</button> {/* Nút chỉnh sửa thông tin */}
            <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button> {/* Nút đăng xuất */}
          </>
        )}
      </div>
    </header>
  );
}

export default ManagementHeader;
