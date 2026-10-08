import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  X, 
  Package, 
  Menu, 
  Sparkles,
  PhoneCall,
  ShieldCheck,
  LayoutDashboard,
  UserCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    cartSubtotal,
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen,
    openOrderTrackerWithId,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    categories,
    storeSettings,
    isAdminAuthenticated,
    setIsAdminMode,
    setIsAdminLoginOpen,
    customerUser,
    setIsCustomerAuthOpen,
    setIsCustomerAccountOpen
  } = useShop();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (cat: ProductCategory) => {
    setActiveCategory(cat);
    setMobileMenuOpen(false);
    // Smooth scroll to catalog section
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setIsAdminMode(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar with Dynamic Text */}
      <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-rose-300" />
        <span>{storeSettings.announcementText}</span>
      </div>

      {/* Main Top Bar - Strict 3-zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button (Mobile only) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 -ml-2 text-stone-700 hover:text-stone-900 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Zone 1: Single text element Brand Wordmark */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col"
            >
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 transition-colors group-hover:text-rose-900">
                {storeSettings.storeName}
              </span>
            </a>
          </div>

          {/* Zone 2: Dynamic Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7">
            {categories.slice(0, 6).map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                    isActive 
                      ? 'text-stone-900 font-semibold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 Primary Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle Button or Desktop Search Bar */}
            <div className="relative">
              {isSearchActive ? (
                <div className="flex items-center bg-white border border-stone-300 rounded-full px-3 py-1.5 shadow-sm transition-all w-52 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hair clips, jewelry..."
                    autoFocus
                    className="w-full pl-2 pr-1 text-xs sm:text-sm bg-transparent border-none outline-none text-stone-800 placeholder:text-stone-400"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchActive(false);
                    }}
                    className="text-stone-400 hover:text-stone-600 p-0.5"
                    aria-label="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchActive(true)}
                  aria-label="Search Catalog"
                  className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                  title="Search items"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Track Order Direct Button */}
            <button
              onClick={() => openOrderTrackerWithId()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 rounded-full hover:bg-stone-100 transition-colors"
              title="Track live order status"
            >
              <Package className="w-3.5 h-3.5 text-rose-600" />
              <span>Track Order</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="View Saved Wishlist"
              className="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Bag"
              className="flex items-center gap-2 pl-3 pr-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-all shadow-sm active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-400 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono tabular-nums">
                Rs. {cartSubtotal.toLocaleString()}
              </span>
            </button>

            {/* Customer Account Button */}
            <button
              onClick={() => customerUser ? setIsCustomerAccountOpen(true) : setIsCustomerAuthOpen(true)}
              className="p-2 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              title={customerUser ? 'My Account' : 'Customer Login'}
              aria-label={customerUser ? 'My Account' : 'Customer Login'}
            >
              <UserCircle className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-medium">{customerUser ? 'Account' : 'Sign In'}</span>
            </button>

            {/* Admin Portal Toggle Button */}
            <button
              onClick={handleAdminClick}
              className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${
                isAdminAuthenticated 
                  ? 'bg-rose-100 text-rose-900 hover:bg-rose-200' 
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Store Manager Dashboard"
              aria-label="Admin Portal"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-medium">
                {isAdminAuthenticated ? 'Manager' : 'Admin'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF9F6] shadow-xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <span className="font-serif text-xl font-medium text-stone-900">
                  {storeSettings.storeName}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-500 hover:text-stone-800"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
                  Categories
                </p>
                <div className="flex flex-col space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-rose-50 text-rose-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openOrderTrackerWithId();
                  }}
                  className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-stone-800 hover:bg-stone-100 font-medium"
                >
                  <Package className="w-4 h-4 text-rose-600" />
                  <span>Track Live Order</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm text-stone-800 hover:bg-stone-100 font-medium"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Saved Wishlist</span>
                  </div>
                  <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-mono">
                    {wishlist.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAdminClick();
                  }}
                  className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-stone-800 bg-stone-100 hover:bg-stone-200 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-700" />
                  <span>Store Manager (Admin Portal)</span>
                </button>
              </div>
            </div>

            {/* Mobile Drawer Footer info */}
            <div className="pt-6 border-t border-stone-200 space-y-3 text-xs text-stone-500">
              <a 
                href={`https://wa.me/${storeSettings.whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-700 font-medium p-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp Care: {storeSettings.phone}</span>
              </a>
              <p className="text-[11px] text-stone-400">
                Lahore Studio • Delivery All Over Pakistan
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
