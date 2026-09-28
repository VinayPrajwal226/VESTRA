import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { QuickViewModal } from '../components/QuickViewModal.tsx';
import { Category, Product } from '../types/index.ts';

interface CategoryPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, navigate }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategory(slug),
          api.getProducts({ category: slug, limit: 20 }),
        ]);

        if (catRes.success) setCategory(catRes.category);
        if (prodRes.success) setProducts(prodRes.products);
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Collections</span>
        </button>
      </div>

      {/* Editorial Category Header Banner */}
      <section className="relative overflow-hidden bg-[#F5F5F3] border border-[#E7E5E4]">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
              Curated Discipline
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1917]">
              {category?.name || slug}
            </h1>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-xl">
              {category?.description ||
                'Garments engineered with architectural proportion, noble raw fibers, and meticulous tailoring.'}
            </p>
            <div className="pt-2 text-xs text-[#78716C]">
              <span>{products.length} exclusive editions available</span>
            </div>
          </div>

          <div className="md:col-span-5 aspect-[16/10] md:aspect-auto md:h-full relative overflow-hidden">
            <ImageFallback
              src={category?.image || '/src/assets/images/product_cashmere_overcoat_1790603713161.jpg'}
              alt={category?.name || slug}
              className="w-full h-full object-cover min-h-[260px]"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
          <h2 className="text-lg font-serif text-[#1C1917]">
            Available Pieces in {category?.name || slug}
          </h2>
          <span className="text-xs text-[#78716C] tabular-nums">
            {products.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-[#E7E5E4]" />
                <div className="h-4 bg-[#E7E5E4] w-2/3" />
                <div className="h-4 bg-[#E7E5E4] w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E7E5E4] space-y-3">
            <p className="font-serif text-lg text-[#1C1917]">New editions currently in loom</p>
            <p className="text-xs text-[#78716C]">
              Pieces for this discipline are being tailored in our Biella atelier. Check back shortly.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 bg-[#1C1917] text-white py-2 px-6 text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Browse Full Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={navigate}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={navigate}
      />
    </div>
  );
};
