import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { BrowserRouter, Router } from "react-router-dom";
import Header from "./modules/user/components/Header/Header.jsx";
import Footer from "./modules/user/components/Footer/Footer.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AddressProvider } from "./contexts/AddressContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

function App() {
  return (
    <UserProvider>
      <AddressProvider>
        <CartProvider>
          <BrowserRouter>
            <Header />
            <AppRoutes />
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AddressProvider>
    </UserProvider>

    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Homepage />} />
    //     <Route
    //       path="/best-seller/:categoryName/:productName"
    //       element={<ProductDetailPage />}
    //     />{" "}
    //   </Routes>
    // </Router>
  );
}

export default App;
