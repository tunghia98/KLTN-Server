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
import SellerOnboarding from "../modules/user/components/Onboarding/SellerOnboarding.jsx";
import Login from "../modules/user/components/AuthForm/Login.jsx";
import ManagementLayout from "../layouts/ManagementLayout.jsx"; // Đảm bảo dùng chung layout
import OrdersManagementPage from "../modules/seller/pages/Orders/OrdersManagementPage.jsx";
import ProductsManagementPage from "../modules/seller/pages/Products/ProductsManagementPage.jsx";
import OrderDetailPage from "../modules/seller/pages/Orders/OrderManagementDetailPage.jsx";
import EditProductPage from "../modules/seller/pages/Products/EditProductPage.jsx";
import RevenueManagementPage from "../modules/seller/pages/Revenue/RevenueManagementPage.jsx";
import { useState } from "react";
import PromotionsManagementPage from "../modules/seller/pages/Promotion/PromotionsManagementPage.jsx";
import ShippingManagementPage from "../modules/seller/pages/Shipping/ShippingManagementPage.jsx";
import ProductPromoted from "../modules/seller/pages/Promotion/ProductPromoted.jsx";
import SellerReviewsPage from "../modules/seller/pages/ProductReview/SellerReviewPage.jsx";
import ChatPage from "../modules/seller/pages/Chat/ChatPage.jsx";
import UserManagement from "../modules/admin/pages/UserManagement/UserManagement.jsx";
import SellerManagement from "../modules/admin/pages/SellerManagement/SellerManagement.jsx";
import TransactionManagement from "../modules/admin/pages/TransactionManagement/TransactionManagement.jsx";
import StatisticsDashboard from "../modules/admin/pages/StatisticsDashboard/StatisticsDashboard.jsx";
import AccessControlSettings from "../modules/admin/pages/AccessControl/AccessControlSettings.jsx";
import ViolationManagement from "../modules/admin/pages/ViolationManagement/ViolationManagement.jsx";
import SupportRequestManagement from "../modules/admin/pages/SupportRequestManagement/SupportRequestManagement.jsx";
import SupportChannelManagement from "../modules/admin/pages/SupportChannelManagement/SupportChannelManagement.jsx";
import WebsiteCustomization from "../modules/admin/pages/WebsiteCustomization/WebsiteCustomization.jsx";
const AppRoutes = () => {
  const { user } = useUser();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Homepage />} />
      <Route path="/register" element={<Homepage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
      <Route path="/profile" element={<UserInfoPage />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/forum/thread/:title" element={<ThreadDetailPage />} />
      <Route path="/sellers/:sellerSlug" element={<SellerInfoPage />} />
          <Route path="/products/:productSlug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
      {/* Seller and Admin Routes using ManagementLayout */}
      <Route
        path="/seller/dashboard"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout/>
          </PrivateRoute>
        }
      />
      <Route 
        path="/seller/orders" 
        element={
          <PrivateRoute allowedRoles={['seller']}>
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
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <OrderDetailPage/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
      <Route 
        path="/seller/products"
        element={
          <PrivateRoute allowedRoles={['seller']}>
          <ManagementLayout>
            <ProductsManagementPage />
          </ManagementLayout>
        </PrivateRoute>
        }
      />
      <Route
        path="/seller/products/edit/:productId"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <EditProductPage />
            </ManagementLayout>
          </PrivateRoute> 
        }
        />
        <Route
        path="/seller/revenue"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <RevenueManagementPage/>
            </ManagementLayout>
          </PrivateRoute>
        }
        />
        <Route
        path="/seller/promotions"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <PromotionsManagementPage/>
            </ManagementLayout>
          </PrivateRoute>
        }
        />
        <Route
        path="/seller/delivery"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <ShippingManagementPage/>
            </ManagementLayout>
          </PrivateRoute>
        }
        />
        <Route
        path="/seller/review"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <SellerReviewsPage/>
            </ManagementLayout>
          </PrivateRoute>
        }
        />
        <Route
        path="/seller/chat"
        element={
          <PrivateRoute allowedRoles={['seller']}>
            <ManagementLayout>
              <ChatPage/>
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
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <UserManagement/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/sellers"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <SellerManagement/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/transaction"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <TransactionManagement/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/statistics"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <StatisticsDashboard/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/access-control"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <AccessControlSettings/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/violation"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <ViolationManagement/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/support-request"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <SupportRequestManagement/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/support-channel"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <SupportChannelManagement/>
            </ManagementLayout>
          </PrivateRoute>
        }
      />
            <Route
        path="/admin/customization"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ManagementLayout>
              <WebsiteCustomization/>
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
