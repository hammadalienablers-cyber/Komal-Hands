import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Check, 
  Heart,
  Share2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProduct, 
    setActiveProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setIsCheckoutOpen 
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize selected color and reset quantity on product open
  useEffect(() => {
    if (activeProduct) {
      setSelectedColor(activeProduct.colors[0]?.name || 'Standard');
      setSelectedImageIndex(0);
      setQuantity(1);
      setCopiedLink(false);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeProduct]);

  if (!activeProduct) return null;

  const isFavorited = isInWishlist(activeProduct.id);

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedColor);
    setActiveProduct(null);
  };

  const handleInstantBuy = () => {
    addToCart(activeProduct, quantity, selectedColor);
    setActiveProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeProduct.name,
        text: activeProduct.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setActiveProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Row with Close & Quick Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="uppercase tracking-wider font-semibold text-rose-800">
              {activeProduct.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>SKU: {activeProduct.id.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 rounded-full transition-colors relative"
              title="Share item"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(activeProduct.id)}
              className="p-2 text-stone-500 hover:text-rose-600 hover:bg-stone-200/50 rounded-full transition-colors"
              title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => setActiveProduct(null)}
              className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-200/50 rounded-full transition-colors"
              aria-label="Close product modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Left Column */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Active Image Display */}
              <div className="relative aspect-1/1 bg-[#FAF8F5] rounded-xl border border-stone-200/80 overflow-hidden shadow-xs">
                <img
                  src={activeProduct.images[selectedImageIndex] || activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {activeProduct.badge && (
                  <span className="absolute top-3 left-3 text-xs font-medium tracking-wide uppercase text-stone-800 bg-white/95 px-3 py-1 rounded shadow-xs border border-stone-200">
                    {activeProduct.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails row if multiple images exist */}
              {activeProduct.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {activeProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-rose-700 ring-2 ring-rose-200'
                          : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Fast Delivery Assurance Callout */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-medium text-stone-900">
                  <Truck className="w-4 h-4 text-rose-700" />
                  <span>Doorstep Delivery: 2-3 Business Days</span>
                </div>
                <p>
                  Delivered via Trax or Leopards Courier with instant SMS tracking. Cash on delivery available nationwide.
                </p>
              </div>
            </div>

            {/* Purchase Module Right Column */}
            <div className="md:col-span-6 space-y-6">
              
              {/* Title & Ratings */}
              <div className="space-y-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight">
                  {activeProduct.name}
                </h1>

                <div className="flex items-center gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-stone-800 font-mono tabular-nums">{activeProduct.rating}</span>
                  </div>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-500 font-medium">
                    {activeProduct.reviewCount} Verified Reviews
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-emerald-700 font-medium">
                    In Stock ({activeProduct.stockCount} left)
                  </span>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-stone-100">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                  Rs. {activeProduct.price.toLocaleString()}
                </span>
                {activeProduct.originalPrice > activeProduct.price && (
                  <>
                    <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                      Rs. {activeProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      Save Rs. {(activeProduct.originalPrice - activeProduct.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Color Swatch Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">
                    Selected Color / Style:
                  </span>
                  <span className="font-semibold text-stone-900">{selectedColor}</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {activeProduct.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Buy Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900 font-medium"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono font-medium text-sm tabular-nums text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900 font-medium"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Primary Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · Rs. {(activeProduct.price * quantity).toLocaleString()}</span>
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  onClick={handleInstantBuy}
                  className="w-full py-3 px-5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Zap className="w-4 h-4 text-rose-200" />
                  <span>Instant Buy Now (Cash on Delivery / Card)</span>
                </button>
              </div>

              {/* Product Description */}
              <div className="pt-4 border-t border-stone-100 space-y-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
                <p>{activeProduct.description}</p>

                {/* Bullet Features */}
                <ul className="space-y-1.5 pt-1">
                  {activeProduct.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Specifications Table */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Product Details & Care
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-stone-400 block">Material</span>
                    <span className="text-stone-800 font-medium">{activeProduct.specs.material}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Packaging</span>
                    <span className="text-stone-800 font-medium">{activeProduct.specs.packaging}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Dimensions</span>
                    <span className="text-stone-800 font-medium">{activeProduct.specs.dimensions || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Skin Suitability</span>
                    <span className="text-stone-800 font-medium">{activeProduct.specs.suitability}</span>
                  </div>
                </div>
              </div>

              {/* Quality Guarantee Seal */}
              <div className="flex items-center gap-2 pt-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Quality Checked before dispatch · 7-Day Easy Exchange Policy</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
