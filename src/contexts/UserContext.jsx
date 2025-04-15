// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartHistory, setCartHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setCartHistory([]);
    setOrderHistory([]);
  };
  const addToCartHistory = (cart) => setCartHistory(prev => [...prev, cart]);
  const addOrder = (order) => setOrderHistory(prev => [...prev, order]);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <UserContext.Provider value={{
      user,
      cartHistory,
      orderHistory,
      login,
      logout,
      addToCartHistory,
      addOrder,
      setUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng thông tin user
export const useUser = () => useContext(UserContext);
