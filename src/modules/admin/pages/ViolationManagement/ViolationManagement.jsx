import React, { useState } from "react";
import "./ViolationManagement.css";

const sampleViolations = [
  {
    id: 1,
    type: "Người dùng",
    name: "Nguyễn Văn A",
    action: "Spam bình luận",
    date: "2025-04-22",
    status: "Chưa xử lý",
  },
  {
    id: 2,
    type: "Nhà bán hàng",
    name: "Cửa hàng Bảo Nông",
    action: "Bán sản phẩm cấm",
    date: "2025-04-21",
    status: "Đã cảnh báo",
  },
  {
    id: 3,
    type: "Nhà bán hàng",
    name: "Cửa hàng Hữu Cơ Xanh",
    action: "Thông tin sản phẩm sai",
    date: "2025-04-20",
    status: "Chưa xử lý",
  },
];

export default function ViolationManagement() {
  const [violations, setViolations] = useState(sampleViolations);

  const handleWarning = (id) => {
    const updated = violations.map((v) =>
      v.id === id ? { ...v, status: "Đã cảnh báo" } : v
    );
    setViolations(updated);
  };

  const handleBlock = (id) => {
    const updated = violations.map((v) =>
      v.id === id ? { ...v, status: "Tài khoản bị khóa" } : v
    );
    setViolations(updated);
  };

  const handleDeleteProduct = (id) => {
    alert(`Đã xóa sản phẩm vi phạm của ID ${id}`);
    // TODO: gọi API để xóa sản phẩm thực tế
  };

  return (
    <div className="violation-container">
      <h2>🚨 Kiểm tra & Xử lý vi phạm</h2>
      <table className="violation-table">
        <thead>
          <tr>
            <th>Loại</th>
            <th>Tên</th>
            <th>Hành vi vi phạm</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {violations.map((v) => (
            <tr key={v.id}>
              <td>{v.type}</td>
              <td>{v.name}</td>
              <td>{v.action}</td>
              <td>{v.date}</td>
              <td>{v.status}</td>
              <td className="actions">
                <button onClick={() => handleWarning(v.id)}>⚠ Cảnh báo</button>
                <button onClick={() => handleDeleteProduct(v.id)}>🗑 Xóa SP</button>
                <button onClick={() => handleBlock(v.id)}>⛔ Khóa TK</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
