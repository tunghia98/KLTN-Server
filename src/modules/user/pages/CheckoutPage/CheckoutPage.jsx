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

  const checkedItems = useMemo(() => {
    return cartItems.filter((item) => item.checked);
  }, [cartItems]);
    const { fetchCartFromBackend } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [discountCodes, setDiscountCodes] = useState({});
  const [appliedPromotions, setAppliedPromotions] = useState({});
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  const totalAmount = useMemo(() => {
    return checkedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [checkedItems]);

  const shopIds = useMemo(
    () => [...new Set(checkedItems.map((item) => item.shopId))],
    [checkedItems]
  );

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

  useEffect(() => {
    fetchAddresses();
  }, []);

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

  const shopNames = useMemo(() => {
    const result = {};
    shops.forEach(({ id, name }) => {
      result[String(id)] = name; // Ép string luôn
    });
    return result;
  }, [shops]);

  // Chuẩn hóa key discounts sang string
  const normalizedDiscounts = useMemo(() => {
    const res = {};
    for (const key in appliedPromotions) {
      res[String(key)] = appliedPromotions[key];
    }
    return res;
  }, [appliedPromotions]);

  const handleApplyDiscount = (shopId, promotion) => {
    const key = String(shopId);
    setDiscountCodes((prev) => ({ ...prev, [key]: promotion.code }));
    setAppliedPromotions((prev) => ({
      ...prev,
      [key]: {
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
      },
    }));
  };

    const handleConfirmOrder = async () => {
        if (!selectedAddressId) return alert("Vui lòng chọn địa chỉ nhận hàng!");
        if (checkedItems.length === 0)
            return alert("Không có sản phẩm nào để đặt hàng!");

        const token = localStorage.getItem("accessToken");
        if (!token) return alert("Bạn chưa đăng nhập.");

        const grouped = {};
        checkedItems.forEach(item => {
            const shopId = String(item.shopId);
            if (!grouped[shopId]) grouped[shopId] = [];
            grouped[shopId].push(item);
        });

        try {
            for (const shopId in grouped) {
                const items = grouped[shopId];

                const subTotal = items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

                const promotion = normalizedDiscounts[shopId];
                let discountAmount = 0;

                if (promotion) {
                    if (promotion.type === "percent") {
                        discountAmount = (subTotal * promotion.value) / 100;
                    } else if (promotion.type === "amount") {
                        discountAmount = promotion.value;
                    }
                }

                const totalAmount = Math.max(subTotal - discountAmount, 0);

                const orderItems = items.map(item => ({
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                }));

                const res = await fetch("https://kltn.azurewebsites.net/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        shopId,
                        shippingAddressId: selectedAddressId,
                        totalAmount,
                        items: orderItems,
                    }),
                });

                if (!res.ok) {
                    throw new Error(`Lỗi khi tạo đơn hàng cho shop ${shopId}`);
                }

                // ✅ XÓA SẢN PHẨM KHỎI GIỎ HÀNG SAU KHI ĐẶT HÀNG
                for (const item of items) {
                    if (!item.productId) continue;
                    await fetch(`https://kltn.azurewebsites.net/api/cart/${item.productId}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            }
            fetchCartFromBackend();
            alert("Đặt hàng thành công!");
            navigate("/order-success");
        } catch (err) {
            console.error(err);
            alert("❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
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
          onAddressChange={setSelectedAddressId}
        />
        <Discount
          shops={shops}
          cartItems={checkedItems}
          onApplyDiscount={handleApplyDiscount}
        />
        <OrderSummary
          cartItems={checkedItems}
          discounts={normalizedDiscounts}
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
