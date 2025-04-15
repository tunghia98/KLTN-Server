import { Routes, Route } from "react-router-dom";
import toSlug from "../utils/toSlug.js";
import Homepage from "../modules/user/pages/Homepage/Homepage";
import ProductPage from "../modules/user/pages/ProductPage/ProductPage";
import ProductDetailPage from "../modules/user/pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../modules/user/pages/CartPage/CartPage";
import Address from "../modules/user/pages/AddressPage/AddressPage";
import CheckoutPage from "../modules/user/pages/CheckoutPage/CheckoutPage";
import SellerInfoPage from "../modules/user/pages/SellerInfoPage/SellerInfoPage.jsx";
import TermsOfServicePage from "../modules/user/pages/TermsOfServicePage.jsx";
import PrivacyPolicyPage from "../modules/user/pages/PrivacyPolicyPage.jsx";
import AboutPage from "../modules/user/pages/AboutPage.jsx";
import ContactPage from "../modules/user/pages/ContactPage.jsx";
import WarrantyPolicyPage from "../modules/user/pages/WarrantyPolicyPage.jsx";
import ForumPage from '../modules/user/pages/Forum/ForumPage.jsx';
import ThreadDetailPage from '../modules/user/pages/Forum/ThreadDetailPage.jsx';
// Import dữ liệu
import { categories, bestsellers, sellers, products } from "../data/data.js";
import UserInfoPage from "../modules/user/pages/UserInfoPage/UserInfoPage.jsx";
import { useUser } from "../contexts/UserContext";
import PrivateRoute from "../components/PrivateRoute.jsx";
import SellerDashboard from "../pages/SellerDashboard/SellerDashboard.jsx";
import AdminDashboard from "../modules/admin/pages/AdminDashboard.jsx";
import ManageUsers from "../modules/admin/pages/ManageUsers.jsx";
import ApproveSellers from "../modules/admin/pages/ApproveSellers.jsx";
import ManageForum from "../modules/admin/pages/ManageForum.jsx";
import EditLogo from "../modules/admin/pages/EditLogo.jsx";
// Gộp tất cả products từ các category lại thành 1 mảng duy nhất
const allProducts = categories.flatMap((category) => category.products);

const AppRoutes = () => {
  const { user } = useUser();
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/products/:categorySlug" element={<ProductPage />} />
      <Route path="/products" element={<ProductPage />} />
      {/* Cập nhật đoạn này */}
      <Route path="/product/:productSlug" element={<ProductDetailPage products={products} />} />
      <Route path="/seller/:sellerId" element={<SellerInfoPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/address" element={<Address />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage/>}/>
      <Route path="/privacy-policy" element={<	PrivacyPolicyPage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/profile" element ={<UserInfoPage/>}/>
      <Route path="/warranty-policy" element={<WarrantyPolicyPage/>}/>
      <Route path="/forum" element ={<ForumPage/>} />
      <Route path="/forum/thread/:title" element={<ThreadDetailPage/>} />
      {/* Seller Route */}
      <Route
        path="/seller/dashboard"
        element={
          <PrivateRoute allowedRoles={['seller', 'admin']}>
            <SellerDashboard />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/manage-users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManageUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/approve-sellers"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ApproveSellers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/manage-forum"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManageForum />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-avatar"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <EditLogo />
          </PrivateRoute>
        }
      />

      {/* Optional: Trang nếu user không có quyền */}
      <Route path="/unauthorized" element={<h2>Không có quyền truy cập!</h2>} />

    </Routes>
  );
};

export default AppRoutes;
