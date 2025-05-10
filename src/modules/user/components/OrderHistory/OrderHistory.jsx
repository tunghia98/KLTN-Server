import React, { useState, useEffect } from "react";
import Popup from "../../../../../src/components/Common/Popup.jsx";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fakeOrders = [
            {
                id: 1,
                orderCode: "DH001",
                createdAt: "2025-04-20T10:00:00Z",
                status: "Đã giao",
                totalAmount: 350000,
                products: [
                    { productId: 1, productName: "Phân bón hữu cơ", quantity: 2 },
                    { productId: 2, productName: "Hạt giống cà chua", quantity: 5 },
                ],
            },
            {
                id: 2,
                orderCode: "DH002",
                createdAt: "2025-04-22T14:30:00Z",
                status: "Đang giao",
                totalAmount: 180000,
                products: [
                    { productId: 3, productName: "Thuốc trừ sâu sinh học", quantity: 1 },
                ],
            },
            {
                id: 3,
                orderCode: "DH003",
                createdAt: "2025-04-25T09:15:00Z",
                status: "Chờ xác nhận",
                totalAmount: 500000,
                products: [
                    { productId: 4, productName: "Bầu tưới cây", quantity: 3 },
                    { productId: 5, productName: "Đất sạch trồng rau", quantity: 4 },
                ],
            },
        ];

        setTimeout(() => {
            setOrders(fakeOrders);
            setLoading(false);
        }, 1000);
    }, []);

    const handleCancelClick = (orderId) => {
        setSelectedOrderId(orderId);
        setShowPopup(true);
    };

    const handleConfirmCancel = () => {
        alert(`Hủy đơn hàng thành công`);
        setShowPopup(false);
        setSelectedOrderId(null);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedOrderId(null);
    };

    if (loading) return <p>Đang tải đơn hàng...</p>;

    if (orders.length === 0) return <p>Bạn chưa có đơn hàng nào.</p>;

    return (
        <div className="order-history-container">
            <h2 className="section-title">🛒 Lịch Sử Đơn Hàng</h2>
            <div className="order-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span><strong>Mã đơn:</strong> {order.orderCode}</span>
                            <span><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="order-body">
                            <p><strong>Trạng thái:</strong> {order.status}</p>
                            <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()}₫</p>
                        </div>
                        <div className="order-products">
                            <strong>Sản phẩm:</strong>
                            <ul>
                                {order.products.map(product => (
                                    <li key={product.productId}>
                                        {product.productName} x{product.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <button className="btn btn-primary">Xem chi tiết</button>
                            {order.status === "Chờ xác nhận" && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleCancelClick(order.id)}
                                >
                                    Hủy đơn
                                </button>
                            )}
                            {order.status==="Đã giao" && (
                                <button className="btn btn-review">
                                    Đánh giá
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

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
