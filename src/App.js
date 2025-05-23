import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { BrowserRouter, Router } from "react-router-dom";
import Header from "./modules/user/components/Header/Header.jsx";
import Footer from "./modules/user/components/Footer/Footer.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AddressProvider } from "./contexts/AddressContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { SearchProvider } from "./contexts/SearchContext.jsx";
import Login from "./modules/user/components/AuthForm/Login";
import MainLayout from "./layouts/MainLayout.jsx";

function App() {
  return (
    <UserProvider>
      <AddressProvider>
        <CartProvider>
          <BrowserRouter>
                      <SearchProvider> {/* 👉 Bọc ở đây */}
                          <AppWithRouter />
                      </SearchProvider>
          </BrowserRouter>
        </CartProvider>
      </AddressProvider>
    </UserProvider>
  );
}

function AppWithRouter() {
  const location = useLocation();
  const navigate = useNavigate();

  const isManagementPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/seller");

  const handleCloseLogin = () => {
    navigate("/");
  };

  const Layout = isManagementPage ? React.Fragment : MainLayout;

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}
export default App;
