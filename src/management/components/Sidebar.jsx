import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; // Thêm import cho file CSS

const Sidebar = ({ role }) => {
  const menuItems = {
    admin: [
      { path: "/admin/dashboard", label: "Dashboard" },
      { path: "/admin/users", label: "Quản lý người dùng" },
      { path: "/admin/sellers", label: "Duyệt người bán" },
      { path: "/admin/settings", label: "Cài đặt hệ thống" }
    ],
    seller: [
      { path: "/seller/products", label: "Quản lý sản phẩm" },
      { path: "/seller/orders", label: "Đơn hàng" },
    //   { path: "/seller/profile", label: "Thông tin shop" }
    ]
  };

  const items = menuItems[role] || [];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {items.map((item) => (
          <li key={item.path} className="sidebar-item">
            <NavLink 
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
