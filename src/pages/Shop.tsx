import React, { useEffect, useState } from 'react';
import { Filter, Grid, LayoutGrid, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../api/client.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { QuickViewModal } from '../components/QuickViewModal.tsx';
import { Category, Product } from '../types/index.ts';

interface ShopProps {
  navigate: (path: string) => void;
  initialCategory?: string;
}

export const Shop: React.FC<ShopProps> = ({ navigate, initialCategory = 'all' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('featured');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // UI States
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', hex: '#1C1917' },
    { name: 'Camel Tan', hex: '#C19A6B' },
    { name: 'Oatmeal', hex: '#D8CAB8' },
    { name: 'Deep Charcoal', hex: '#262626' },
    { name: 'Optical White', hex: '#FFFFFF' },
    { name: 'British Olive', hex: '#4B5320' },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          limit: 12,
          sort: sortBy,
        };

        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (selectedSize) {
          params.size = selectedSize;
        }
        if (selectedColor) {
          params.color = selectedColor;
        }
        if (minPrice > 0) {
          params.minPrice = minPrice;
        }
        if (maxPrice < 1500) {
          params.maxPrice = maxPrice;
        }

        const res = await api.getProducts(params);
        if (res.success) {
          setProducts(res.products);
          setTotalPages(res.totalPages);
          setTotalCount(res.total);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchQuery, selectedSize, selectedColor, minPrice, maxPrice, sortBy, page]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice(0);
    setMaxPrice(1500);
    setSortBy('featured');
    setPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    selectedSize !== '' ||
    selectedColor !== '' ||
    minPrice > 0 ||
    maxPrice < 1500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-[#E7E5E4] pb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-[#78716C] mb-1">
          Catalog · Ready-to-Wear
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
              {selectedCategory === 'all'
                ? 'All Ready-to-Wear Pieces'
                : categories.find((c) => c.slug === selectedCategory)?.name || 'Garments'}
            </h1>
            <p className="text-xs text-[#78716C] mt-1">
              Showing <span className="font-semibold text-[#1C1917] tabular-nums">{totalCount}</span> crafted pieces
            </p>
          </div>

          {/* Quick Category Tab Buttons (Functional Filter Controls allowed) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-white text-[#78716C] border-[#E7E5E4] hover:text-[#1C1917]'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.slug);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === c.slug
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#78716C] border-[#E7E5E4] hover:text-[#1C1917]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-[#F5F5F3] p-4 border border-[#E7E5E4] flex flex-wrap items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cashmere, blazer, wool..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E7E5E4] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E7E5E4] text-xs font-semibold uppercase tracking-wider text-[#1C1917] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#78716C] uppercase tracking-wider hidden sm:inline">Order:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="bg-white border border-[#E7E5E4] px-3 py-2 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#1C1917] cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Editions</option>
              <option value="price-asc">Price: Ascending</option>
              <option value="price-desc">Price: Descending</option>
              <option value="rating">Collector Rating</option>
            </select>
          </div>

          {/* Grid Layout Switcher */}
          <div className="hidden md:flex items-center border border-[#E7E5E4] bg-white">
            <button
              onClick={() => setGridCols(3)}
              aria-label="3 columns"
              className={`p-2 cursor-pointer transition-colors ${
                gridCols === 3 ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              aria-label="4 columns"
              className={`p-2 cursor-pointer transition-colors ${
                gridCols === 4 ? 'bg-[#1C1917] text-white' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          } bg-[#FAFAF9] lg:bg-transparent p-4 lg:p-0 border lg:border-none border-[#E7E5E4]`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1C1917]">
              Refine Specifications
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#78716C] hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sizing Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C] block">
              Size
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSize('')}
                className={`px-3 py-1 text-xs border cursor-pointer ${
                  selectedSize === ''
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#44403C] border-[#E7E5E4]'
                }`}
              >
                All
              </button>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                  className={`px-3 py-1 text-xs border cursor-pointer transition-colors ${
                    selectedSize === s
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#1C1917]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C] block">
              Color Palette
            </span>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                  title={c.name}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border bg-white cursor-pointer transition-colors ${
                    selectedColor === c.name
                      ? 'border-[#1C1917] ring-1 ring-[#1C1917]'
                      : 'border-[#E7E5E4] hover:border-[#A8A29E]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C] block">
              Price Range ($)
            </span>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] uppercase text-[#78716C] block">Min</label>
                <input
                  type="number"
                  min={0}
                  max={maxPrice}
                  step={50}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#E7E5E4] p-1.5 text-xs tabular-nums focus:outline-none focus:border-[#1C1917]"
                />
              </div>
              <span className="text-xs text-[#78716C] pt-3">—</span>
              <div className="flex-1">
                <label className="text-[10px] uppercase text-[#78716C] block">Max</label>
                <input
                  type="number"
                  min={minPrice}
                  max={2000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#E7E5E4] p-1.5 text-xs tabular-nums focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {loading ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              } gap-6`}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[3/4] bg-[#E7E5E4]" />
                  <div className="h-4 bg-[#E7E5E4] w-3/4" />
                  <div className="h-4 bg-[#E7E5E4] w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#E7E5E4] bg-white p-12 text-center space-y-4">
              <Filter className="w-8 h-8 text-[#A8A29E] mx-auto stroke-[1]" />
              <h3 className="font-serif text-xl text-[#1C1917]">No pieces match your specification</h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                Try widening your price range, clearing specific sizes, or resetting all filters to view our full collection.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold py-2.5 px-6 hover:bg-black transition-colors cursor-pointer"
              >
                Reset All Refinements
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              } gap-6`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={navigate}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-[#E7E5E4] flex items-center justify-between">
              <span className="text-xs text-[#78716C]">
                Page <strong className="text-[#1C1917] tabular-nums">{page}</strong> of{' '}
                <strong className="text-[#1C1917] tabular-nums">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 border border-[#E7E5E4] bg-white text-xs font-semibold uppercase tracking-wider text-[#1C1917] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 border border-[#E7E5E4] bg-white text-xs font-semibold uppercase tracking-wider text-[#1C1917] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={navigate}
      />
    </div>
  );
};
