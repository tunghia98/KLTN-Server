import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import "./CheckoutPage.css";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import Payment from "../../components/Checkout/PaymentSection.jsx";
import Discount from "../../components/Checkout/Discount.jsx";
import { useCart } from "../../../../contexts/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems = [] } = useCart();
  const checkedItems = cartItems.filter((item) => item.checked);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [discountCodes, setDiscountCodes] = useState({});
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          "https://kltn.azurewebsites.net/api/addresses/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Không lấy được địa chỉ");
        const data = await res.json();
        setAddresses(data);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải địa chỉ");
      }
    };
    fetchAddresses();
  }, []);

  // Tổng tiền
  const totalAmount = checkedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Lấy danh sách shopId
  const shopIds = useMemo(
    () => [...new Set(checkedItems.map((item) => item.shopId))],
    [checkedItems]
  );

  // Lấy tên shop
  const fetchShopName = async (shopId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/shops/${shopId}`
      );
      if (!res.ok) throw new Error("Không tìm thấy cửa hàng");
      const data = await res.json();
      return data.name;
    } catch (err) {
      console.error("Lỗi khi lấy tên cửa hàng:", err);
      return `Cửa hàng ${shopId}`;
    }
  };

  // Fetch shops chỉ 1 lần
  useEffect(() => {
    if (shopIds.length === 0) {
      setShops([]);
      return;
    }
    const fetchShops = async () => {
      const shopData = await Promise.all(
        shopIds.map(async (id) => {
          const name = await fetchShopName(id);
          return { id, name };
        })
      );
      setShops(shopData);
    };
    fetchShops();
  }, [shopIds]);

  // Ổn định dữ liệu để tránh fetch lại trong Discount
  const stableShops = useMemo(() => shops, [shops]);
  const stableCartItems = useMemo(() => cartItems, [cartItems]);

  const handleApplyDiscount = (shopId, code) => {
    setDiscountCodes((prev) => ({
      ...prev,
      [shopId]: code,
    }));
  };

  // Xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ nhận hàng!");
      return;
    }
    if (checkedItems.length === 0) {
      alert("Không có sản phẩm nào để đặt hàng!");
      return;
    }

    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: checkedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            shopId: item.shopId,
          })),
          totalAmount,
          discounts: discountCodes,
        }),
      });

      if (!res.ok) throw new Error("Đặt hàng thất bại!");

      alert("Đặt hàng thành công!");
      navigate("/order-success");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="checkout-page">
      <Payment
        selectedAddressId={selectedAddressId}
        className="checkout-page-payment"
      />
      <div className="checkout-page-right">
        <ShippingInfo
          addresses={addresses}
          onAddressChange={(id) => setSelectedAddressId(id)}
          className="checkout-page-shippinginfo"
        />
        <Discount
          shops={stableShops}
          cartItems={stableCartItems}
          onApplyDiscount={handleApplyDiscount}
          className="checkout-page-discount"
        />
        <OrderSummary
          total={totalAmount}
          cartItems={cartItems}
          discounts={discountCodes}
          className="checkout-page-summary"
        />
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button className="btn-primary" onClick={handleConfirmOrder}>
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
