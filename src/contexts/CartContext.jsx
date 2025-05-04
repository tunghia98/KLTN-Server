import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const accessToken = localStorage.getItem("accessToken");;
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
        }
    };

    useEffect(() => {
        fetchCartFromBackend();
    }, [accessToken]);

    const addToCart = async (product) => {
        if (!accessToken) return alert("Vui lòng đăng nhập.");

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
