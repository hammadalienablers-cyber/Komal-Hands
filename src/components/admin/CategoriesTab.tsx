import React, { useState } from 'react';
import { Plus, Tag, Edit2, Trash2, Check, X, FolderTree, AlertCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryItem } from '../../types';

export const CategoriesTab: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useShop();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatId, setNewCatId] = useState('');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [error, setError] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanLabel = newCatLabel.trim();
    if (!cleanLabel) {
      setError('Please provide a category title.');
      return;
    }

    // Auto-generate ID if empty or slugify
    const generatedId = newCatId.trim() 
      ? newCatId.trim().toLowerCase().replace(/\s+/g, '-')
      : cleanLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (categories.some((c) => c.id === generatedId)) {
      setError(`A category with identifier "${generatedId}" already exists.`);
      return;
    }

    addCategory({
      id: generatedId,
      label: cleanLabel,
      description: newCatDesc.trim() || undefined,
    });

    setNewCatId('');
    setNewCatLabel('');
    setNewCatDesc('');
    setIsAddOpen(false);
  };

  const startEdit = (c: CategoryItem) => {
    setEditingId(c.id);
    setEditingLabel(c.label);
    setEditingDesc(c.description || '');
  };

  const saveEdit = (id: string) => {
    if (editingLabel.trim()) {
      updateCategory(id, editingLabel.trim(), editingDesc.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="font-serif text-xl font-medium text-stone-900">
            Store Categories Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize products by category. Added categories appear immediately on the storefront navigation and filters.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const productCount = products.filter((p) => c.id === 'all' ? true : p.category === c.id).length;
          const isEditing = editingId === c.id;

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[11px] text-stone-400">slug: {c.id}</span>
                  </div>

                  <span className="font-mono text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-medium">
                    {productCount} items
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      placeholder="Category Title"
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg outline-none font-semibold text-stone-900"
                    />
                    <input
                      type="text"
                      value={editingDesc}
                      onChange={(e) => setEditingDesc(e.target.value)}
                      placeholder="Short description"
                      className="w-full px-2.5 py-1 text-xs border border-stone-200 rounded-lg outline-none text-stone-600"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-base font-semibold text-stone-900">
                      {c.label}
                    </h3>
                    {c.description && (
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {isEditing ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => saveEdit(c.id)}
                      className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 text-stone-500 hover:bg-stone-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] text-stone-400">
                      {c.id === 'all' ? 'System Default' : 'Custom Category'}
                    </span>

                    <div className="flex items-center gap-1">
                      {c.id !== 'all' && (
                        <button
                          onClick={() => startEdit(c)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Category Name"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {c.id !== 'all' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete category "${c.label}"? Products in this category will stay in the store.`)) {
                              deleteCategory(c.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsAddOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-rose-700" />
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Add New Category
                </h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name / Label *
                </label>
                <input
                  type="text"
                  required
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="e.g. Hair Scrunchies & Ribbons"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Unique Slug / ID (Optional - auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  placeholder="e.g. hair-scrunchies"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-stone-800 font-mono text-stone-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Silk, organza and velvet scrunchies"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-stone-800"
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
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
