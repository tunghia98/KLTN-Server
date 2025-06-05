import React, { useEffect, useState, useMemo } from "react";
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
  const [appliedPromotions, setAppliedPromotions] = useState({});
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);

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

  const totalAmount = checkedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shopIds = useMemo(
    () => [...new Set(checkedItems.map((item) => item.shopId))],
    [checkedItems]
  );

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

  const stableShops = useMemo(() => shops, [shops]);
  const stableCartItems = useMemo(() => cartItems, [cartItems]);

  const handleApplyDiscount = (shopId, promotion) => {
    setDiscountCodes((prev) => ({ ...prev, [shopId]: promotion.code }));
    setAppliedPromotions((prev) => ({ ...prev, [shopId]: promotion }));
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) return alert("Vui lòng chọn địa chỉ nhận hàng!");
    if (checkedItems.length === 0)
      return alert("Không có sản phẩm nào để đặt hàng!");

    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: checkedItems.map(({ productId, quantity, shopId }) => ({
            productId,
            quantity,
            shopId,
          })),
          totalAmount,
          discounts: discountCodes,
        }),
      });
      if (!res.ok) throw new Error("Đặt hàng thất bại!");
      alert("Đặt hàng thành công!");
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };
  console.log("checkedItems:", checkedItems);
  const shopNames = useMemo(() => {
    const result = {};
    shops.forEach(({ id, name }) => {
      result[id] = name;
    });
    return result;
  }, [shops]);

  return (
    <div className="checkout-page">
      <Payment
        selectedAddressId={selectedAddressId}
        className="checkout-page-payment"
      />
      <div className="checkout-page-right">
        <ShippingInfo
          addresses={addresses}
          onAddressChange={setSelectedAddressId}
        />
        <Discount
          shops={stableShops}
          cartItems={stableCartItems}
          onApplyDiscount={handleApplyDiscount}
        />
        <OrderSummary
          cartItems={checkedItems}
          discounts={appliedPromotions}
          shopNames={shopNames}
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
