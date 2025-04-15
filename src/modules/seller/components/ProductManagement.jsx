// src/components/admin/ProductManagement.jsx
import React from "react";

const dummyProducts = [
  { id: 1, name: "Phân bón NPK", status: "Đã duyệt" },
  { id: 2, name: "Thuốc trừ sâu ABC", status: "Chờ duyệt" },
];

export function ProductManagement() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Quản lý Sản phẩm</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dummyProducts.map(product => (
            <tr key={product.id} className="text-center">
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.status}</td>
              <td>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Chỉnh sửa</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
