import React, { useState } from "react";
import "./SellerManagement.css";

export default function SellerManagement() {
  const [sellers, setSellers] = useState([
    {
      id: 1,
      storeName: "Nông sản sạch A",
      owner: "Nguyễn Văn A - 0901234567",
      address: "Hà Nội",
      status: "chờ phê duyệt",
      revenue: "12,000,000đ",
      products: 40,
      orders: 120,
    },
    {
      id: 2,
      storeName: "Phân bón B",
      owner: "Trần Thị B - b@example.com",
      address: "TP. HCM",
      status: "hoạt động",
      revenue: "25,000,000đ",
      products: 80,
      orders: 300,
    },
    {
      id: 3,
      storeName: "Thiết bị nông nghiệp C",
      owner: "Lê Văn C - 0912345678",
      address: "Đà Nẵng",
      status: "bị khóa",
      revenue: "0đ",
      products: 0,
      orders: 0,
    },
  ]);

  const approveSeller = (id) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "hoạt động" } : s))
    );
  };

  const lockSeller = (id) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "bị khóa" } : s))
    );
  };

  return (
    <div className="seller-container">
      <h2>Quản lý nhà bán hàng</h2>
      <table className="seller-table">
        <thead>
          <tr>
            <th>Tên cửa hàng</th>
            <th>Chủ sở hữu</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Doanh thu</th>
            <th>Sản phẩm</th>
            <th>Đơn hàng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.id}>
              <td>{s.storeName}</td>
              <td>{s.owner}</td>
              <td>{s.address}</td>
              <td>{s.status}</td>
              <td>{s.revenue}</td>
              <td>{s.products}</td>
              <td>{s.orders}</td>
              <td>
                {s.status === "chờ phê duyệt" && (
                  <button onClick={() => approveSeller(s.id)}>Phê duyệt</button>
                )}
                {s.status === "hoạt động" && (
                  <button onClick={() => lockSeller(s.id)}>Khóa</button>
                )}
                {s.status === "bị khóa" && (
                  <button onClick={() => approveSeller(s.id)}>Mở lại</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
