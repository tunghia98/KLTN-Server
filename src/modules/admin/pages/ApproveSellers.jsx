// src/pages/AdminDashboard/ApproveSellers.jsx
import React, { useState, useEffect } from 'react';

const ApproveSellers = () => {
  const [sellers, setSellers] = useState([]);

  const mockSellers = [
    { id: 1, name: 'Seller 1', status: 'pending' },
    { id: 2, name: 'Seller 2', status: 'pending' },
  ];

  useEffect(() => {
    // Lấy seller từ API, ở đây là mock dữ liệu
    setSellers(mockSellers);
  }, []);

  const handleApproval = (sellerId, action) => {
    setSellers(prevSellers =>
      prevSellers.map(seller =>
        seller.id === sellerId ? { ...seller, status: action } : seller
      )
    );
  };

  return (
    <div>
      <h2>Duyệt người bán</h2>
      <table>
        <thead>
          <tr>
            <th>Tên người bán</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.id}>
              <td>{seller.name}</td>
              <td>{seller.status}</td>
              <td>
                <button onClick={() => handleApproval(seller.id, 'approved')}>Duyệt</button>
                <button onClick={() => handleApproval(seller.id, 'rejected')}>Từ chối</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveSellers;
