import React, { useState } from 'react';
import { Settings, Save, RotateCcw, CheckCircle2, ShieldCheck, Truck, Phone, Bell, Download, Github } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings, resetToDefaults } = useShop();

  const [form, setForm] = useState(storeSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all store data (products, categories, coupons, orders) to factory default demonstration data?')) {
      resetToDefaults();
      setForm(storeSettings);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <h2 className="font-serif text-xl font-medium text-stone-900">
          Store Configuration & Shipping Rates
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage shipping thresholds, helpline contact details, and top announcement text across the website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Shipping & Delivery Rates Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Truck className="w-5 h-5 text-rose-700" />
            <h3 className="font-serif text-base font-semibold text-stone-900">
              Delivery Rates & Free Shipping
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Free Shipping Threshold (Rs.)
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs outline-none focus:border-stone-800"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Orders equal or greater than this get automatically free express shipping.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Standard Courier Delivery Fee (Rs.)
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.standardShippingFee}
                onChange={(e) => setForm({ ...form, standardShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs outline-none focus:border-stone-800"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Charged when total order is below free shipping threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Announcement Bar & Branding Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Bell className="w-5 h-5 text-rose-700" />
            <h3 className="font-serif text-base font-semibold text-stone-900">
              Header Announcement & Branding
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Top Announcement Bar Notice
              </label>
              <input
                type="text"
                required
                value={form.announcementText}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                placeholder="e.g. Free Express Delivery on orders over Rs. 2,000 | 100% Cash on Delivery"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Contact & Studio Details */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Phone className="w-5 h-5 text-rose-700" />
            <h3 className="font-serif text-base font-semibold text-stone-900">
              Customer Support & Physical Studio
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Customer Care Helpline / Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                WhatsApp Number (without leading +)
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="e.g. 923001234567"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Studio Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* GitHub Export & Source Code Download Card */}
        <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-white">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-white">
                  Export Project for GitHub (Full ZIP)
                </h3>
                <p className="text-xs text-stone-400">
                  Includes full frontend, admin portal, products, components, images & config.
                </p>
              </div>
            </div>

            <a
              href="/komal-accessories-full-source.zip"
              download="komal-accessories-full-source.zip"
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete ZIP (3.5 MB)</span>
            </a>
          </div>

          <div className="space-y-2 text-xs text-stone-300">
            <p className="font-semibold text-stone-200">How to push this zip file to your GitHub repository:</p>
            <div className="p-3 bg-stone-950 rounded-xl font-mono text-[11px] text-stone-300 space-y-1 overflow-x-auto border border-stone-800">
              <p className="text-stone-500"># 1. Unzip the file and open folder in terminal</p>
              <p>git init</p>
              <p>git add .</p>
              <p>git commit -m "feat: Komal Accessories storefront and backend admin portal"</p>
              <p>git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git</p>
              <p>git branch -M main</p>
              <p>git push -u origin main --force</p>
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>

          {savedSuccess && (
            <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Store Data to Defaults</span>
          </button>
        </div>

      </form>

    </div>
  );
};
