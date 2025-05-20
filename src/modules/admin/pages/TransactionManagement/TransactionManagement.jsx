import React, { useState } from "react";
import "./TransactionManagement.css";

const dummyTransactions = [
  {
    id: "TXN001",
    buyer: "Nguyễn Văn A",
    seller: "Shop B",
    product: "Phân bón hữu cơ",
    amount: 120000,
    status: "Thành công",
    date: "2025-04-20",
  },
  {
    id: "TXN002",
    buyer: "Trần Thị C",
    seller: "Shop D",
    product: "Thuốc trừ sâu",
    amount: 560000,
    status: "Chờ xử lý",
    date: "2025-04-21",
  },
  {
    id: "TXN003",
    buyer: "Lê Văn E",
    seller: "Shop F",
    product: "Hạt giống ngô",
    amount: 30000,
    status: "Hủy",
    date: "2025-04-19",
  },
];

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.buyer.toLowerCase().includes(search.toLowerCase()) ||
      t.seller.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Tất cả" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const flagAsSuspicious = (id) => {
    alert(`Giao dịch ${id} đã được đánh dấu là bất thường để kiểm tra.`);
  };

  const suspendOrder = (id) => {
    alert(`Đã tạm dừng đơn hàng ${id}.`);
  };

  return (
    <div className="transaction-container">
      <h2>Quản lý lịch sử giao dịch</h2>

      <div className="trans-filters">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, người dùng, sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          <option value="Thành công">Thành công</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Hủy">Hủy</option>
        </select>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Người mua</th>
            <th>Người bán</th>
            <th>Sản phẩm</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.buyer}</td>
              <td>{t.seller}</td>
              <td>{t.product}</td>
              <td>{t.amount.toLocaleString()}đ</td>
              <td>{t.status}</td>
              <td>{t.date}</td>
              <td>
                <button onClick={() => flagAsSuspicious(t.id)}>Xác minh</button>
                <button onClick={() => suspendOrder(t.id)}>Tạm dừng</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
