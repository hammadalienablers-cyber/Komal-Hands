/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { UnconfiguredStoreScreen } from './components/UnconfiguredStoreScreen';
import { isSupabaseConfigured } from './lib/supabase';
import { MessageCircle, LayoutDashboard, AlertCircle } from 'lucide-react';

function StoreApp() {
  const { 
    isAdminMode, 
    isAdminAuthenticated, 
    setIsAdminMode, 
    storeSettings 
  } = useShop();

  // In production, refuse to run in silent demo mode if Supabase is unconfigured
  if (!isSupabaseConfigured && !import.meta.env.DEV) {
    return <UnconfiguredStoreScreen />;
  }

  // If in Admin Mode and Authenticated, render complete Admin Dashboard
  if (isAdminMode && isAdminAuthenticated) {
    return (
      <>
        <AdminDashboard />
        <AdminLoginModal />
      <CustomerAuthModal />
      <CustomerAccountModal />
      </>
    );
  }

  // Customer Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      
      {/* Dev Mode Banner when Supabase is not configured */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-400 text-stone-950 font-bold px-4 py-2 text-center text-xs tracking-wide shadow-xs flex items-center justify-center gap-2 sticky top-0 z-50">
          <AlertCircle className="w-4 h-4 shrink-0 text-stone-950" />
          <span>DEMO MODE — data is not saved online (Supabase unconfigured)</span>
        </div>
      )}

      {/* If admin is logged in, show floating Store Manager quick-access toggle on bottom-left */}
      {isAdminAuthenticated && (
        <aside 
          aria-label="Admin bar" 
          className="fixed bottom-6 left-6 z-40"
        >
          <button
            onClick={() => setIsAdminMode(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-2xl border border-stone-700 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <LayoutDashboard className="w-3.5 h-3.5 text-rose-300" />
            <span>Store Manager Panel</span>
          </button>
        </aside>
      )}

      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner Section */}
        <Hero />

        {/* Product Catalog with Live Search & Category Filtering */}
        <ProductGrid />

        {/* Verified Customer Reviews Section */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Slide-out Drawers & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <WishlistDrawer />
      <AdminLoginModal />

      {/* Floating WhatsApp Care Action Button */}
      <aside 
        aria-label="Customer support floating button"
        className="fixed bottom-6 right-6 z-30"
      >
        <a
          href={`https://wa.me/${storeSettings.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group text-xs font-semibold"
          title="Chat with Komal Accessories on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">WhatsApp Care</span>
        </a>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <StoreApp />
    </ShopProvider>
  );
}
