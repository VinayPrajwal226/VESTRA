import React, { useEffect, useState } from 'react';
import { Edit2, PlusCircle, Trash2, X } from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { Category } from '../types/index.ts';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      if (res.success) setCategories(res.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('Curated garments tailored for timeless permanence.');
    setImage('/src/assets/images/product_cashmere_overcoat_1790603713161.jpg');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this collection discipline?')) return;
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { name, description, image });
      } else {
        await api.createCategory({ name, description, image });
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error('Category save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block mb-1">
            Taxonomy Management
          </span>
          <h1 className="text-3xl font-serif text-[#1C1917]">Collection Categories</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-[#1C1917] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Category Discipline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-[#E7E5E4] flex flex-col justify-between overflow-hidden"
          >
            <div className="aspect-[16/9] bg-[#F5F5F3] overflow-hidden relative">
              <ImageFallback src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold uppercase px-2 py-0.5 border border-[#E7E5E4]">
                {cat.itemCount} Garments
              </div>
            </div>

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif text-[#1C1917]">{cat.name}</h3>
                <span className="text-[11px] font-mono text-[#78716C] block">/category/{cat.slug}</span>
                <p className="text-xs text-[#57534E] mt-2 line-clamp-2">{cat.description}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E7E5E4]">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-[#78716C] hover:text-rose-600 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/50" />
          <div className="relative bg-[#FAFAF9] border border-[#E7E5E4] max-w-md w-full p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-2">
              <h2 className="font-serif text-lg text-[#1C1917]">
                {editingCategory ? 'Edit Discipline' : 'Add Discipline'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-[#78716C]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E5E4] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
