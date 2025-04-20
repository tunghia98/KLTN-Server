import React from "react";
import { Link } from "react-router-dom";
import "./ManagementHeader.css"; // Thêm import cho file CSS
import logo from "../../assets/logo-2-gra.png";

function ManagementHeader() {
  return (
    <header className="management-header">
      <Link to="/admin" className="header-logo"><img src={logo}></img></Link>
      <div className="header-links">
        <Link to="/admin/orders" className="header-link">Đơn hàng</Link>
        <Link to="/admin/products" className="header-link">Sản phẩm</Link>
        <Link to="/admin/users" className="header-link">Người dùng</Link>
      </div>
    </header>
  );
}

export default ManagementHeader;
