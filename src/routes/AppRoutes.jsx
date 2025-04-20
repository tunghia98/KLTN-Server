import { Routes, Route } from "react-router-dom";
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
import UserInfoPage from "../modules/user/pages/UserInfoPage/UserInfoPage.jsx";
import { useUser } from "../contexts/UserContext";
import PrivateRoute from "../components/PrivateRoute.jsx";
import ManageUsers from "../modules/admin/pages/ManageUsers.jsx";
import ApproveSellers from "../modules/admin/pages/ApproveSellers.jsx";
import ManageForum from "../modules/admin/pages/ManageForum.jsx";
import EditLogo from "../modules/admin/pages/EditLogo.jsx";
import SellerOnboarding from "../modules/user/components/Onboarding/SellerOnboarding.jsx";
import Login from "../modules/user/components/AuthForm/Login.jsx";
import ManagementLayout from "../layouts/ManagementLayout.jsx"; // Đảm bảo dùng chung layout
import OrdersManagementPage from "../modules/seller/pages/Orders/OrdersManagementPage.jsx";
import ProductsManagementPage from "../modules/seller/pages/Products/ProductsManagementPage.jsx";
import OrderDetailPage from "../modules/seller/pages/Orders/OrderManagementDetailPage.jsx";

const AppRoutes = () => {
  const { user } = useUser();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Homepage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
      <Route path="/profile" element={<UserInfoPage />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/forum/thread/:title" element={<ThreadDetailPage />} />
      <Route path="/seller/:sellername" element={<SellerInfoPage />} />

      {/* Seller and Admin Routes using ManagementLayout */}
      <Route
        path="/seller/dashboard"
        element={
          <PrivateRoute allowedRoles={['seller', 'admin']}>
            <ManagementLayout/>
          </PrivateRoute>
        }
      />
      <Route 
        path="/seller/orders" 
        element={
          <PrivateRoute allowedRoles={['seller', 'admin']}>
            <ManagementLayout>
              <OrdersManagementPage>
              </OrdersManagementPage>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route 
        path="/seller/orders/:orderId" 
        element={
          <PrivateRoute allowedRoles={['seller', 'admin']}>
            <ManagementLayout>
              <OrderDetailPage/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route 
        path="/seller/products"
        element={
          <PrivateRoute allowedRoles={['seller', 'admin']}>
          <ManagementLayout>
            <ProductsManagementPage />
          </ManagementLayout>
        </PrivateRoute>
        }
      />
{/* ADMIN */}
      
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route 
        path="/seller/products"
        element={
          <PrivateRoute allowedRoles={['seller', 'admin']}>
          <ManagementLayout>
            <ProductsManagementPage />
          </ManagementLayout>
        </PrivateRoute>
        }
      />

      <Route
        path="/admin/manage-users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <ManageUsers />
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/approve-sellers"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <ApproveSellers />
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/manage-forum"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <ManageForum />
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/edit-avatar"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <EditLogo />
            </ManagementLayout>
          </PrivateRoute>
        }
      />

      {/* Seller Onboarding Route */}
      <Route path="/onboarding" element={<SellerOnboarding />} />

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<h2>Không có quyền truy cập!</h2>} />
    </Routes>
  );
};

export default AppRoutes;
