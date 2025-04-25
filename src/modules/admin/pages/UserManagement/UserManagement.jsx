import React, { useState } from "react";
import "./UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
      status: "hoạt động",
      createdAt: "2025-01-01",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b@gmail.com",
      status: "bị khóa",
      createdAt: "2025-02-10",
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "hoạt động" ? "bị khóa" : "hoạt động" } : u
      )
    );
  };

  const deleteUser = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
  };

  const saveEdit = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? { ...u, name: editForm.name, email: editForm.email } : u
      )
    );
    setEditingUser(null);
  };

  return (
    <div className="user-container">
      <h2>Quản lý tài khoản người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>SĐT / Email</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>{u.createdAt}</td>
              <td>
                <button onClick={() => toggleStatus(u.id)}>
                  {u.status === "hoạt động" ? "Khóa" : "Mở khóa"}
                </button>
                <button onClick={() => openEdit(u)}>Sửa</button>
                <button className="delete" onClick={() => deleteUser(u.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chỉnh sửa người dùng</h3>
            <input
              type="text"
              placeholder="Họ và tên"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={saveEdit}>Lưu</button>
              <button onClick={() => setEditingUser(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
