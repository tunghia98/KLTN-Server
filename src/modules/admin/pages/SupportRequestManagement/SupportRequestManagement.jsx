import React, { useState } from "react";
import "./SupportRequestManagement.css";

const sampleRequests = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    description: "Vấn đề đăng nhập tài khoản.",
    date: "2025-04-22",
    status: "Chưa xử lý",
    history: "Đang chờ xử lý.",
    attachments: "screenshot1.png",
  },
  {
    id: 2,
    user: "Trần Thị B",
    description: "Không thể thanh toán.",
    date: "2025-04-21",
    status: "Đang xử lý",
    history: "Đang liên hệ bộ phận thanh toán.",
    attachments: "invoice.png",
  },
];

export default function SupportRequestManagement() {
  const [requests, setRequests] = useState(sampleRequests);

  const handleRequestStatusChange = (id, newStatus) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);
  };

  return (
    <div className="support-request-container">
      <h2>🛠 Quản lý yêu cầu hỗ trợ</h2>
      <input
        type="text"
        placeholder="Tìm kiếm yêu cầu..."
        className="search-input"
      />
      <table className="support-request-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.user}</td>
              <td>{req.description}</td>
              <td>{req.date}</td>
              <td>{req.status}</td>
              <td>
                <button onClick={() => handleRequestStatusChange(req.id, "Đang xử lý")}>Xử lý</button>
                <button onClick={() => handleRequestStatusChange(req.id, "Đã giải quyết")}>Giải quyết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
