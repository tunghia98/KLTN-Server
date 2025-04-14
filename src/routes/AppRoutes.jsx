import { Routes, Route } from "react-router-dom";
import toSlug from "../utils/toSlug.js";
import Homepage from "../pages/Homepage/Homepage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import Address from "../pages/AddressPage/AddressPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import SellerPage from "../pages/SellerPage/SellerPage.jsx";
import TermsOfServicePage from "../pages/TermsOfServicePage.jsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import WarrantyPolicyPage from "../pages/WarrantyPolicyPage.jsx";
import ForumHomePage from '../pages/Forum/ForumHomePage.jsx';
import ForumPage from '../pages/Forum/ForumPage.jsx';
import ThreadPage from '../pages/Forum/ThreadPage.jsx';
import PostPage from '../pages/Forum/PostPage.jsx';

// Import dữ liệu
import { categories, bestsellers, sellers, products } from "../data/data.js";


// Gộp tất cả products từ các category lại thành 1 mảng duy nhất
const allProducts = categories.flatMap((category) => category.products);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/products/:categorySlug" element={<ProductPage />} />
      <Route path="/products" element={<ProductPage />} />
      {/* Cập nhật đoạn này */}
      <Route path="/product/:productSlug" element={<ProductDetailPage products={products} />} />
      <Route path="/seller/:sellerId" element={<SellerPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/address" element={<Address />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage/>}/>
      <Route path="/privacy-policy" element={<	PrivacyPolicyPage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/warranty-policy" element={<WarrantyPolicyPage/>}/>
      <Route path="/forum" element ={<ForumHomePage/>} />
      <Route path="/forum/:id" element ={<ForumPage/>} />
      <Route path="/forum/:forumId/thread/:threadId" element={<ThreadPage/>} />
      <Route path="/forum/:forumId/thread/:threadId/post/:postId" element={<PostPage/>} />
    </Routes>
  );
};

export default AppRoutes;
