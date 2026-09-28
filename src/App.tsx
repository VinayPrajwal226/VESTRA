import React, { useEffect, useState } from 'react';
import { AdminSidebar } from './components/AdminSidebar.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { Footer } from './components/Footer.tsx';
import { Navbar } from './components/Navbar.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { AdminCategories } from './pages/AdminCategories.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AdminMedia } from './pages/AdminMedia.tsx';
import { AdminOrders } from './pages/AdminOrders.tsx';
import { AdminProducts } from './pages/AdminProducts.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { Home } from './pages/Home.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { Shop } from './pages/Shop.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'media'>('overview');
  const { user, isAdmin } = useAuth();

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine active view
  const renderContent = () => {
    // Admin routes
    if (currentPath.startsWith('/admin')) {
      if (!isAdmin) {
        return (
          <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
            <h2 className="text-xl font-serif text-[#1C1917]">Atelier Administrator Access Required</h2>
            <p className="text-xs text-[#78716C]">
              Please authenticate using administrator credentials to view atelier metrics and catalog management.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#1C1917] text-white px-6 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>
        );
      }

      return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAF9]">
          <AdminSidebar currentTab={adminTab} setTab={setAdminTab} navigate={navigate} />
          <div className="flex-1 overflow-y-auto">
            {adminTab === 'overview' && <AdminDashboard navigate={navigate} setTab={setAdminTab} />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'categories' && <AdminCategories />}
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'media' && <AdminMedia />}
          </div>
        </div>
      );
    }

    // Public / Storefront routes
    if (currentPath === '/') {
      return <Home navigate={navigate} />;
    }

    if (currentPath === '/shop') {
      return <Shop navigate={navigate} />;
    }

    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      return <CategoryPage slug={slug} navigate={navigate} />;
    }

    if (currentPath.startsWith('/product/')) {
      const idOrSlug = currentPath.replace('/product/', '');
      return <ProductDetail idOrSlug={idOrSlug} navigate={navigate} />;
    }

    if (currentPath === '/search') {
      return <SearchPage navigate={navigate} />;
    }

    if (currentPath === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    if (currentPath.startsWith('/order-success/')) {
      const orderId = currentPath.replace('/order-success/', '');
      return <OrderSuccessPage orderId={orderId} navigate={navigate} />;
    }

    if (currentPath === '/wishlist') {
      return <WishlistPage navigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }

    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage navigate={navigate} />;
    }

    if (currentPath === '/account') {
      if (!user) {
        return <LoginPage navigate={navigate} />;
      }
      return <AccountPage navigate={navigate} />;
    }

    // Default 404 fallback
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="text-3xl font-serif text-[#1C1917]">404 — Page Not Found</h1>
        <p className="text-xs text-[#78716C]">
          The atelier coordinates you requested could not be located.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#1C1917] text-white py-2.5 px-6 text-xs uppercase tracking-wider font-semibold cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  };

  const isAdminView = currentPath.startsWith('/admin') && isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#1C1917]">
      {!isAdminView && <Navbar currentPath={currentPath} navigate={navigate} />}
      <main className="flex-1">{renderContent()}</main>
      {!isAdminView && <Footer navigate={navigate} />}
      <CartDrawer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainRouter />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
