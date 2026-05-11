import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import useWishlistStore from './store/wishlistStore';
import VisualStylePage
from './pages/public/VisualStylePage';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import ChatBot from './components/chat/ChatBot';
import Loader from './components/common/Loader';

// Public pages
import HomePage from './pages/public/HomePage';
import ProductListingPage from './pages/public/ProductListingPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import SellerStorePage from './pages/public/SellerStorePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';
import CategoriesPage from './pages/public/CategoriesPage';
import LoginWithOTPPage
from './pages/public/LoginWithOTPPage';

import ForgotPasswordPage
from './pages/public/ForgotPasswordPage';


// Customer pages
import DashboardPage from './pages/customer/DashboardPage';
import ProfilePage from './pages/customer/ProfilePage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import WishlistPage from './pages/customer/WishlistPage';
import PaymentSuccessPage from './pages/customer/PaymentSuccessPage';

// Seller pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import AddProductPage from './pages/seller/AddProductPage';
import EditProductPage from './pages/seller/EditProductPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageSellersPage from './pages/admin/ManageSellersPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function App() {
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/admin');

  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/category/:slug" element={<ProductListingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/store/:vendorId" element={<SellerStorePage />} />
          <Route
  path="/login-otp"
  element={<LoginWithOTPPage />}
/>

<Route
  path="/forgot-password"
  element={<ForgotPasswordPage />}
/>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
  path="/visual-style"
  element={<VisualStylePage />}
  
/>

          {/* ✅ FIX: moved outside ProtectedRoute */}
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* Categories */}
          <Route path="/categories" element={<CategoriesPage />} />

          {/* Customer Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          {/* Seller Routes */}
          <Route element={<RoleRoute allowedRoles={['seller']} />}>
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/products/add" element={<AddProductPage />} />
            <Route path="/seller/products/edit/:id" element={<EditProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/analytics" element={<SellerAnalyticsPage />} />
            <Route path="/seller/profile" element={<SellerProfilePage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/sellers" element={<ManageSellersPage />} />
            <Route path="/admin/products" element={<ManageProductsPage />} />
            <Route path="/admin/orders" element={<ManageOrdersPage />} />
            <Route path="/admin/categories" element={<ManageCategoriesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Hide footer on dashboards */}
      {!isDashboard && <Footer />}

      <ChatBot />
    </div>
  );
}

export default App;