import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import Payment from "../../components/Checkout/PaymentSection.jsx";
import Discount from "../../components/Checkout/Discount.jsx";

const userInfo = {
    name: "Nguyễn Hoàng Kiều Ngân",
    phone: "0859763025",
    address: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM",
};

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Vui lòng đăng nhập để thanh toán.");
                navigate("/login");
                return;
            }

            try {
                const res = await fetch("https://kltn.azurewebsites.net/api/Cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Không thể lấy giỏ hàng");

                const data = await res.json();
                setCartItems(data);
            } catch (error) {
                console.error("Lỗi lấy giỏ hàng:", error.message);
                alert("❌ Không thể tải giỏ hàng từ hệ thống.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [navigate]);

    if (isLoading) return <div>Đang tải dữ liệu giỏ hàng...</div>;

    if (!cartItems || cartItems.length === 0) {
        return <div>❌ Giỏ hàng của bạn đang trống.</div>;
    }

    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    return (
        <div className="checkout-page">
            <Payment cartItems={cartItems} className="checkout-page-payment" />
            <div className="checkout-page-right">
                <ShippingInfo user={userInfo} className="checkout-page-shippinginfo" />
                <Discount className="checkout-page-discount" />
                <OrderSummary total={totalAmount} cartItems={cartItems} className="checkout-page-summary" />
            </div>
        </div>
    );
};

export default CheckoutPage;
