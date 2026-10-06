import React from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setActiveProduct 
  } = useShop();

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    setActiveProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors[0]?.name);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Visual Product Showcase Container (65-75% visual weight) */}
      <div className="relative aspect-4/3 sm:aspect-1/1 w-full bg-[#FAF8F5] overflow-hidden">
        
        {/* Subtle Text Tag (at most 1 subtle indicator, anti-pill discipline) */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[11px] font-medium tracking-wide uppercase text-stone-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs border border-stone-200/60">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-xs transition-all shadow-xs ${
            isFavorited 
              ? 'bg-rose-50 text-rose-600' 
              : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Primary Product Image with fallback styling */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Safe fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Quick View & Quick Add Action Overlays for Desktop */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={handleCardClick}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-stone-900 text-xs font-medium rounded-lg shadow-md flex items-center justify-center gap-1.5 backdrop-blur-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
            title="Quick add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Product Content & Pricing */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Category & Rating Row - Unboxed text metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
            <span className="uppercase tracking-wider text-[11px] font-medium text-stone-400">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums text-stone-700 font-medium">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-medium text-sm sm:text-base text-stone-900 group-hover:text-rose-950 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Color Preview Swatches */}
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-400">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>

        {/* Pricing Baseline with Tabular Figures */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-stone-900 text-base font-mono tabular-nums">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[11px] text-emerald-700 font-medium">
            In Stock
          </span>
        </div>
      </div>
    </article>
  );
};
