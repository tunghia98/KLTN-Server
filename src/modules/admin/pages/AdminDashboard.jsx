// src/pages/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import { useUser } from '../../../contexts/UserContext';

const AdminDashboard = () => {
  const { user } = useUser();

  if (user.role !== 'admin') {
    return <p>Không có quyền truy cập.</p>;
  }

  return (
    <div>
      <h1>Dashboard của Admin</h1>
      <p>Phân quyền, duyệt người bán, quản lý forum, v.v.</p>
      {/* Các chức năng quản lý admin */}
    </div>
  );
};

export default AdminDashboard;
