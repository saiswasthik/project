import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/Home/HomePage';
import VendorStore from './pages/VendorStore/VendorStore';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import CategoryPage from './pages/Category/CategoryPage';

// Dashboard Components
import DashboardLayout from './components/Dashboard/DashboardLayout';
import VendorOverview from './pages/VendorDashboard/Overview/VendorOverview';
import VendorOrders from './pages/VendorDashboard/Orders/VendorOrders';
import VendorProducts from './pages/VendorDashboard/Products/VendorProducts';

// Admin Components
import AdminLayout from './components/Dashboard/AdminLayout';
import AdminOverview from './pages/AdminDashboard/Overview/AdminOverview';
import VendorApproval from './pages/AdminDashboard/Vendors/VendorApproval';
import AdminOrderMonitoring from './pages/AdminDashboard/Orders/AdminOrderMonitoring';

// Vendor Registration/Discovery
import VendorRegistration from './pages/VendorRegistration/VendorRegistration';
import VendorLogin from './pages/VendorLogin/VendorLogin';

// UX Components
import PageTransition from './components/Shared/PageTransition';
import { ToastProvider } from './components/Shared/ToastContext';
import { ThemeProvider } from './components/Shared/ThemeContext';
import { VendorProvider } from './components/Shared/VendorContext';
import { CartProvider } from './components/Shared/CartContext';
import { ProductProvider } from './components/Shared/ProductContext';
import { OrderProvider } from './components/Shared/OrderContext';

const MainLayout = ({ children }) => (
  <div className="with-navbar">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Vendor Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout><PageTransition><VendorOverview /></PageTransition></DashboardLayout>} />
        <Route path="/dashboard/orders" element={<DashboardLayout><PageTransition><VendorOrders /></PageTransition></DashboardLayout>} />
        <Route path="/dashboard/products" element={<DashboardLayout><PageTransition><VendorProducts /></PageTransition></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><PageTransition><div className="card p-8"><h1>Settings</h1><p>Store settings configuration coming soon.</p></div></PageTransition></DashboardLayout>} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout><PageTransition><AdminOverview /></PageTransition></AdminLayout>} />
        <Route path="/admin/vendors" element={<AdminLayout><PageTransition><VendorApproval /></PageTransition></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><PageTransition><AdminOrderMonitoring /></PageTransition></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><PageTransition><div className="card p-8"><h1>Security Settings</h1><p>Platform security and global configs.</p></div></PageTransition></AdminLayout>} />

        {/* Main Site Routes */}
        <Route path="/" element={<MainLayout><PageTransition><HomePage /></PageTransition></MainLayout>} />
        <Route path="/vendor/:id" element={<MainLayout><PageTransition><VendorStore /></PageTransition></MainLayout>} />
        <Route path="/cart" element={<MainLayout><PageTransition><CartPage /></PageTransition></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><PageTransition><CheckoutPage /></PageTransition></MainLayout>} />
        <Route path="/orders" element={<MainLayout><PageTransition><OrderHistory /></PageTransition></MainLayout>} />
        <Route path="/sell" element={<MainLayout><PageTransition><VendorRegistration /></PageTransition></MainLayout>} />
        <Route path="/vendor-login" element={<MainLayout><PageTransition><VendorLogin /></PageTransition></MainLayout>} />
        <Route path="/category/:categoryName" element={<MainLayout><PageTransition><CategoryPage /></PageTransition></MainLayout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <VendorProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <ToastProvider>
                <Router>
                  <div className="app">
                    <AnimatedRoutes />
                  </div>
                </Router>
              </ToastProvider>
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </VendorProvider>
    </ThemeProvider>
  );
}

export default App;
