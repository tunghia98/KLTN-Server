import React, { useState, useEffect } from "react";
import Popup from "../../../../../src/components/Common/Popup.jsx";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // 1️⃣ Lấy danh sách đơn của user
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("https://kltn.azurewebsites.net/api/orders/my-orders", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                });
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

    // 2️⃣ Khi nhấn Xem chi tiết: gọi API lấy orderItems nếu chưa có
    const handleViewDetails = async (orderId) => {
        if (expandedOrderId === orderId) {
            // Thu gọn lại
            setExpandedOrderId(null);
            return;
        }
        setExpandedOrderId(orderId);
        // Nếu chưa fetch lần nào
        if (!orderItems[orderId]) {
            try {
                const res = await fetch(
                    `https://kltn.azurewebsites.net/api/orderitems/order/${orderId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
                );
                if (!res.ok) throw new Error("Không tải được chi tiết sản phẩm");
                const items = await res.json();
                setOrderItems(prev => ({ ...prev, [orderId]: items }));
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

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (!orders.length) return <p>Bạn chưa có đơn hàng nào.</p>;

    return (
        <div className="order-history-container">
            <h2 className="section-title">🛒 Lịch Sử Đơn Hàng</h2>
            <div className="order-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span><strong>Mã đơn:</strong> {order.id}</span>
                            <span><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="order-body">
                            <p><strong>Trạng thái:</strong> {order.status}</p>
                            <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()}₫</p>
                        </div>
                        <div className="order-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleViewDetails(order.id)}
                            >
                                {expandedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                            </button>
                            {order.status === "Chờ xác nhận" && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleCancelClick(order.id)}
                                >
                                    Hủy đơn
                                </button>
                            )}
                            {order.status === "Đã giao" && (
                                <button className="btn btn-review">Đánh giá</button>
                            )}
                        </div>

                        {/* 3️⃣ Phần chi tiết sản phẩm */}
                        {expandedOrderId === order.id && (
                            <table className="order-detail-product-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(orderItems[order.id] || []).map(item => (
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

            {/* Popup hủy đơn */}
            {showPopup && (
                <Popup isOpen={showPopup} onClose={handleClosePopup} title="Xác nhận hủy đơn">
                    <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>{selectedOrderId}</strong> không?</p>
                    <div className="popup-actions">
                        <button className="btn btn-confirm" onClick={handleConfirmCancel}>Xác nhận</button>
                        <button className="btn btn-cancel" onClick={handleClosePopup}>Hủy</button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default OrderHistory;
