import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, Shield, Sparkles } from 'lucide-react';
import { api } from '../api/client.ts';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { QuickViewModal } from '../components/QuickViewModal.tsx';
import { Category, Product } from '../types/index.ts';

interface HomeProps {
  navigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ limit: 4, sort: 'featured' }),
          api.getCategories(),
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.products);
        if (catRes.success) setCategories(catRes.categories);
      } catch (e) {
        console.error('Error loading storefront data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. STOREFRONT HERO: Architectural Campaign Focal Point */}
      <section className="relative w-full border-b border-[#E7E5E4] bg-[#F5F5F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative Frame */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#78716C]">
                <span>Autumn / Winter Collection</span>
                <span aria-hidden="true">·</span>
                <span>Atelier Drop 01</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#1C1917] leading-[1.08] tracking-tight">
                Architectural silhouettes tailored for permanence.
              </h1>

              <p className="text-base text-[#57534E] leading-relaxed max-w-lg">
                Crafted from double-face Grade-A Mongolian cashmere and Super 130s Italian virgin wool.
                Devoid of superfluous ornamentation, cut with deliberate restraint.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-[#1C1917] text-white py-3.5 px-8 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/category/outerwear')}
                  className="bg-transparent border border-[#1C1917] text-[#1C1917] py-3.5 px-7 text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all cursor-pointer"
                >
                  View Outerwear
                </button>
              </div>

              {/* Provenance note */}
              <div className="pt-6 border-t border-[#E7E5E4] flex items-center gap-6 text-xs text-[#78716C]">
                <div>
                  <span className="block font-semibold text-[#1C1917]">Biella & Porto</span>
                  <span>Artisanal Weaving</span>
                </div>
                <div className="w-[1px] h-8 bg-[#E7E5E4]" />
                <div>
                  <span className="block font-semibold text-[#1C1917]">Zero Synthetics</span>
                  <span>100% Noble Fibers</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Frame */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden border border-[#E7E5E4] shadow-lg">
                <ImageFallback
                  src="/src/assets/images/hero_vestra_editorial_1790603696949.jpg"
                  alt="VESTRA Autumn / Winter Campaign"
                  fallbackTitle="VESTRA Editorial"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-4 py-2 border border-[#E7E5E4] text-[11px] text-[#44403C]">
                  <span className="font-semibold text-[#1C1917] uppercase tracking-wider block">
                    Double-Breasted Cashmere & Structured Suiting
                  </span>
                  <span>Biella Mill Run · Limited Edition of 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES: Direct Gateways */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E7E5E4] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block mb-1">
              Curated Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">
              The Garment Disciplines
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs uppercase tracking-wider text-[#1C1917] font-semibold hover:text-[#78716C] transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Garments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="group relative aspect-[4/5] overflow-hidden bg-[#F5F5F3] border border-[#E7E5E4] cursor-pointer flex flex-col justify-end p-6"
            >
              <ImageFallback
                src={cat.image}
                alt={cat.name}
                fallbackTitle={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="relative z-10 text-white space-y-1">
                <span className="text-[11px] tracking-widest uppercase text-[#D6D3D1] font-medium block">
                  {cat.itemCount} Garments
                </span>
                <h3 className="text-2xl font-serif font-normal">{cat.name}</h3>
                <p className="text-xs text-[#E7E5E4] line-clamp-2 max-w-xs pt-1 opacity-90">
                  {cat.description}
                </p>
                <div className="pt-3 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore discipline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PIECES: Core Catalog Focus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E7E5E4] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block mb-1">
              Select Curations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">
              Signature Foundation Pieces
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs uppercase tracking-wider text-[#1C1917] font-semibold hover:text-[#78716C] transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Full Catalog ({featuredProducts.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-[#E7E5E4]" />
                <div className="h-4 bg-[#E7E5E4] w-2/3" />
                <div className="h-4 bg-[#E7E5E4] w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={navigate}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. STORY & CRAFTSMANSHIP: Atelier Provenance */}
      <section className="border-t border-b border-[#E7E5E4] bg-[#F5F5F3] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block">
                The Atelier Manifesto
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1917] leading-tight">
                "We do not design for seasons. We engineer garments intended to outlive the wearer."
              </h2>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Every VESTRA pattern begins with millimeter-accurate spatial architecture. Our mills
                in Biella, Italy produce custom yarn densities that resist sagging, pilling, and shape
                distortion over decades of regular wearing.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border-l-2 border-[#1C1917] pl-4 space-y-1">
                  <span className="text-2xl font-serif text-[#1C1917]">620 gsm</span>
                  <p className="text-xs text-[#78716C]">
                    Heavyweight double-face cashmere density
                  </p>
                </div>
                <div className="border-l-2 border-[#1C1917] pl-4 space-y-1">
                  <span className="text-2xl font-serif text-[#1C1917]">100% Traceable</span>
                  <p className="text-xs text-[#78716C]">
                    Raw fibers verified at farm and pasture level
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/about')}
                  className="text-xs uppercase tracking-widest font-semibold text-[#1C1917] hover:text-[#78716C] transition-colors inline-flex items-center gap-1 cursor-pointer underline underline-offset-4"
                >
                  <span>Read our material traceability commitment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full border border-[#E7E5E4] overflow-hidden shadow-md">
                <ImageFallback
                  src="/src/assets/images/product_minimalist_suit_1790603724383.jpg"
                  alt="Tailoring atelier details"
                  fallbackTitle="VESTRA Atelier Tailoring"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
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
