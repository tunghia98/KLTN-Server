import React, { useState, useEffect } from "react";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // const fetchOrders = async () => {
    //     try {
    //         const res = await fetch("https://kltn.azurewebsites.net/api/orders/user", {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //             },
    //         });
    //         if (!res.ok) throw new Error("Không lấy được danh sách đơn hàng");

    //         const data = await res.json();
    //         setOrders(data);
    //     } catch (err) {
    //         console.error(err);
    //         alert("Lỗi khi tải đơn hàng");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchOrders();
    // }, []);
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
        }, 1000); // giả lập thời gian tải
    }, []);
    if (loading) return <p>Đang tải đơn hàng...</p>;

    if (orders.length === 0) {
        return <p>Bạn chưa có đơn hàng nào.</p>;
    }

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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
