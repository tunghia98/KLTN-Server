import React, { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartHistory, setCartHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm đăng nhập
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Hàm đăng xuất
  const logout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    setUser(null);
    setCartHistory([]);
    setOrderHistory([]);
  };

  // Thêm giỏ hàng vào lịch sử
  const addToCartHistory = (cart) => {
    setCartHistory((prev) => [...prev, cart]);
  };

  // Thêm đơn hàng vào lịch sử
  const addOrder = (order) => {
    setOrderHistory((prev) => [...prev, order]);
  };

  // Load user từ localStorage khi mở lại trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Biến kiểm tra trạng thái đăng nhập
  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLoggedIn,        
        cartHistory,
        orderHistory,
        login,
        logout,
        addToCartHistory,
        addOrder,
        
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook để dùng trong component
export const useUser = () => useContext(UserContext);
