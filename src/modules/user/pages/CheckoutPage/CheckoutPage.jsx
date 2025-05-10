import React, { useEffect, useState } from "react";
import "./CheckoutPage.css";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import Payment from "../../components/Checkout/PaymentSection.jsx";
import Discount from "../../components/Checkout/Discount.jsx";
import { useCart } from "../../../../contexts/CartContext.jsx";

const CheckoutPage = () => {
    const { cartItems } = useCart();
    const checkedItems = cartItems.filter((item) => item.checked);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const fetchAddresses = async () => {
        try {
            const res = await fetch("https://kltn.azurewebsites.net/api/addresses/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!res.ok) throw new Error("Không lấy được địa chỉ");

            const data = await res.json();
            setAddresses(data);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi tải địa chỉ");
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);



    const totalAmount = checkedItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    return (
        <div className="checkout-page">
            <Payment
                selectedAddressId={selectedAddressId}
                className="checkout-page-payment"
            />
            <div className="checkout-page-right">
                <ShippingInfo addresses={addresses} onAddressChange={(id) => setSelectedAddressId(id)} className="checkout-page-shippinginfo" />
                <Discount className="checkout-page-discount" />
                <OrderSummary total={totalAmount} cartItems={cartItems} className="checkout-page-summary" />
            </div>
        </div>
    );
};

export default CheckoutPage;
