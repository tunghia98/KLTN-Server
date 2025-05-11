import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderManagementDetailPage.css";

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Lấy đơn hàng từ API
                const orderRes = await fetch(`https://kltn.azurewebsites.net/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (!orderRes.ok) throw new Error("Lỗi khi tải đơn hàng");

                const orderData = await orderRes.json();
                setOrder(orderData);

                // Lấy chi tiết sản phẩm trong đơn hàng
                const orderItemsRes = await fetch(`https://kltn.azurewebsites.net/api/orderitems/order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (!orderItemsRes.ok) throw new Error("Lỗi khi tải chi tiết sản phẩm");

                const orderItemsData = await orderItemsRes.json();
                setOrderItems(orderItemsData);
            } catch (err) {
                setError("Không thể tải dữ liệu đơn hàng.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);
    console.log(order);
    console.log(orderItems);
    if (loading) return <div>Đang tải chi tiết đơn hàng...</div>;
    if (error) return <div>{error}</div>;
    if (!order) return <div>Không tìm thấy đơn hàng!</div>;

    return (
        <div>
            <Link to="/seller/orders" className="order-detail-back-button">
                Quay lại
            </Link>
            <div className="order-detail-container">
                <h1>Chi tiết đơn hàng #{order.id}</h1>
                <p><strong>Khách hàng:</strong> {order.customer?.name || "Không xác định"}</p>
                <p><strong>Địa chỉ giao hàng:</strong> {order.address}</p>
                <p><strong>Số điện thoại:</strong> {order.phone}</p>
                <p><strong>Hình thức thanh toán:</strong> {order.payment ?.method}</p>
                <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString()}₫</p>
                <p><strong>Trạng thái:</strong> {order.status}</p>
                <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

                <h2>Sản phẩm trong đơn hàng</h2>
                {orderItems.length > 0 ? (
                    <table className="order-detail-product-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {item.productImageUrl ? (
                                            <img
                                                src={`https://kltn.azurewebsites.net/api/product-images/file/${item.productImageUrl}`}
                                                alt={item.productName}
                                                className="order-detail-product-image"
                                            />
                                        ) : (
                                            <img
                                                src="https://kltn.azurewebsites.net/api/product-images/file/7a2843f5-2a5a-46e2-8eea-080b51bada6b.png"
                                                alt="Ảnh mặc định"
                                                className="order-detail-product-image"
                                            />
                                        )}
                                    </td>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unitPrice.toLocaleString()}₫</td>
                                    <td>{(item.total).toLocaleString()}₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                ) : (
                    <p>Đơn hàng này không có sản phẩm nào.</p>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;
