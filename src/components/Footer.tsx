import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { 
    setActiveCategory, 
    openOrderTrackerWithId, 
    categories, 
    storeSettings, 
    isAdminAuthenticated, 
    setIsAdminMode, 
    setIsAdminLoginOpen 
  } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const handleNavClick = (cat: any) => {
    setActiveCategory(cat);
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
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-800/80 flex items-center justify-center shrink-0 text-rose-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">Available across all 150+ cities in Pakistan.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-800/80 flex items-center justify-center shrink-0 text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Gift Box Packaging</h4>
              <p className="text-xs text-stone-400 mt-1">Every order hand-tied with custom ribbon & card.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-800/80 flex items-center justify-center shrink-0 text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Hypoallergenic & Non-Tarnish</h4>
              <p className="text-xs text-stone-400 mt-1">Tested for sensitive skin, zero nickel or lead.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-800/80 flex items-center justify-center shrink-0 text-rose-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Easy Exchange</h4>
              <p className="text-xs text-stone-400 mt-1">Hassle-free replacement if anything isn't perfect.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand & About */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-serif text-2xl font-medium text-white tracking-tight">
              Komal Accessories
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Pakistan's favorite boutique destination for cute hair clips, Korean-inspired dainty jewelry, chic adult pieces, baby hair accessories, and ready-to-gift hampers.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2 font-medium">
                Follow Our Journey
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-rose-900 text-stone-200 text-xs rounded-lg transition-colors"
                >
                  Instagram @komalaccessories
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => handleNavClick(cat.id)} className="hover:text-white transition-colors cursor-pointer">
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => openOrderTrackerWithId()} className="hover:text-white transition-colors cursor-pointer text-rose-300 font-medium">
                  Track Live Order
                </button>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Delivery & Shipping Rates
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  7-Day Return Policy
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${storeSettings.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Helpline (24/7)
                </a>
              </li>
              <li className="pt-1 border-t border-stone-800">
                <button 
                  onClick={handleAdminClick} 
                  className="hover:text-white transition-colors cursor-pointer text-stone-400 text-[11px]"
                >
                  Store Manager Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & VIP Club */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact & Studio
            </h4>

            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{storeSettings.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href={`tel:${storeSettings.phone}`} className="hover:text-white transition-colors">
                  UAN / Helpline: {storeSettings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <a href={`mailto:${storeSettings.email}`} className="hover:text-white transition-colors">
                  {storeSettings.email}
                </a>
              </div>
            </div>

            {/* Newsletter form with coupon code reward */}
            <div className="pt-2">
              <p className="text-xs text-stone-300 font-medium mb-1.5">
                Get 10% Off Your First Order:
              </p>
              {subscribed ? (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-lg">
                  🎉 Welcome! Use code <strong className="font-mono text-white">KOMAL10</strong> at checkout for 10% off.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white outline-none focus:border-stone-600 placeholder:text-stone-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="flex items-center gap-1">
            <span>© 2026 Komal Accessories. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for accessory lovers.</span>
          </p>

          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Cash on Delivery (COD)</span>
            <span>·</span>
            <span>Visa / Mastercard</span>
            <span>·</span>
            <span>JazzCash & EasyPaisa</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
