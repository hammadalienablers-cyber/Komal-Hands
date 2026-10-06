import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  X, 
  Star, 
  Sparkles,
  ArrowUpDown,
  Tag,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { uploadProductImage } from '../../lib/imageUpload';
import heroImg from '../../assets/images/hero_accessories_showcase_1790671724566.jpg';
import butterflyClipsImg from '../../assets/images/product_butterfly_hairclips_1790671742281.jpg';
import cloverNecklaceImg from '../../assets/images/product_korean_pendant_necklace_1790671757541.jpg';
import giftHamperImg from '../../assets/images/product_luxury_gift_hamper_1790671773811.jpg';
import babyHeadbandsImg from '../../assets/images/product_baby_soft_headbands_1790671790832.jpg';

// Preset Boutique Images for quick replacement
const PRESET_IMAGES = [
  { label: 'Butterfly Hair Clips', url: butterflyClipsImg },
  { label: 'Korean Clover Necklace', url: cloverNecklaceImg },
  { label: 'Velvet Gift Hamper Box', url: giftHamperImg },
  { label: 'Baby Floral Headbands', url: babyHeadbandsImg },
  { label: 'Luxury Hero Collection', url: heroImg },
];

export const ProductsTab: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [replaceImageProduct, setReplaceImageProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Quick Rate Editing state
  const [quickRateId, setQuickRateId] = useState<string | null>(null);
  const [quickRateValue, setQuickRateValue] = useState<number>(0);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[1]?.id || 'teen-cute');
  const [formPrice, setFormPrice] = useState<number>(950);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(1250);
  const [formStock, setFormStock] = useState<number>(20);
  const [formBadge, setFormBadge] = useState('Bestseller');
  const [formDescription, setFormDescription] = useState('');
  const [formMaterial, setFormMaterial] = useState('18K Gold Plated / Eco Acetate Resin');
  const [formDimensions, setFormDimensions] = useState('Standard Size');
  const [formPackaging, setFormPackaging] = useState('Signature Komal Velvet Pouch');
  const [formSuitability, setFormSuitability] = useState('Hypoallergenic & Sensitive Skin Safe');
  const [formImageUrl, setFormImageUrl] = useState(butterflyClipsImg);
  const [formFeatures, setFormFeatures] = useState<string>('Non-tarnish alloy\nGentle hold without pulling hair\nGift packaging included');
  const [formColors, setFormColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Pastel Lilac', hex: '#D8B4E2' },
    { name: 'Blush Pink', hex: '#FFD1BA' },
    { name: 'Warm Gold', hex: '#E5C158' },
  ]);

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormCategory(categories[1]?.id || 'teen-cute');
    setFormPrice(950);
    setFormOriginalPrice(1250);
    setFormStock(20);
    setFormBadge('');
    setFormDescription('');
    setFormImageUrl(butterflyClipsImg);
    setEditingProduct(null);
  };

  // Open Edit Modal populated with existing data
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormStock(p.stockCount);
    setFormBadge(p.badge || '');
    setFormDescription(p.description);
    setFormMaterial(p.specs.material);
    setFormDimensions(p.specs.dimensions || 'Standard');
    setFormPackaging(p.specs.packaging);
    setFormSuitability(p.specs.suitability);
    setFormImageUrl(p.images[0] || butterflyClipsImg);
    setFormFeatures(p.features.join('\n'));
    setFormColors(p.colors.length > 0 ? p.colors : [{ name: 'Standard', hex: '#D8B4E2' }]);
    setIsAddModalOpen(true);
  };

  // Handle Save (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const catObj = categories.find((c) => c.id === formCategory);
    const categoryLabel = catObj?.label || 'Accessories';

    const featuresArray = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const productPayload = {
      name: formName.trim(),
      category: formCategory,
      categoryLabel,
      price: Number(formPrice) || 0,
      originalPrice: Number(formOriginalPrice) || Number(formPrice),
      stockCount: Number(formStock) || 0,
      inStock: Number(formStock) > 0,
      badge: formBadge.trim() || undefined,
      description: formDescription.trim() || 'Curated accessory from Komal Accessories.',
      images: [formImageUrl],
      specs: {
        material: formMaterial.trim() || 'Alloy / Premium Resin',
        dimensions: formDimensions.trim(),
        packaging: formPackaging.trim(),
        suitability: formSuitability.trim(),
      },
      features: featuresArray.length > 0 ? featuresArray : ['High quality finish', 'Gift ready'],
      colors: formColors,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  // Quick Rate update
  const handleQuickRateSubmit = (productId: string) => {
    if (quickRateValue > 0) {
      updateProduct(productId, { price: quickRateValue });
    }
    setQuickRateId(null);
  };

  // Image Upload handler (Compressed to max ~1200px and uploaded to Supabase Storage 'product-images' bucket)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'form' | 'replace') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadRes = await uploadProductImage(file);
      if (uploadRes.success && uploadRes.url) {
        if (target === 'form') {
          setFormImageUrl(uploadRes.url);
        } else if (target === 'replace' && replaceImageProduct) {
          updateProduct(replaceImageProduct.id, { images: [uploadRes.url] });
          setReplaceImageProduct(null);
        }
      } else {
        // If Supabase not yet configured, use local reader fallback so admin testing still works
        console.warn('Storage upload fallback:', uploadRes.error);
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          if (target === 'form') {
            setFormImageUrl(result);
          } else if (target === 'replace' && replaceImageProduct) {
            updateProduct(replaceImageProduct.id, { images: [result] });
            setReplaceImageProduct(null);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image processing failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesSearch = 
      !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="font-serif text-xl font-medium text-stone-900">
            Products & Rates Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add new products, change selling rates instantly, replace images, and manage stock.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or category..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-500"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-stone-500 text-xs flex items-center gap-2">
          <span>Showing:</span>
          <span className="font-mono font-bold text-stone-900">{filteredProducts.length}</span>
          <span>products</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Image & Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Selling Rate (PKR)</th>
                <th className="py-3.5 px-4 font-semibold">Stock Status</th>
                <th className="py-3.5 px-4 font-semibold">Badge</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isEditingRate = quickRateId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Image & Product info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setReplaceImageProduct(p)}
                            title="Replace Image"
                            className="absolute inset-0 bg-stone-900/60 text-white text-[10px] font-medium flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5 mb-0.5" />
                            <span>Replace</span>
                          </button>
                        </div>

                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <p className="font-medium text-stone-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-stone-400 font-mono">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-stone-700 font-medium">
                        {p.categoryLabel}
                      </span>
                    </td>

                    {/* Rate / Price with Instant Quick-Edit */}
                    <td className="py-3 px-4">
                      {isEditingRate ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-stone-400">Rs.</span>
                          <input
                            type="number"
                            autoFocus
                            value={quickRateValue}
                            onChange={(e) => setQuickRateValue(Number(e.target.value))}
                            className="w-24 px-2 py-1 bg-white border border-rose-500 rounded font-mono text-xs outline-none"
                          />
                          <button
                            onClick={() => handleQuickRateSubmit(p.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Save new rate"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setQuickRateId(null)}
                            className="p-1 text-stone-400 hover:bg-stone-100 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <div>
                            <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
                              Rs. {p.price.toLocaleString()}
                            </span>
                            {p.originalPrice > p.price && (
                              <span className="block text-[10px] font-mono text-stone-400 line-through">
                                Rs. {p.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setQuickRateId(p.id);
                              setQuickRateValue(p.price);
                            }}
                            className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-200/50 rounded transition-colors"
                            title="Change Rate / Price"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                          className={`w-3 h-3 rounded-full ${
                            p.inStock && p.stockCount > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          title="Click to toggle in-stock / out-of-stock"
                        />
                        <span className="font-mono text-stone-800">
                          {p.stockCount} units
                        </span>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      {p.badge ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[10px] font-medium uppercase">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-stone-300 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setReplaceImageProduct(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Replace Image"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Full Product Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-8">
            <div className="px-6 py-4 bg-[#FAF9F6] border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  {editingProduct ? 'Edit Product Details & Rates' : 'Add New Product to Store'}
                </h3>
                <p className="text-xs text-stone-500">
                  Directly saved to the catalog and visible on the website immediately.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Pastel Rose Gold Clover Charm Necklace"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-none focus:border-stone-800"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800 cursor-pointer"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Highlight Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Bestseller, Trending, 20% Off, New"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Price Rates & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-900 mb-1">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-stone-300 rounded-lg outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Original Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    placeholder="For strike-through discount"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-lg outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Available Stock Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-lg outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Product Image Selection & Upload */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-700">
                  Product Image *
                </label>

                {/* Preview & Selector */}
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                    <img src={formImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 shadow-2xs">
                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{isUploading ? 'Uploading to Bucket...' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'form')}
                        />
                      </label>

                      <span className="text-stone-400">or pick boutique presets:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImageUrl(preset.url)}
                          className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                            formImageUrl === preset.url
                              ? 'bg-rose-100 border-rose-400 text-rose-900 font-medium'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image URL input */}
                <div>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Or enter direct image URL (https://...)"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg outline-none font-mono text-stone-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe material, look, style, and care..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800 resize-none"
                />
              </div>

              {/* Features (one per line) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bullet Features (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl outline-none focus:border-stone-800 font-mono resize-none"
                />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Material Details</label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="e.g. 18K Gold Plated Brass"
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Packaging Box/Pouch</label>
                  <input
                    type="text"
                    value={formPackaging}
                    onChange={(e) => setFormPackaging(e.target.value)}
                    placeholder="e.g. Velvet Keepsake Box"
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Quick Replace Image Modal */}
      {replaceImageProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setReplaceImageProduct(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Replace Product Image
                </h3>
                <p className="text-xs text-stone-500 line-clamp-1">{replaceImageProduct.name}</p>
              </div>
              <button
                onClick={() => setReplaceImageProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                <div className="w-20 h-20 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                  <img src={replaceImageProduct.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <p className="text-stone-600">Current visual asset in catalog.</p>
                  <label className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading ? 'Uploading to Bucket...' : 'Upload New Photo from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'replace')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">
                  Or pick from curated studio presets:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateProduct(replaceImageProduct.id, { images: [preset.url] });
                        setReplaceImageProduct(null);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 hover:border-stone-400 text-left transition-colors cursor-pointer"
                    >
                      <img src={preset.url} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
