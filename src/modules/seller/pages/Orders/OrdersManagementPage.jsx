import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrdersManagementPage.css";
import { useUser } from "../../../../contexts/UserContext";
import getSelectBackgroundColor from "../../utils/getSelectBackgroundColor";

const OrderManagementPage = () => {
    const { user } = useUser();
    const [sellerOrders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("https://kltn.azurewebsites.net/api/orders/my-shop-orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (!res.ok) throw new Error("Lỗi khi tải đơn hàng");

                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);
console.log(sellerOrders);
    const handleStatusChange = async (orderId, newStatus) => {
        const order = sellerOrders.find((o) => o.id === orderId);

        // Gọi API cập nhật trạng thái đơn hàng
        try {
            const res = await fetch(`https://kltn.azurewebsites.net/api/orders/update-status/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ newStatus: newStatus }), 
            });

            const data = await res.text();

            if (!res.ok) {
                alert(data.message || "Cập nhật trạng thái thất bại");
                return;
            }

            // Cập nhật trạng thái trong UI sau khi gọi API thành công
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };


    if (loading) return <p>Đang tải đơn hàng...</p>;

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
                            <td>{order.customer?.name || "Không rõ"}</td>
                            <td>{order.totalAmount?.toLocaleString()}₫</td>
                            <td>
                                <select
                                    className="order-management-status"
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    style={{
                                        backgroundColor: getSelectBackgroundColor(order.status),
                                    }}
                                >
                                    <option value="Đang xử lý">Đang xử lý</option>
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
