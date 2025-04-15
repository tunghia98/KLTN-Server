// src/pages/SellerDashboard/SellerDashboard.jsx
import React from 'react';
import { useUser } from '../../contexts/UserContext';

const SellerDashboard = () => {
  const { user } = useUser();

  if (user.role !== 'seller') {
    return <p>Không có quyền truy cập.</p>;
  }

  return (
    <div>
      <h1>Dashboard của Seller</h1>
      <p>Quản lý sản phẩm, đơn hàng, v.v.</p>
      {/* Các chức năng dành cho Seller */}
    </div>
  );
};

export default SellerDashboard;
