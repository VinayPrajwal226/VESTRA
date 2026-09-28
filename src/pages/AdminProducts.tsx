import React, { useEffect, useState } from 'react';
import {
  Check,
  Edit2,
  Minus,
  Plus,
  PlusCircle,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { Category, Product } from '../types/index.ts';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('outerwear');
  const [price, setPrice] = useState('500');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stockCount, setStockCount] = useState('15');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [origin, setOrigin] = useState('Biella, Italy');
  const [fit, setFit] = useState('Relaxed tailored silhouette');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories(),
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSubtitle('Pure Virgin Wool · Half-Canvas');
    setCategory('outerwear');
    setPrice('580');
    setOriginalPrice('');
    setStockCount('12');
    setDescription('Architectural tailoring engineered for daily permanence.');
    setMaterials('100% Super 130s Virgin Wool; Viscose lining');
    setCareInstructions('Specialist dry clean only.');
    setOrigin('Handcrafted in Biella, Italy');
    setFit('Contemporary structured fit');
    setImageUrl('/src/assets/images/product_cashmere_overcoat_1790603713161.jpg');
    setUploadedFile(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSubtitle(p.subtitle || '');
    setCategory(p.category);
    setPrice(String(p.price));
    setOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setStockCount(String(p.stockCount));
    setDescription(p.description);
    setMaterials(p.materials);
    setCareInstructions(p.careInstructions);
    setOrigin(p.origin);
    setFit(p.fit);
    setImageUrl(p.images[0] || '');
    setUploadedFile(null);
    setModalOpen(true);
  };

  const handleStockAdjust = async (productId: string, delta: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const newStock = Math.max(0, target.stockCount + delta);
    try {
      await api.updateProduct(productId, { stockCount: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p))
      );
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Confirm deletion of this garment from the atelier catalog?')) return;
    try {
      await api.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Delete product failed:', err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage('');

    try {
      let finalImageUrl = imageUrl;

      // Handle file upload if a file was selected
      if (uploadedFile) {
        setUploading(true);
        const upRes = await api.uploadMedia(uploadedFile);
        if (upRes.success && upRes.media) {
          finalImageUrl = upRes.media.url;
        }
        setUploading(false);
      }

      const payload = {
        title,
        subtitle,
        category: category.toLowerCase(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stockCount: Number(stockCount),
        description,
        materials,
        careInstructions,
        origin,
        fit,
        images: [finalImageUrl],
      };

      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, payload);
        if (res.success) {
          setStatusMessage('Garment updated.');
          setModalOpen(false);
          loadData();
        }
      } else {
        const res = await api.createProduct(payload);
        if (res.success) {
          setStatusMessage('New garment created.');
          setModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Action failed.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.materials.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block mb-1">
            Inventory & Design Catalog
          </span>
          <h1 className="text-3xl font-serif text-[#1C1917]">Garment Registry</h1>
          <p className="text-xs text-[#78716C] mt-1">
            Manage fabric specifications, sizing stock, and atelier pricing.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-[#1C1917] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-[#E7E5E4]">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by garment title or fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAFAF9] border border-[#E7E5E4] text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#78716C] uppercase tracking-wider">Discipline:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#FAFAF9] border border-[#E7E5E4] px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917] cursor-pointer"
          >
            <option value="all">All Disciplines</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E7E5E4] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[#78716C] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Garment</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock Units</th>
              <th className="py-3.5 px-4">Origin</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4]">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-[#FAFAF9] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-[#F5F5F3] border border-[#E7E5E4] overflow-hidden shrink-0">
                      <ImageFallback src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1C1917] block text-sm">{p.title}</span>
                      <span className="text-[#78716C] text-[11px] block">{p.subtitle}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 uppercase text-[11px] text-[#78716C]">
                  {p.category}
                </td>
                <td className="py-3 px-4 font-semibold text-[#1C1917] tabular-nums">
                  ${p.price}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStockAdjust(p.id, -1)}
                      className="p-1 border border-[#E7E5E4] text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span
                      className={`font-semibold tabular-nums px-1 ${
                        p.stockCount <= 5 ? 'text-amber-800' : 'text-[#1C1917]'
                      }`}
                    >
                      {p.stockCount}
                    </span>
                    <button
                      onClick={() => handleStockAdjust(p.id, 1)}
                      className="p-1 border border-[#E7E5E4] text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#78716C]">
                  {p.origin}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    title="Edit Garment"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-[#78716C] hover:text-rose-600 cursor-pointer"
                    title="Delete Garment"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative bg-[#FAFAF9] border border-[#E7E5E4] max-w-2xl w-full p-6 sm:p-8 z-10 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <h2 className="text-xl font-serif text-[#1C1917]">
                {editingProduct ? 'Modify Garment Record' : 'Register New Garment'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Subtitle Specification
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="tailoring">Tailoring</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="essentials">Essentials</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div className="space-y-2 border-t border-b border-[#E7E5E4] py-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                  Garment Visual Presentation (File Upload or Path)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#78716C] mb-1">
                      Upload from Local Computer (Multer File Upload)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-[#78716C] file:mr-3 file:py-1.5 file:px-3 file:border file:border-[#E7E5E4] file:bg-white file:text-xs file:font-semibold file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#78716C] mb-1">
                      Or Image URL / Asset Path
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Composition & Materials
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Atelier Origin
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-white border border-[#E7E5E4] p-2 text-xs focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E5E4] bg-white text-xs font-semibold uppercase tracking-wider hover:bg-[#F5F5F3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving || uploading ? 'Preserving...' : editingProduct ? 'Save Alterations' : 'Register Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
