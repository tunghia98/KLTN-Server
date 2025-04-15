// src/pages/AdminDashboard/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';

const ManageUsers = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  
  // Giả sử chúng ta có một API hoặc data mô phỏng
  const mockUsers = [
    { id: 1, username: 'seller1', role: 'seller' },
    { id: 2, username: 'admin1', role: 'admin' },
    { id: 3, username: 'user1', role: 'user' }
  ];

  useEffect(() => {
    // Thay vì mock, bạn có thể lấy từ API
    setUsers(mockUsers);
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  if (user.role !== 'admin') {
    return <p>Không có quyền truy cập.</p>;
  }

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Vai trò</th>
            <th>Thay đổi vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleRoleChange(u.id, 'admin')}>Admin</button>
                <button onClick={() => handleRoleChange(u.id, 'seller')}>Seller</button>
                <button onClick={() => handleRoleChange(u.id, 'user')}>User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
