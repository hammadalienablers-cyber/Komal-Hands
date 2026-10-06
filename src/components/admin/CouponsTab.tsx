import React, { useState } from 'react';
import { Plus, Tag, Trash2, Check, X, Percent, DollarSign, AlertCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Coupon } from '../../types';

export const CouponsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useShop();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(1000);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please provide a coupon code.');
      return;
    }

    if (coupons.some((c) => c.code === cleanCode)) {
      setError(`Coupon code "${cleanCode}" already exists.`);
      return;
    }

    addCoupon({
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue) || 0,
      minOrderValue: Number(minOrder) || 0,
      isActive: true,
      description: description.trim() || undefined,
    });

    setCode('');
    setDiscountValue(10);
    setMinOrder(1000);
    setDescription('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="font-serif text-xl font-medium text-stone-900">
            Discount Coupons & Promotional Offers
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure discount codes for customers to apply in their cart during checkout.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lg text-stone-900 tracking-wider">
                  {coupon.code}
                </span>

                <button
                  onClick={() => toggleCoupon(coupon.code)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                    coupon.isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                  {coupon.discountType === 'percentage' ? (
                    <>
                      <Percent className="w-4 h-4 text-rose-700" />
                      <span>{coupon.discountValue}% Off Subtotal</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      <span>Rs. {coupon.discountValue} Flat Discount</span>
                    </>
                  )}
                </div>

                <p className="text-stone-500 text-[11px]">
                  Min. Cart Requirement: <strong className="font-mono text-stone-800">Rs. {coupon.minOrderValue.toLocaleString()}</strong>
                </p>

                {coupon.description && (
                  <p className="text-stone-400 text-[11px] italic pt-1 border-t border-stone-200/60">
                    {coupon.description}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400">
                Works in Cart & Checkout
              </span>

              <button
                onClick={() => {
                  if (window.confirm(`Delete coupon "${coupon.code}"?`)) {
                    deleteCoupon(coupon.code);
                  }
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsAddOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-700" />
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Create Promotional Coupon
                </h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Coupon Code (e.g. SUMMER25) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. VIP20"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-stone-800 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Minimum Cart Order (Rs.)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Special weekend promotion"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
