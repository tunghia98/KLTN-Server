import Sidebar from "../management/components/Sidebar.jsx";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import ManagementHeader from "../management/components/ManagementHeader.jsx";
import { Link } from "react-router-dom"; // Sử dụng Link từ react-router-dom để điều hướng
import "./ManagementLayout.css"; // Import file CSS cho Layout

function ManagementLayout({ children }) {
  const { user } = useContext(UserContext);

  // Function để render các menu item dựa trên vai trò của người dùng
  const renderMenuItems = () => {
    if (user?.role === "admin") {
      return (
        <>
          <li><Link to="/admin/orders" className="block hover:text-blue-500">Đơn hàng</Link></li>
          <li><Link to="/admin/products" className="block hover:text-blue-500">Sản phẩm</Link></li>
          <li><Link to="/admin/users" className="block hover:text-blue-500">Người dùng</Link></li>
          <li><Link to="/admin/manage-forum" className="block hover:text-blue-500">Quản lý Diễn đàn</Link></li>
          <li><Link to="/admin/manage-forum" className="block hover:text-blue-500">Quản lí doanh thu</Link></li>
          <li><Link to="/admin/manage-forum" className="block hover:text-blue-500">Quản lí khuyến mãi</Link></li>
        </>
      );
    } else if (user?.role === "seller") {
      return (
        <>
          <li><Link to="/seller/orders" className="block hover:text-blue-500">Đơn hàng</Link></li>
          <li><Link to="/seller/products" className="block hover:text-blue-500">Sản phẩm</Link></li>
          <li><Link to="">Doanh thu</Link></li>
          <li><Link to="">Khuyến mãi</Link></li>
        </>
      );
    }
    return null;
  };

  return (
    <div className="management-layout">
      <Sidebar role={user?.role} /> {/* Sidebar có thể render lại tùy vào role người dùng */}

      <aside className="management-layout-aside">
        <h2 className="management-layout-title">Menu</h2>
        <ul className="management-layout-menu-list">
          {renderMenuItems()} {/* Render menu items theo vai trò người dùng */}
        </ul>
      </aside>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default ManagementLayout;
