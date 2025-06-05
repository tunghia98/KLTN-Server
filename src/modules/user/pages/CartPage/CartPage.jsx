import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import CartList from "../../components/Cart/CartList.jsx";
import CartSummary from "../../components/Cart/CartSummary.jsx";
import ShippingInfo from "../../components/Checkout/ShippingInfo.jsx";
import OrderSummary from "../../components/Checkout/OrderSummary.jsx";
import { useCart } from "../../../../contexts/CartContext.jsx";

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    toggleChecked,
    toggleCheckAll,
  } = useCart();

  const [addresses, setAddresses] = useState([]);

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
  const fetchShopNames = async (shopIds) => {
    const shopMap = {};

    await Promise.all(
      shopIds.map(async (id) => {
        try {
          const res = await fetch(
            `https://kltn.azurewebsites.net/api/shops/${id}`
          );
          if (res.ok) {
            const shop = await res.json();
            shopMap[id] = shop.name || `Cửa hàng #${id}`;
          } else {
            shopMap[id] = `Cửa hàng #${id}`; // fallback
          }
        } catch {
          shopMap[id] = `Cửa hàng #${id}`;
        }
      })
    );

    return shopMap;
  };
  const [shopNames, setShopNames] = useState({});

  useEffect(() => {
    const uniqueShopIds = [...new Set(cartItems.map((item) => item.shopId))];
    if (uniqueShopIds.length > 0) {
      fetchShopNames(uniqueShopIds).then(setShopNames);
    }
  }, [cartItems]);

  // Group products by shopId
  const groupByShop = (items) => {
    const groups = {};
    items.forEach((item) => {
      if (!groups[item.shopId]) groups[item.shopId] = [];
      groups[item.shopId].push(item);
    });
    console.log(groups);
    return groups;
  };

  const groupedItems = groupByShop(cartItems);
  const checkedItems = cartItems.filter((item) => item.checked);
  const total = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Giỏ hàng</h2>
      <div className="cart-page-main">
        <div className="cart-page-left">
          {Object.entries(groupedItems).map(([shopId, items]) => (
            <div key={shopId} className="shop-cart-block">
              <h3 className="shop-name">
                {shopNames[shopId] || `Cửa hàng #${shopId}`}
              </h3>
              <CartList
                products={items}
                onIncrease={(id) =>
                  updateQuantity(
                    id,
                    cartItems.find((item) => item.productId === id).quantity + 1
                  )
                }
                onDecrease={(id) =>
                  updateQuantity(
                    id,
                    Math.max(
                      1,
                      cartItems.find((item) => item.productId === id).quantity -
                        1
                    )
                  )
                }
                onRemove={removeFromCart}
                onToggleCheck={toggleChecked}
                onToggleCheckAll={(checked) => {
                  items.forEach((item) =>
                    toggleChecked(item.productId, checked)
                  );
                }}
              />
            </div>
          ))}
        </div>

        <div className="cart-page-right">
          <ShippingInfo
            addresses={addresses}
            className="checkout-page-shippinginfo"
          />
          <OrderSummary cartItems={checkedItems} discounts={{}} />

          <CartSummary total={total} cartItems={checkedItems} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
