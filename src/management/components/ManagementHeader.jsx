import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../../contexts/UserContext"; // Đảm bảo đường dẫn đúng
import { useNavigate } from "react-router-dom"; // Để điều hướng
import "./ManagementHeader.css"; // Import file CSS cho header

function ManagementHeader() {
  const { user, setUser } = useContext(UserContext); // Lấy thông tin user từ context
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null); // State để lưu thông tin nhà cung cấp

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setUser(null); // Đặt user là null khi đăng xuất
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  // Hàm xử lý sửa thông tin người dùng
  const handleEditProfile = () => {
    navigate("/profile"); // Điều hướng đến trang sửa thông tin
  };
  useEffect(() => {
<<<<<<< HEAD
    const fetchSellers = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/Shops");
        if (!res.ok) throw new Error("Không thể tải danh sách nhà cung cấp");
        const shops = await res.json();

        const sellerId = user.userId;
        console.log("ID nhà cung cấp:", sellerId);
        const foundSeller = shops.find(
          (s) => String(s.ownerId) === String(sellerId)
        );
        setSeller(foundSeller); // Lưu thông tin nhà cung cấp vào state
        console.log("Nhà cung cấp:", foundSeller);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà cung cấp:", error);
=======
      const fetchSellers = async () => {
        try {
          const res = await fetch("https://kltn.azurewebsites.net/api/Shops");
          if (!res.ok) throw new Error("Không thể tải danh sách nhà cung cấp");
          const shops = await res.json();
  
          const sellerId = user.userId;
          const foundSeller = shops.find((s) => String(s.ownerId) === String(sellerId));
          setSeller(foundSeller); // Lưu thông tin nhà cung cấp vào state
        } catch (error) {
          console.error("Lỗi khi tải danh sách nhà cung cấp:", error);
        }
      };
  
      if (user && user.userId) {
        fetchSellers();
>>>>>>> 61749fcfb315335bc4063e309f490541ec1fc01b
      }
    };

    if (user && user.userId) {
      fetchSellers();
    }
  }, [user]);

  return (
    <header className="management-header">
      <div className="header-left">
        {user && user.role === "seller" && (
          <h1>Quản lý cửa hàng {seller?.name}</h1>
        )}
        {user && user.role === "admin" && <h1>Quản lý hệ thống</h1>}
      </div>
      <div className="header-right">
        {user && (
          <>
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Sửa thông tin
            </button>{" "}
            {/* Nút chỉnh sửa thông tin */}
            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>{" "}
            {/* Nút đăng xuất */}
          </>
        )}
      </div>
    </header>
  );
}

export default ManagementHeader;
