// src/components/admin/UserManagement.jsx
import React from "react";

const dummyUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", status: "Active" },
  { id: 2, name: "Trần Thị B", email: "b@example.com", status: "Banned" },
];

export function UserManagement() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Quản lý User</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map(user => (
            <tr key={user.id} className="text-center">
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2">Xoá</button>
                <button className="bg-yellow-400 text-white px-2 py-1 rounded">Khoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
