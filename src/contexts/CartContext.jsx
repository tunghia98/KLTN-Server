import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./UserContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();
  const accessToken = localStorage.getItem("accessToken");

  const fetchCartFromBackend = async () => {
    if (!accessToken) return;

    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/Cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Không lấy được giỏ hàng");

      const data = await res.json();
      setCartItems(
        data.map((item) => ({
          ...item,
          checked: true, // mặc định được chọn
        }))
      );
    } catch (err) {
      console.error("❌ Lỗi khi fetch giỏ hàng:", err.message);
      toast.error("Lỗi khi tải giỏ hàng");
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartFromBackend();
    } else {
      setCartItems([]); // 🧹 Xoá giỏ khi user đăng xuất
    }
  }, [user]);

  const addToCart = async (product) => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập.");
      return;
    }

    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/Cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!res.ok) throw new Error(await res.text());
      await fetchCartFromBackend(); // cập nhật lại cart từ server
    } catch (err) {
      console.error("❌ Lỗi thêm vào giỏ:", err.message);
      toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
    }
  };

  const removeFromCart = async (productId) => {
    if (!accessToken) return;

    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/Cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error(await res.text());
      await fetchCartFromBackend();
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err.message);
      toast.error("Lỗi khi xóa sản phẩm khỏi giỏ");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!accessToken) return;

    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/Cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ productId, quantity }),
        }
      );

      if (!res.ok) throw new Error(await res.text());
      await fetchCartFromBackend();
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err.message);
      toast.error("Lỗi khi cập nhật số lượng sản phẩm");
    }
  };

  const toggleChecked = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const toggleCheckAll = (checked) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleChecked,
        toggleCheckAll,
        clearCart,
        fetchCartFromBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
