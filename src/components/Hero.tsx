import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Gift, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import heroBannerImg from '../assets/images/hero_accessories_showcase_1790671724566.jpg';

export const Hero: React.FC = () => {
  const { setActiveCategory, openOrderTrackerWithId } = useShop();

  const handleExploreClick = (category = 'all') => {
    setActiveCategory(category as any);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Editorial Sub-kicker - clean unboxed typography */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 tracking-wider uppercase">
              <span className="text-rose-700 font-semibold">New Season 2026</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>Handcrafted & Curated in Pakistan</span>
            </div>

            {/* Display Headline with balanced wrap */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.15] text-balance">
              Dainty charm for everyday moments & sweet celebrations.
            </h1>

            {/* Prose Description */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Discover cute hair clips, Korean-inspired clover jewelry, elegant gift hampers, and gentle baby accessories designed to bring effortless joy to your style.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => handleExploreClick('all')}
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>Shop New Drops</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handleExploreClick('gift-sets')}
                className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-full text-sm font-medium transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <span>Explore Gift Hampers</span>
              </button>
            </div>

            {/* Trust Markers - Quiet typography without flashy badge clutter */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-stone-900 font-medium text-xs sm:text-sm">
                  <Truck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">All cities in Pakistan</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-stone-900 font-medium text-xs sm:text-sm">
                  <Gift className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Luxe Packaging</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Satin ribbon & card</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-stone-900 font-medium text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Non-Tarnish</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Hypoallergenic alloy</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Campaign Focal Point */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Image Frame with soft shadow & subtle hairline border */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xl aspect-16/11 sm:aspect-16/10">
                <img
                  src={heroBannerImg}
                  alt="Komal Accessories Luxury Curated Collection"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-103"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle scrim for media highlight */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between text-white pointer-events-auto">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-medium">
                      Featured Edit
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-white drop-shadow-xs">
                      The Pastel & Pearl Edit
                    </h3>
                  </div>

                  <button
                    onClick={() => handleExploreClick('teen-cute')}
                    className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-stone-900 rounded-full text-xs font-medium backdrop-blur-sm transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    View Edit
                  </button>
                </div>
              </div>

              {/* Quiet floating badge on bottom left - understated & functional */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-4 bg-white border border-stone-200 rounded-xl p-3 shadow-lg flex items-center gap-3 max-w-[210px] hidden sm:flex">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">4.9 / 5 Rating</p>
                  <p className="text-[11px] text-stone-500">840+ verified buyers</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
