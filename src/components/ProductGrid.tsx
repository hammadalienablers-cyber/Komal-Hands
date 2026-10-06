import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { ProductCategory } from '../types';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    categories, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery 
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Filtering & Sorting using dynamic store products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.categoryLabel.toLowerCase().includes(q) ||
        item.colors.some(c => c.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured (bestsellers first)
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Curated Accessories
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight mt-1">
              Explore Our Collection
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              From everyday hair claws and teen charms to delicate gold jewelry and bespoke gift sets.
            </p>
          </div>

          {/* Active Filter Counter & Quick Sort Selector */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none outline-none font-medium text-stone-900 cursor-pointer text-xs"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Bar: Segmented Category Buttons + Search Row */}
        <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs (Interactive buttons with clear active states) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Inline Search Bar */}
          <div className="relative min-w-[240px] md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, color, style..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400 text-stone-800 placeholder:text-stone-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-stone-500 pb-6">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-semibold text-stone-900 font-mono tabular-nums">
              {filteredProducts.length}
            </span>
            <span>products</span>
            {searchQuery && (
              <span className="italic text-stone-600">for "{searchQuery}"</span>
            )}
          </div>

          {(activeCategory !== 'all' || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-xs text-rose-800 hover:text-rose-950 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Product Grid - 3 to 4 Column Layout with generous whitespace */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200/80 p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900">No items found</h3>
            <p className="text-sm text-stone-500 mt-2">
              We couldn't find any accessories matching your search "{searchQuery}". Try browsing all categories or clear search filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-6 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              View All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
