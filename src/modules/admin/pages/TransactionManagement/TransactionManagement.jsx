import React, { useState, useEffect } from "react";
import "./TransactionManagement.css";

export default function TransactionManagement() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState({});

  const flagAsSuspicious = (id) => {
    alert(`Giao dịch ${id} đã được đánh dấu là bất thường để kiểm tra.`);
  };

  const suspendOrder = (id) => {
    alert(`Đã tạm dừng đơn hàng ${id}.`);
  };

  useEffect(() => {
    const fetchOrdersWithDetails = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) throw new Error("Lỗi khi tải danh sách đơn hàng");

        const orderList = await res.json();

        const detailedOrders = await Promise.all(
          orderList.map(async (order) => {
            try {
              const resDetail = await fetch(
                `https://kltn.azurewebsites.net/api/orderitems/order/1`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );

              if (!resDetail.ok)
                throw new Error("Lỗi khi tải chi tiết đơn hàng");

              const detail = await resDetail.json();
              console.log(`Chi tiết đơn hàng ${order.id}:`, detail);

              return {
                ...order, // giữ dữ liệu ban đầu
                ...detail, // merge thêm detail nếu khác
              };
            } catch (err) {
              console.error(`Lỗi khi tải chi tiết cho đơn ${order.id}:`, err);
              return {
                ...order,
                detailError: true,
              };
            }
          })
        );

        setOrders(detailedOrders);
      } catch (error) {
        console.error("Lỗi:", error);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithDetails();
  }, []);

  const searchLower = search.toLowerCase();

  const filtered = orders.filter((t) => {
    const buyer = t.customer?.name ?? "";
    const seller = t.shopid ?? "";
    const product = t.product ?? "";
    const id = t.id ?? "";

    const matchSearch =
      buyer.toLowerCase().includes(searchLower) ||
      seller.toLowerCase().includes(searchLower) ||
      product.toLowerCase().includes(searchLower) ||
      id.toLowerCase().includes(searchLower);

    const matchStatus = statusFilter === "Tất cả" || t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

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
              <td>{t.customer.name}</td>
              <td>{t.shopid}</td>
              <td>{t.product}</td>
              <td>
                {t.totalAmount != null
                  ? t.totalAmount.toLocaleString() + "đ"
                  : "N/A"}
              </td>
              <td>{t.status}</td>
              <td>{t.orderDate?.split("T")[0]}</td>
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
