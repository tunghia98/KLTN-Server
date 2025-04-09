import { Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage/Homepage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import Address from "../pages/AddressPage/AddressPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";

// Import dữ liệu
import { categories, bestsellers, sellers } from "../pages/Homepage/test";

// Gộp tất cả products từ các category lại thành 1 mảng duy nhất
const allProducts = categories.flatMap((category) => category.products);

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Homepage
            categories={categories}
            bestsellers={bestsellers}
            sellers={sellers}
          />
        }
      />
       <Route path="/products/:categoryName" element={<ProductPage categories={categories} />} />
      <Route
        path="/products/:productId"
        element={<ProductDetailPage products={allProducts} />}
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/address" element={<Address />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route
        path="/best-seller/:categoryName/:productName"
        element={<ProductDetailPage products={allProducts} />}
      />
    </Routes>
  );
};

export default AppRoutes;
