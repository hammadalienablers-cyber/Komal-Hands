import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface OverviewTabProps {
  onNavigateTab: (tab: 'products' | 'categories' | 'orders' | 'coupons' | 'settings') => void;
  onOpenAddProduct: () => void;
  onOpenAddCategory: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateTab,
  onOpenAddProduct,
  onOpenAddCategory,
}) => {
  const { products, orders, categories, updateOrderStatus } = useShop();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus !== 'delivered').length;
  const inStockProductsCount = products.filter((p) => p.inStock && p.stockCount > 0).length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              Rs. {totalRevenue.toLocaleString()}
            </h3>
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live</span>
            </span>
          </div>
          <p className="text-[11px] text-stone-400">Total customer orders placed</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              {totalOrdersCount}
            </h3>
            <span className="text-xs text-stone-500">
              {pendingOrders} in progress
            </span>
          </div>
          <p className="text-[11px] text-stone-400">COD & Online transactions</p>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Active Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              {products.length} Items
            </h3>
            <span className="text-xs text-emerald-700 font-medium">
              {inStockProductsCount} In Stock
            </span>
          </div>
          <p className="text-[11px] text-stone-400">Across {categories.length} categories</p>
        </div>

        {/* Pending Shipments */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Parcels</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              {pendingOrders}
            </h3>
            <span className="text-xs text-blue-700 font-medium">
              Awaiting Courier
            </span>
          </div>
          <p className="text-[11px] text-stone-400">Needs packing or delivery</p>
        </div>

      </div>

      {/* Quick Action Shortcuts Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-rose-300 font-semibold">
            Quick Actions
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-white">
            Manage Komal Accessories Store
          </h2>
          <p className="text-xs text-stone-400 max-w-xl">
            Add new products, adjust selling rates, replace images, organize categories, or update order statuses to notify customers instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-medium transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={onOpenAddCategory}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Orders ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-stone-500">Live order activity and status advancement</p>
            </div>

            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-rose-800 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5 font-medium">Order ID</th>
                  <th className="pb-2.5 font-medium">Customer</th>
                  <th className="pb-2.5 font-medium">City</th>
                  <th className="pb-2.5 font-medium">Total (PKR)</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 font-mono font-semibold text-stone-900">
                      {order.id}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-stone-900">{order.customerName}</p>
                      <p className="text-[11px] text-stone-400">{order.phone}</p>
                    </td>
                    <td className="py-3 text-stone-600">{order.city}</td>
                    <td className="py-3 font-mono tabular-nums font-semibold text-stone-900">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'out_for_delivery'
                          ? 'bg-amber-100 text-amber-800'
                          : order.orderStatus === 'dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {order.orderStatus === 'out_for_delivery' 
                          ? 'Out for Delivery' 
                          : order.orderStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {order.orderStatus === 'placed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'packed')}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-[11px] font-medium transition-colors"
                        >
                          Mark Packed
                        </button>
                      )}
                      {order.orderStatus === 'packed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'dispatched')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md text-[11px] font-medium transition-colors"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.orderStatus === 'dispatched' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-[11px] font-medium transition-colors"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.orderStatus === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-medium transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.orderStatus === 'delivered' && (
                        <span className="text-emerald-700 font-medium text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert & Category Quick Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Low Stock Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Stock Watchlist</span>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-stone-500">
                All inventory items have healthy stock levels.
              </p>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-stone-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-stone-500">Rs. {p.price.toLocaleString()}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-950 font-mono font-bold rounded text-[10px] whitespace-nowrap">
                      {p.stockCount} left
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium transition-colors"
            >
              Manage Inventory Stock
            </button>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-medium text-stone-900">
                Categories Overview
              </h4>
              <button
                onClick={() => onNavigateTab('categories')}
                className="text-xs text-rose-800 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {categories.map((c) => {
                const count = products.filter((p) => c.id === 'all' ? true : p.category === c.id).length;
                return (
                  <div key={c.id} className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg">
                    <span className="text-stone-700 font-medium">{c.label}</span>
                    <span className="font-mono text-stone-500 tabular-nums">{count} items</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
