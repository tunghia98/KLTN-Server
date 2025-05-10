import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import CartList from "../../components/Cart/CartList.jsx";
import CartSummary from "../../components/Cart/CartSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import { useCart } from "../../../../contexts/CartContext.jsx";



const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, toggleChecked, toggleCheckAll } = useCart();
  const checkedItems = cartItems.filter((item) => item.checked);
  const total = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [addresses, setAddresses] = useState([]);
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
  return (
    <div className="cart-page">
      <h2>Giỏ hàng</h2>
      <div className="cart-page-main">
        <div className="cart-page-left">
                  <CartList
                      products={cartItems}
                      onIncrease={(id) =>
                          updateQuantity(id, cartItems.find(item => item.productId === id).quantity + 1)
                      }
                      onDecrease={(id) =>
                          updateQuantity(id, Math.max(1, cartItems.find(item => item.productId === id).quantity - 1))
                      }
                      onRemove={removeFromCart}
                      onToggleCheck={toggleChecked}
                      onToggleCheckAll={toggleCheckAll}
                  />
        </div>

        <div className="cart-page-right">
          <ShippingInfo addresses={addresses} className="checkout-page-shippinginfo" />
          <OrderSummary total={total} />
          <CartSummary total={total} cartItems={checkedItems} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
