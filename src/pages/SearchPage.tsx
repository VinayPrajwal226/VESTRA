import React, { useEffect, useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { api } from '../api/client.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { Product } from '../types/index.ts';

interface SearchPageProps {
  navigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ navigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestedSearches = [
    'Cashmere',
    'Virgin Wool',
    'Trench',
    'Blazer',
    'Trousers',
    'Egyptian Cotton',
    'Bridle Leather',
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query.trim(), limit: 12 });
        if (res.success) setResults(res.products);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Search Input Hero */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block">
          Archive Search
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917]">
          Discover Garments & Fibers
        </h1>

        <div className="relative">
          <Search className="w-5 h-5 text-[#78716C] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="Search by silhouette, material, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-[#E7E5E4] text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-[#78716C]">
          <span>Popular inquiries:</span>
          {suggestedSearches.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2.5 py-1 bg-[#F5F5F3] hover:bg-[#E7E5E4] text-[#44403C] transition-colors border border-[#E7E5E4] cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-[#E7E5E4]" />
                <div className="h-4 bg-[#E7E5E4] w-2/3" />
                <div className="h-4 bg-[#E7E5E4] w-1/3" />
              </div>
            ))}
          </div>
        ) : query && results.length === 0 ? (
          <div className="p-16 text-center border border-[#E7E5E4] bg-white max-w-lg mx-auto space-y-3">
            <h3 className="font-serif text-xl text-[#1C1917]">No records for "{query}"</h3>
            <p className="text-xs text-[#78716C]">
              We couldn't locate garments matching that exact specification. Consider browsing our entire collection.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 bg-[#1C1917] text-white py-2 px-6 text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Browse Complete Catalog
            </button>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <span className="text-xs text-[#78716C]">
                Found <strong className="text-[#1C1917] tabular-nums">{results.length}</strong> matching creations
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={navigate} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
