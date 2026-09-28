import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ImageFallback } from '../components/ImageFallback.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface WishlistPageProps {
  navigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product: any) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard', 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <Heart className="w-16 h-16 stroke-[1] text-[#A8A29E] mx-auto" />
        <h1 className="text-3xl font-serif text-[#1C1917]">Your Curated Wishlist is Empty</h1>
        <p className="text-xs text-[#78716C] max-w-sm mx-auto">
          Save pieces from our seasonal runway and atelier collections to revisit when planning your wardrobe.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[#1C1917] text-white py-3.5 px-8 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E7E5E4] pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#78716C] block mb-1">
            Personal Atelier Vault
          </span>
          <h1 className="text-3xl font-serif text-[#1C1917]">
            Saved Curations ({wishlist.length})
          </h1>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#78716C] flex items-center gap-1 cursor-pointer"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-white border border-[#E7E5E4] overflow-hidden"
          >
            <div
              onClick={() => navigate(`/product/${product.slug || product.id}`)}
              className="relative aspect-[3/4] bg-[#F5F5F3] overflow-hidden cursor-pointer"
            >
              <ImageFallback
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(product.id);
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-[#78716C] hover:text-rose-600 transition-colors shadow-sm cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
              <div>
                <span className="text-[11px] tracking-wider uppercase text-[#78716C] block">
                  {product.category} · {product.origin.split(' in ')[1] || 'Europe'}
                </span>
                <h3
                  onClick={() => navigate(`/product/${product.slug || product.id}`)}
                  className="text-sm font-medium text-[#1C1917] hover:underline cursor-pointer line-clamp-1 mt-1"
                >
                  {product.title}
                </h3>
                <span className="text-sm font-medium text-[#1C1917] tabular-nums block mt-1">
                  ${product.price}
                </span>
              </div>

              <button
                onClick={() => handleMoveToBag(product)}
                disabled={!product.inStock}
                className="w-full bg-[#1C1917] text-white py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
