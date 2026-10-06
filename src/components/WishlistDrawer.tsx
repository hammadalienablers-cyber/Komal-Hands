import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    addToCart,
    setActiveProduct 
  } = useShop();

  if (!isWishlistOpen) return null;

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    addToCart(product, 1, product.colors[0]?.name);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-serif text-lg font-medium text-stone-900">
                My Saved Wishlist
              </h2>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono tabular-nums">
                {savedProducts.length}
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close wishlist drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedProducts.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-stone-900">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Click the heart icon on any hair clip or jewelry piece to save your favorite picks for later!
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Browse Items
                </button>
              </div>
            ) : (
              savedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs relative"
                >
                  {/* Thumbnail */}
                  <div 
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setActiveProduct(product);
                    }}
                    className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setActiveProduct(product);
                          }}
                          className="text-xs sm:text-sm font-medium text-stone-900 hover:text-rose-900 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="font-mono tabular-nums text-xs font-semibold text-stone-900 mt-1">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="mt-2 py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {savedProducts.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200">
              <button
                onClick={() => {
                  savedProducts.forEach((p) => addToCart(p, 1, p.colors[0]?.name));
                  setIsWishlistOpen(false);
                }}
                className="w-full py-3 px-4 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag ({savedProducts.length} items)</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
