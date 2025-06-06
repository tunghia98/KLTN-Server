import React, { useState, useEffect } from "react";
import Popup from "../../../../../src/components/Common/Popup.jsx";
import "./OrderHistory.css";
import RatingForm from "../../components/Rating/RatingForm.jsx";
import { useUser } from "../../../../contexts/UserContext.jsx";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useUser();
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratingItems, setRatingItems] = useState([]);

  // State lưu danh sách orderId đã từng đánh giá trong phiên này
  const [ratedOrders, setRatedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://kltn.azurewebsites.net/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Không thể tải đơn hàng");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(orderId);
    if (!orderItems[orderId]) {
      try {
        const res = await fetch(
          `https://kltn.azurewebsites.net/api/orderitems/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Không tải được chi tiết sản phẩm");
        const items = await res.json();
        setOrderItems((prev) => ({ ...prev, [orderId]: items }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const handleConfirmCancel = () => {
    alert(`Hủy đơn hàng ${selectedOrderId} thành công`);
    setShowPopup(false);
    setSelectedOrderId(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedOrderId(null);
  };

  const handleRating = async (orderId) => {
    let items = orderItems[orderId];
    if (!items) {
      try {
        const res = await fetch(
          `https://kltn.azurewebsites.net/api/orderitems/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Không tải được sản phẩm để đánh giá");
        items = await res.json();
        setOrderItems((prev) => ({ ...prev, [orderId]: items }));
      } catch (err) {
        console.error(err);
        return;
      }
    }
    if (items && items.length > 0) {
      setRatingOrder(orderId);
      setRatingItems(items);
      setShowRatingPopup(true);
    }
  };

  const handleSubmitRating = (ratings) => {
    console.log("Đã gửi đánh giá:", ratings);
    alert("Đánh giá của bạn đã được gửi!");
    setShowRatingPopup(false);
    if (ratingOrder !== null) {
      setRatedOrders((prev) => [...prev, ratingOrder]);
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (!orders.length) return <p>Bạn chưa có đơn hàng nào.</p>;

  return (
    <div className="order-history-container">
      <h2 className="section-title">🛒 Lịch Sử Đơn Hàng</h2>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>
                <strong>Mã đơn:</strong> {order.id}
              </span>
              <span>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </span>
            </div>
            <div className="order-body">
              <p>
                <strong>Trạng thái:</strong> {order.status}
              </p>
              <p>
                <strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()}
                ₫
              </p>
            </div>
            <div className="order-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(order.id)}
              >
                {expandedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button>
              {order.status === "Đang xử lý" && (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCancelClick(order.id)}
                >
                  Hủy đơn
                </button>
              )}
              {order.status === "Đã giao" &&
                !ratedOrders.includes(order.id) && (
                  <button
                    className="btn btn-review"
                    onClick={() => handleRating(order.id)}
                  >
                    Đánh giá
                  </button>
                )}
            </div>

            {expandedOrderId === order.id && (
              <table className="order-detail-product-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {(orderItems[order.id] || []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={handleClosePopup}
          title="Xác nhận hủy đơn"
        >
          <p>
            Bạn có chắc chắn muốn hủy đơn hàng{" "}
            <strong>{selectedOrderId}</strong> không?
          </p>
          <div className="popup-actions">
            <button className="btn btn-confirm" onClick={handleConfirmCancel}>
              Xác nhận
            </button>
            <button className="btn btn-cancel" onClick={handleClosePopup}>
              Hủy
            </button>
          </div>
        </Popup>
      )}

      {showRatingPopup && (
        <Popup
          isOpen={showRatingPopup}
          onClose={() => setShowRatingPopup(false)}
          title="Đánh giá sản phẩm"
        >
          <RatingForm
            products={ratingItems}
            userId={Number(user.userId)}
            onSubmit={handleSubmitRating}
            onCancel={() => setShowRatingPopup(false)}
          />
        </Popup>
      )}
    </div>
  );
};

export default OrderHistory;
