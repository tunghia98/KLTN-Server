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
          <li>
            <Link to="/admin/users">Người dùng</Link>
          </li>
          <li>
            <Link to="/admin/sellers">Nhà bán hàng</Link>
          </li>
          <li>
            <Link to="/admin/transaction">Lịch sử giao dịch</Link>
          </li>
          <li>
            <Link to="/admin/statistics">Thống kê</Link>
          </li>
          {/* <li>
            <Link to="/admin/violation">Kiểm tra & xử lý vi phạm</Link>
          </li>
          <li>
            <Link to="/admin/support-request">Hỗ trợ từ người dùng</Link>
          </li>
          <li>
            <Link to="/admin/support-channel">Kênh hỗ trợ</Link>
          </li> */}
          <li>
            <Link to="/admin/customization">Tùy chỉnh</Link>
          </li>
          <li>
            <Link to="/admin/forum">Quản lý diễn đàn</Link>
          </li>
          <li>
            <Link to="/">LÚA - CHỢ NÔNG</Link>
          </li>
        </>
      );
    } else if (user?.role === "seller") {
      return (
        <>
          <>
            <li>
              <Link to="/seller/orders">Đơn hàng</Link>
            </li>
            <li>
              <Link to="/seller/products">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/seller/statistics">Thống kê</Link>
            </li>
            <li>
              <Link to="/seller/delivery">Vận chuyển</Link>
            </li>
            <li>
              <Link to="/seller/promotions">Khuyến mãi</Link>
            </li>
            <li>
              <Link to="/seller/review">Đánh giá</Link>
            </li>
            <li>
              <Link to="/seller/chat">Tư vấn</Link>
            </li>
          </>
          <li>
            <Link to="/">LÚA - CHỢ NÔNG</Link>
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <div className="management-layout">
      <Sidebar role={user?.role} />{" "}
      {/* Sidebar có thể render lại tùy vào role người dùng */}
      <aside className="management-layout-aside">
        <h2 className="management-layout-title">Menu</h2>
        <ul className="management-layout-menu-list">
          {renderMenuItems()} {/* Render menu items theo vai trò người dùng */}
        </ul>
      </aside>
      <div className="management-content">
        <ManagementHeader />
        {children}
      </div>
    </div>
  );
}

export default ManagementLayout;
