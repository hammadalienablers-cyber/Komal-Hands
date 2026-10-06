import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Eye, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ArrowLeft,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { OverviewTab } from './OverviewTab';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';
import { OrdersTab } from './OrdersTab';
import { CouponsTab } from './CouponsTab';
import { SettingsTab } from './SettingsTab';

export const AdminDashboard: React.FC = () => {
  const { 
    setIsAdminMode, 
    logoutAdmin, 
    storeSettings, 
    orders, 
    products, 
    categories 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'coupons' | 'settings'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Quick navigation handlers
  const handleNavigateTab = (tab: any) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'delivered').length;

  const navItems = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Rates', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categories', icon: FolderTree, badge: categories.length },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined, badgeColor: 'bg-rose-600 text-white' },
    { id: 'coupons', label: 'Coupons & Promo', icon: Tag },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col text-stone-900">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Left: Mobile hamburger & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="p-2 -ml-2 text-stone-300 hover:text-white lg:hidden rounded-lg"
                aria-label="Toggle admin sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-white">
                  {storeSettings.storeName}
                </span>
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-full">
                  Admin Portal
                </span>
              </div>
            </div>

            {/* Right: Quick Storefront Switch & Download & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/komal-accessories-full-source.zip"
                download="komal-accessories-full-source.zip"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-xs active:scale-95"
                title="Download complete project ZIP to connect with GitHub"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Download ZIP for GitHub</span>
                <span className="md:hidden">ZIP</span>
              </a>

              <button
                onClick={() => setIsAdminMode(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-colors cursor-pointer"
                title="Preview live customer storefront"
              >
                <Eye className="w-4 h-4 text-rose-300" />
                <span className="hidden sm:inline">View Live Store</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                title="Log out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Red Banner when Supabase is not configured */}
      {!isSupabaseConfigured && (
        <aside 
          aria-label="Demo mode warning" 
          className="bg-rose-700 text-white px-4 py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-inner"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-200" />
          <span>
            ⚠️ DEMO MODE: Supabase backend is not connected. Products and orders are stored locally in mock memory and will NOT save online. Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
          </span>
        </aside>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex gap-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Management Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-300' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.badgeColor || (isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-rose-50/80 rounded-2xl border border-rose-100 p-4 text-xs text-rose-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Direct Storefront Sync</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Every product added, rate changed, or image replaced updates the customer store immediately with zero delay.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <span className="font-serif text-lg font-medium text-stone-900">
                    Store Manager
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigateTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 bg-stone-200 rounded-full font-mono">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    setIsAdminMode(false);
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Return to Storefront</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab
              onNavigateTab={handleNavigateTab}
              onOpenAddProduct={() => setActiveTab('products')}
              onOpenAddCategory={() => setActiveTab('categories')}
            />
          )}

          {activeTab === 'products' && <ProductsTab />}

          {activeTab === 'categories' && <CategoriesTab />}

          {activeTab === 'orders' && <OrdersTab />}

          {activeTab === 'coupons' && <CouponsTab />}

          {activeTab === 'settings' && <SettingsTab />}
        </main>

      </div>
    </div>
  );
};
