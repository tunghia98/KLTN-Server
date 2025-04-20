import React from "react";
import { useParams, Link } from "react-router-dom";
import { orders, userAccounts, order_details, products } from "../../../../data/data.js";
import "./OrderManagementDetailPage.css";

const OrderDetailPage = () => {
  const { orderId } = useParams();

  // Tìm đơn hàng
  const order = orders.find((o) => o.id === parseInt(orderId));

  if (!order) {
    return <div>Không tìm thấy đơn hàng!</div>;
  }

  // Tìm tên khách hàng
  const customer = userAccounts.find((account) => account.id === order.user_id);

  // Lọc danh sách chi tiết sản phẩm của đơn hàng
  const details = order_details.filter((detail) => detail.order_id === order.id);

  // Tạo mảng chi tiết có tên sản phẩm
  const detailsWithProductName = details.map((detail) => {
    const product = products.find((p) => p.id === detail.product_id);
    return {
      ...detail,
      productName: product ? product.name : "Sản phẩm không xác định",
    };
  });

  return (
    <div className="order-detail-container">
      <h1>Chi tiết đơn hàng #{order.id}</h1>
      <p><strong>Khách hàng:</strong> {customer ? customer.name : "Không xác định"}</p>
      <p><strong>Tổng tiền:</strong> {order.total_price.toLocaleString()}₫</p>
      <p><strong>Trạng thái:</strong> {order.status}</p>
      <p><strong>Ngày đặt:</strong> {order.created_at}</p>

      <h2>Sản phẩm trong đơn hàng</h2>
      {detailsWithProductName.length > 0 ? (
        <ul className="order-detail-product-list">
          {detailsWithProductName.map((item, index) => (
            <li key={index}>
              <span>{item.productName}</span>
              <span>{item.quantity} x {item.price.toLocaleString()}₫</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Đơn hàng này không có sản phẩm nào.</p>
      )}

      <Link to="/seller/orders" className="order-detail-back-button">
        Quay lại
      </Link>
    </div>
  );
};

export default OrderDetailPage;
