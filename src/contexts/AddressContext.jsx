import React, { createContext, useState, useContext, useEffect } from "react";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [defaultAddress, setDefaultAddress] = useState(() => {
    // Lấy từ localStorage khi load lần đầu
    const saved = localStorage.getItem("defaultAddress");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (defaultAddress) {
      localStorage.setItem("defaultAddress", JSON.stringify(defaultAddress));
    }
  }, [defaultAddress]);

  return (
    <AddressContext.Provider value={{ defaultAddress, setDefaultAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
