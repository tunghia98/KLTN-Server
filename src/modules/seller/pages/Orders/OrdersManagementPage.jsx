import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrdersManagementPage.css";
import { useUser } from "../../../../contexts/UserContext";
import { orders, userAccounts } from "../../../../data/data.js";
import getSelectBackgroundColor from "../../utils/getSelectBackgroundColor.js";

const OrderManagementPage = () => {
  const { user } = useUser();
  const [sellerOrders, setOrders] = useState([]);

  useEffect(() => {
    const userOrders = orders.filter((order) => order.sellerid === user.id);

    const ordersWithCustomer = userOrders.map((order) => {
      const customer = userAccounts.find((account) => account.id === order.user_id);
      return {
        ...order,
        customerName: customer ? customer.name : "Khách hàng không xác định",
      };
    });

    setOrders(ordersWithCustomer);
  }, [user.id]);

  // Thay đổi trạng thái của đơn hàng cụ thể
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // TODO: nếu có server -> fetch API cập nhật đơn hàng
    // fetch(`/api/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
  };

  return (
    <div className="order-management-container">
      <h1 className="order-management-title">Quản lý Đơn hàng</h1>
      <table className="order-management-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sellerOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.total_price.toLocaleString()}₫</td>
              <td>
                <select
                  className="order-management-status"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)} // Sửa tại đây
                  style={{
                    backgroundColor: getSelectBackgroundColor(order.status), // Dùng status của đơn hàng
                  }}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã huỷ">Đã huỷ</option>
                </select>
              </td>
              <td>
                <Link to={`/seller/orders/${order.id}`}>
                  <button>Xem</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagementPage;
