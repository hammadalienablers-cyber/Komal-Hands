import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Heart, 
  MapPin, 
  User, 
  Phone, 
  LogOut, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus } from '../types';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isCustomerAccountOpen, 
    setIsCustomerAccountOpen, 
    customerUser, 
    customerProfile, 
    customerOrders, 
    wishlist,
    products, 
    openOrderTrackerWithId, 
    signOutCustomer,
    updateCustomerProfile,
    setIsWishlistOpen,
    setIsCartOpen
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');
  
  // Profile edit form
  const [fullName, setFullName] = useState(customerProfile?.fullName || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [city, setCity] = useState(customerProfile?.city || '');
  const [address, setAddress] = useState(customerProfile?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  React.useEffect(() => {
    if (customerProfile) {
      setFullName(customerProfile.fullName || '');
      setPhone(customerProfile.phone || '');
      setCity(customerProfile.city || '');
      setAddress(customerProfile.address || '');
    }
  }, [customerProfile]);

  if (!isCustomerAccountOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);

    const res = await updateCustomerProfile({
      fullName,
      phone,
      city,
      address,
    });

    setSavingProfile(false);
    if (res.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Confirmed</span>;
      case 'packed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Gift Packed</span>;
      case 'dispatched':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Dispatched</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">Processing</span>;
    }
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-stone-900 text-white relative">
          <button
            onClick={() => setIsCustomerAccountOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 flex items-center justify-center font-serif text-2xl font-bold">
              {(customerProfile?.fullName || customerUser?.email || 'K')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight">
                  {customerProfile?.fullName || 'Valued Customer'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-rose-500/20 text-rose-300 border border-rose-400/20">
                  Verified
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5 font-mono">
                {customerUser?.email || customerProfile?.email}
              </p>
            </div>
          </div>

          {/* Daraz / Amazon Style Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'orders' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My Orders ({customerOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Saved Address & Info</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'wishlist' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlist.length})</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-stone-900">No Orders Placed Yet</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    Your previous order history will appear here once you place an order.
                  </p>
                  <button
                    onClick={() => {
                      setIsCustomerAccountOpen(false);
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-4 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    Explore Boutique Catalog &rarr;
                  </button>
                </div>
              ) : (
                customerOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-stone-300 bg-white transition-all shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">
                            #{order.id}
                          </span>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Placed on {order.createdAt}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-stone-900">
                          Rs. {order.total.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img 
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200'} 
                            alt={item.product?.name || 'Product'}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-900 truncate">
                              {item.product?.name}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              Qty: {item.quantity} • {item.selectedColor}
                            </p>
                          </div>
                          <span className="text-xs font-mono text-stone-700">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-[11px] text-stone-500">
                        {order.courierName ? (
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-stone-400" />
                            <span>{order.courierName} ({order.trackingNumber})</span>
                          </span>
                        ) : (
                          <span className="text-stone-400">Courier assigned upon packaging</span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsCustomerAccountOpen(false);
                          openOrderTrackerWithId(order.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                      >
                        <span>Live Tracking</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg mx-auto">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Save your delivery details once. We will auto-fill your name, phone, and address on all future orders!
                </span>
              </div>

              {profileSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profile and default delivery address saved!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (03XXXXXXXXX)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Default City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Street Delivery Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street #, Sector / Colony, Landmark"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Details'}
              </button>
            </form>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-10">
                  <Heart className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-700">Your wishlist is empty</p>
                  <p className="text-xs text-stone-400 mt-1">Tap the heart icon on any accessory to save it here.</p>
                </div>
              ) : (
                wishlistProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-stone-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100"
                      />
                      <div>
                        <p className="text-xs font-semibold text-stone-900">{prod.name}</p>
                        <p className="text-xs font-mono text-rose-700 font-bold">Rs. {prod.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCustomerAccountOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white border border-stone-200 hover:border-stone-300 rounded-lg text-xs font-medium text-stone-700 cursor-pointer"
                    >
                      View in Wishlist &rarr;
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Account ID: {customerUser?.id?.slice(0, 8)}...
          </span>

          <button
            onClick={() => {
              signOutCustomer();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountModal;
