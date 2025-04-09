import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { BrowserRouter, Router } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { CartProvider } from "../src/components/Cart/CartContext.jsx";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </CartProvider>

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
