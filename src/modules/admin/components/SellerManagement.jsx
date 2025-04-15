// src/components/admin/SellerManagement.jsx
import React from "react";

const dummySellers = [
  { id: 1, shopName: "Vật tư Tây Nguyên", status: "Chờ duyệt" },
  { id: 2, shopName: "Phân bón Ba Miền", status: "Đã duyệt" },
];

export function SellerManagement() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Quản lý Seller</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Tên Shop</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dummySellers.map(seller => (
            <tr key={seller.id} className="text-center">
              <td>{seller.id}</td>
              <td>{seller.shopName}</td>
              <td>{seller.status}</td>
              <td>
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Duyệt</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
